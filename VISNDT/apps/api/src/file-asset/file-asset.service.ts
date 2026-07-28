import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { FileType } from '@prisma/client';
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
   * @returns Created FileAsset record
   */
  async upload(file: Express.Multer.File, userId: string) {
    this.validateFile(file);

    const ext = file.originalname.split('.').pop() || 'bin';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const storageKey = `uploads/${timestamp}-${randomUUID()}.${ext}`;

    this.logger.log(
      `Uploading file: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`,
    );

    // Upload to S3/MinIO
    await this.storage.upload(file.buffer, storageKey, file.mimetype);

    // Create FileAsset record in database
    const fileAsset = await this.prisma.fileAsset.create({
      data: {
        entityType: 'PRODUCT',
        entityId: '00000000-0000-0000-0000-000000000000', // Placeholder — will be linked via ProductMedia
        fileType: this.mapMimeTypeToFileType(file.mimetype),
        fileName: file.originalname,
        storageKey,
        mimeType: file.mimetype,
        fileSize: file.size,
        uploadedBy: userId,
      },
    });

    this.logger.log(`FileAsset created: ${fileAsset.id}`);
    return fileAsset;
  }

  /**
   * Get a signed download URL for a file.
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
}