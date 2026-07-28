import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

/**
 * Factory function to create an S3Client instance configured
 * for MinIO compatibility via environment variables.
 */
export const createS3Client = (config: ConfigService): S3Client => {
  const endpoint = config.get<string>('S3_ENDPOINT');
  const region = config.get<string>('S3_REGION');
  const accessKeyId = config.get<string>('S3_ACCESS_KEY');
  const secretAccessKey = config.get<string>('S3_SECRET_KEY');

  return new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
    forcePathStyle: true, // Required for MinIO compatibility
  });
};