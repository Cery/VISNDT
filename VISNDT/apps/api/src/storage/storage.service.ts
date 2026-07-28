import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createS3Client } from './storage.config';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.s3Client = createS3Client(config);
    this.bucket = config.get<string>('S3_BUCKET')!;
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