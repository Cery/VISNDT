import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { ContentStatus, FileAssetStatus, FileEntityType, FileType, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Express } from 'express';

/** Allowed MIME types for upload */
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
];

/** Maximum file size: 10MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Query params for the read-only unified file list endpoint (ADMIN only). */
export interface ListFilesQuery {
  page?: string;
  pageSize?: string;
  fileType?: string;
  entityType?: string;
  organizationId?: string;
  search?: string;
}

@Injectable()
export class FileAssetService {
  private readonly logger = new Logger(FileAssetService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  /**
   * Validate file before upload.
   * Throws if file is invalid.
   */
  validateFile(file: Express.Multer.File): void {
    if (!file) {
      this.logger.error('No file provided');
      throw new Error('No file provided');
    }

    if (file.size > MAX_FILE_SIZE) {
      this.logger.error(`File too large: ${file.size} bytes`);
      throw new Error(
        `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      this.logger.error(`Unsupported MIME type: ${file.mimetype}`);
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }
  }

  /**
   * Upload a file and create a FileAsset record.
   *
   * @param file - Multer file object
   * @param userId - Uploader's user ID
   * @param entityType - Owning entity type (defaults to PRODUCT)
   * @returns Created FileAsset record
   */
  async upload(
    file: Express.Multer.File,
    userId: string,
    entityType: FileEntityType = FileEntityType.PRODUCT,
    fileType?: FileType,
  ) {
    this.validateFile(file);

    const ext = file.originalname.split('.').pop() || 'bin';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const storageKey = `uploads/${timestamp}-${randomUUID()}.${ext}`;

    this.logger.log(
      `Uploading file: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`,
    );

    // Resolve the uploader's organization for supplier-level isolation.
    const uploader = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true },
    });

    // Upload to S3/MinIO
    await this.storage.upload(file.buffer, storageKey, file.mimetype);

    // Create FileAsset record in database
    const fileAsset = await this.prisma.fileAsset.create({
      data: {
        entityType,
        entityId: '00000000-0000-0000-0000-000000000000', // Placeholder — will be linked via owning entity media
        fileType: fileType ?? this.mapMimeTypeToFileType(file.mimetype),
        fileName: file.originalname,
        storageKey,
        mimeType: file.mimetype,
        fileSize: file.size,
        uploadedBy: userId,
        organizationId: uploader?.organizationId ?? null,
        status: FileAssetStatus.ACTIVE,
      },
    });

    this.logger.log(`FileAsset created: ${fileAsset.id}`);
    return fileAsset;
  }

  /**
   * Get a signed download URL for a file.
   *
   * Public access is gated by the owning entity's publication state:
   * - Content-linked files are only downloadable when the Content is PUBLISHED.
   * - Non-content files keep their previous (public) behavior.
   *
   * @param id - FileAsset ID
   * @returns Pre-signed URL
   */
  async download(id: string) {
    const fileAsset = await this.prisma.fileAsset.findUnique({
      where: { id },
    });

    if (!fileAsset) {
      throw new NotFoundException(`FileAsset ${id} not found`);
    }

    // Content-linked files must belong to a PUBLISHED Content to be publicly accessible.
    if (fileAsset.entityType === FileEntityType.CONTENT) {
      const contentMedias = await this.prisma.contentMedia.findMany({
        where: { fileAssetId: id },
        include: { content: { select: { status: true } } },
      });

      const content = contentMedias[0]?.content;
      if (!content) {
        throw new ForbiddenException('File is not linked to any content');
      }
      if (content.status !== ContentStatus.PUBLISHED) {
        throw new ForbiddenException('Content is not published');
      }
    }

    const url = await this.storage.getSignedUrl(fileAsset.storageKey);
    return { url, fileName: fileAsset.fileName, mimeType: fileAsset.mimeType };
  }

  /**
   * Delete a file from S3/MinIO and remove the database record.
   *
   * @param id - FileAsset ID
   */
  async delete(id: string) {
    const fileAsset = await this.prisma.fileAsset.findUnique({
      where: { id },
    });

    if (!fileAsset) {
      throw new NotFoundException(`FileAsset ${id} not found`);
    }

    // Delete from S3/MinIO
    await this.storage.deleteObject(fileAsset.storageKey);

    // Delete from database
    await this.prisma.fileAsset.delete({
      where: { id },
    });

    this.logger.log(`FileAsset deleted: ${id}`);
  }

  /**
   * Map MIME type to FileType enum.
   */
  private mapMimeTypeToFileType(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) return FileType.IMAGE;
    if (mimeType === 'application/pdf') return FileType.DOCUMENT;
    if (
      mimeType.startsWith('application/vnd.') ||
      mimeType === 'application/msword'
    )
      return FileType.DOCUMENT;
    return FileType.OTHER;
  }

  /** Placeholder entityId used for FileAssets not yet linked to an entity */
  private static readonly PLACEHOLDER_ENTITY_ID = '00000000-0000-0000-0000-000000000000';

  /**
   * Find orphan FileAssets — records with no associated ProductMedia
   * and entityId still set to the placeholder.
   */
  async findOrphans() {
    this.logger.log('Querying orphan FileAssets');

    const orphans = await this.prisma.fileAsset.findMany({
      where: {
        entityId: FileAssetService.PLACEHOLDER_ENTITY_ID,
        media: { none: {} },
      },
      orderBy: { createdAt: 'desc' },
    });

    this.logger.log(`Found ${orphans.length} orphan FileAssets`);
    return orphans;
  }

  /**
   * Clean up specified orphan FileAssets.
   * Each ID is re-validated before deletion:
   * - FileAsset must exist
   * - entityId must be placeholder
   * - No ProductMedia references (media.length === 0)
   *
   * Only passing these checks will the file be deleted via {@link delete}.
   *
   * @param ids - Array of FileAsset IDs to delete (max 100)
   * @returns Count of deleted and failed IDs
   */
  async cleanupOrphans(ids: string[]): Promise<{ deleted: number; failed: string[] }> {
    this.logger.log(`Cleaning up ${ids.length} orphan FileAssets`);

    let deleted = 0;
    const failed: string[] = [];

    for (const id of ids) {
      try {
        // Re-validate: must be a true orphan before deletion
        const fileAsset = await this.prisma.fileAsset.findUnique({
          where: { id },
          include: {
            _count: { select: { media: true } },
          },
        });

        if (!fileAsset) {
          this.logger.warn(`Skip orphan ${id}: not found`);
          failed.push(id);
          continue;
        }

        if (fileAsset.entityId !== FileAssetService.PLACEHOLDER_ENTITY_ID) {
          this.logger.warn(
            `Skip orphan ${id}: entityId is ${fileAsset.entityId} (not placeholder)`,
          );
          failed.push(id);
          continue;
        }

        if (fileAsset._count.media > 0) {
          this.logger.warn(
            `Skip orphan ${id}: still referenced by ${fileAsset._count.media} ProductMedia`,
          );
          failed.push(id);
          continue;
        }

        // Safe to delete — reuse existing delete() for DB + S3 cleanup
        await this.delete(id);
        deleted++;
      } catch (err) {
        this.logger.error(
          `Failed to cleanup orphan ${id}: ${(err as Error).message}`,
        );
        failed.push(id);
      }
    }

    this.logger.log(
      `Orphan cleanup complete: ${deleted} deleted, ${failed.length} failed`,
    );
    return { deleted, failed };
  }

  async batchDelete(ids: string[]) {
    const result = await this.prisma.fileAsset.deleteMany({
      where: { id: { in: ids } },
    });
    this.logger.log(`Batch deleted ${result.count} FileAssets`);
    return { deletedCount: result.count };
  }

  /**
   * List all FileAssets (read-only, ADMIN only) for the unified media center.
   *
   * Supports pagination (page/pageSize) and optional filters:
   * - fileType     : IMAGE / DOCUMENT / CERTIFICATE / SPEC_SHEET / ILLUSTRATION / OTHER
   * - entityType   : PRODUCT / ORGANIZATION / DEMAND / RFQ / RFQ_RESPONSE / CONTENT
   * - organizationId : direct supplier isolation (FileAsset.organizationId)
   * - search       : case-insensitive fileName match
   *
   * Soft-deleted records (deletedAt != null) are excluded by default.
   */
  async findAll(query: ListFilesQuery) {
    const page = Math.max(1, parseInt(query.page ?? '1', 10) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(query.pageSize ?? '20', 10) || 20),
    );

    const where: Prisma.FileAssetWhereInput = { deletedAt: null };

    if (query.fileType) {
      where.fileType = query.fileType as FileType;
    }
    if (query.entityType) {
      where.entityType = query.entityType as FileEntityType;
    }
    if (query.organizationId) {
      where.organizationId = query.organizationId;
    }
    if (query.search) {
      where.fileName = { contains: query.search, mode: 'insensitive' };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.fileAsset.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          uploader: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          organization: { select: { id: true, name: true, type: true } },
          _count: { select: { media: true, contentMedia: true } },
        },
      }),
      this.prisma.fileAsset.count({ where }),
    ]);

    return {
      items: items.map((f) => ({
        id: f.id,
        entityType: f.entityType,
        entityId: f.entityId,
        fileType: f.fileType,
        fileName: f.fileName,
        storageKey: f.storageKey,
        mimeType: f.mimeType,
        fileSize: f.fileSize,
        status: f.status,
        deletedAt: f.deletedAt,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
        uploaderName: f.uploader.name ?? null,
        uploaderEmail: f.uploader.email,
        organizationId: f.organizationId,
        organizationName: f.organization?.name ?? null,
        organizationType: f.organization?.type ?? null,
        productMediaCount: f._count.media,
        contentMediaCount: f._count.contentMedia,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}