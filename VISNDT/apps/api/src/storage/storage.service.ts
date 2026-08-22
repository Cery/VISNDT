import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createS3Client } from './storage.config';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.s3Client = createS3Client(config);
    this.bucket = config.get<string>('S3_BUCKET')!;
  }

  /**
   * Ensure the configured bucket exists at startup. Creates it if missing
   * (e.g. first boot of MinIO before any bucket is provisioned). This is a
   * best-effort, idempotent environment check — it does not replace the
   * storage provider or alter the FileAsset model.
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.s3Client.send(
        new HeadBucketCommand({ Bucket: this.bucket }),
      );
      this.logger.log(`Storage bucket "${this.bucket}" already exists`);
    } catch {
      try {
        await this.s3Client.send(
          new CreateBucketCommand({ Bucket: this.bucket }),
        );
        this.logger.log(`Storage bucket "${this.bucket}" created`);
      } catch (createErr) {
        this.logger.error(
          `Failed to auto-create storage bucket "${this.bucket}": ${(createErr as Error).message}`,
        );
      }
    }
  }

  /**
   * Upload a file buffer to S3/MinIO.
   * @param buffer - File content as Buffer
   * @param key - Object storage key (path)
   * @param mimeType - Content-Type of the file
   * @returns The storage key used for the upload
   */
  async upload(
    buffer: Buffer,
    key: string,
    mimeType: string,
  ): Promise<string> {
    this.logger.log(`Uploading object: ${key} (${mimeType})`);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }),
    );

    this.logger.log(`Upload complete: ${key}`);
    return key;
  }

  /**
   * Generate a pre-signed URL for downloading an object.
   * @param storageKey - The S3/MinIO object key
   * @param expiresIn - URL expiration in seconds (default: 900 = 15 min)
   * @returns Pre-signed URL string
   */
  async getSignedUrl(
    storageKey: string,
    expiresIn: number = 900,
  ): Promise<string> {
    this.logger.log(`Generating signed URL for: ${storageKey}`);

    const url = await getSignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
      }),
      { expiresIn },
    );

    return url;
  }

  /**
   * Delete an object from S3/MinIO.
   * @param storageKey - The S3/MinIO object key to delete
   */
  async deleteObject(storageKey: string): Promise<void> {
    this.logger.log(`Deleting object: ${storageKey}`);

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
      }),
    );

    this.logger.log(`Delete complete: ${storageKey}`);
  }
}