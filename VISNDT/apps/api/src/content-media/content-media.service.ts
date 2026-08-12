import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { FileAssetService } from '../file-asset/file-asset.service';
import { FileEntityType } from '@prisma/client';
import { CreateContentMediaDto } from './dto/create-content-media.dto';
import { UpdateContentMediaDto } from './dto/update-content-media.dto';
import { Express } from 'express';

/**
 * Public-safe projection for a ContentMedia's FileAsset.
 * Exposes only fields needed by the public web; never exposes storageKey.
 */
const publicFileAssetSelect = {
  id: true,
  fileName: true,
  mimeType: true,
  fileSize: true,
  fileType: true,
} satisfies Prisma.FileAssetSelect;

@Injectable()
export class ContentMediaService {
  private readonly logger = new Logger(ContentMediaService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly fileAssetService: FileAssetService,
  ) {}

  /**
   * List media for a content. Public reads exclude storageKey.
   */
  async findByContent(contentId: string, publicOnly = false) {
    await this.ensureContentExists(contentId);
    return this.prisma.contentMedia.findMany({
      where: { contentId },
      orderBy: { sortOrder: 'asc' },
      include: {
        fileAsset: publicOnly ? { select: publicFileAssetSelect } : true,
      },
    });
  }

  async findOne(contentId: string, id: string, publicOnly = false) {
    const media = await this.prisma.contentMedia.findFirst({
      where: { id, contentId },
      include: {
        fileAsset: publicOnly ? { select: publicFileAssetSelect } : true,
      },
    });
    if (!media) throw new NotFoundException(`ContentMedia ${id} not found`);
    return media;
  }

  async create(contentId: string, dto: CreateContentMediaDto) {
    await this.ensureContentExists(contentId);

    const media = await this.prisma.contentMedia.create({
      data: {
        contentId,
        fileAssetId: dto.fileAssetId,
        type: dto.type,
        caption: dto.caption,
        altText: dto.altText,
        sortOrder: dto.sortOrder,
      },
      include: { fileAsset: true },
    });

    // Link FileAsset to this ContentMedia
    if (dto.fileAssetId) {
      try {
        await this.prisma.fileAsset.update({
          where: { id: dto.fileAssetId },
          data: { entityType: FileEntityType.CONTENT, entityId: media.id },
        });
      } catch (err) {
        this.logger.warn(
          `Failed to link FileAsset ${dto.fileAssetId}: ${(err as Error).message}`,
        );
      }
    }

    return media;
  }

  /**
   * Atomic upload-create: upload file + create ContentMedia in one operation.
   * Eliminates the orphan window between upload and create.
   */
  async createWithUpload(
    contentId: string,
    file: Express.Multer.File,
    dto: CreateContentMediaDto,
    userId: string,
  ) {
    await this.ensureContentExists(contentId);

    // Step 1: Upload file → create FileAsset (entityType = CONTENT)
    const fileAsset = await this.fileAssetService.upload(
      file,
      userId,
      FileEntityType.CONTENT,
    );

    try {
      // Step 2: Create ContentMedia with the fileAssetId
      const media = await this.prisma.contentMedia.create({
        data: {
          contentId,
          fileAssetId: fileAsset.id,
          type: dto.type,
          caption: dto.caption,
          altText: dto.altText,
          sortOrder: dto.sortOrder,
        },
        include: { fileAsset: true },
      });

      // Step 3: Update FileAsset entityId to point to this ContentMedia
      try {
        await this.prisma.fileAsset.update({
          where: { id: fileAsset.id },
          data: { entityId: media.id },
        });
      } catch (err) {
        this.logger.warn(
          `Failed to link FileAsset ${fileAsset.id}: ${(err as Error).message}`,
        );
      }

      return media;
    } catch (err) {
      // Step 4: Rollback — delete orphan FileAsset (DB + S3)
      try {
        await this.fileAssetService.delete(fileAsset.id);
        this.logger.log(
          `Rolled back orphan FileAsset ${fileAsset.id} (DB + S3)`,
        );
      } catch (cleanupErr) {
        this.logger.error(
          `Failed to cleanup orphan FileAsset ${fileAsset.id}: ${(cleanupErr as Error).message}`,
        );
      }
      throw err;
    }
  }

  async update(contentId: string, id: string, dto: UpdateContentMediaDto) {
    const media = await this.findOne(contentId, id);

    return this.prisma.contentMedia.update({
      where: { id: media.id },
      data: {
        type: dto.type,
        caption: dto.caption,
        altText: dto.altText,
        sortOrder: dto.sortOrder,
      },
      include: { fileAsset: true },
    });
  }

  async remove(contentId: string, id: string) {
    const media = await this.findOne(contentId, id);

    const fileAsset = media.fileAsset;
    const storageKey = fileAsset?.storageKey ?? null;
    const fileAssetId = fileAsset?.id ?? null;

    // Delete ContentMedia first (FK constraint is on ContentMedia side)
    await this.prisma.contentMedia.delete({ where: { id: media.id } });

    // Delete FileAsset DB record if it exists
    if (fileAssetId) {
      try {
        await this.prisma.fileAsset.delete({ where: { id: fileAssetId } });
        this.logger.log(`FileAsset deleted: ${fileAssetId}`);
      } catch (err) {
        this.logger.error(
          `Failed to delete FileAsset ${fileAssetId}: ${(err as Error).message}`,
        );
      }
    }

    // Delete file from S3/MinIO — best-effort, after DB consistency
    if (storageKey) {
      try {
        await this.storage.deleteObject(storageKey);
        this.logger.log(`Storage object deleted: ${storageKey}`);
      } catch (err) {
        this.logger.error(
          `Failed to delete storage object ${storageKey}: ${(err as Error).message}`,
        );
      }
    }
  }

  private async ensureContentExists(contentId: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
      select: { id: true },
    });
    if (!content) throw new NotFoundException(`Content ${contentId} not found`);
  }
}