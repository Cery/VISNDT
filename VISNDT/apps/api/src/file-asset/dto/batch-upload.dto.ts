import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FileType, FileEntityType } from '@prisma/client';

/**
 * Ownership metadata for the ADMIN media-center batch upload.
 * The files themselves travel as multipart fields named `files`.
 */
export class BatchUploadDto {
  @ApiPropertyOptional({
    description: 'Override file type for all uploaded files (default: derived from MIME)',
    enum: FileType,
  })
  @IsOptional()
  @IsEnum(FileType, { message: 'fileType must be a valid FileType' })
  fileType?: FileType;

  @ApiPropertyOptional({
    description: 'Owning organization UUID (ownership tag). Omit for unowned uploads.',
  })
  @IsOptional()
  @IsUUID('4', { message: 'organizationId must be a valid UUID v4' })
  organizationId?: string;

  @ApiPropertyOptional({
    description: 'Ownership entity type (default: PRODUCT)',
    enum: FileEntityType,
  })
  @IsOptional()
  @IsEnum(FileEntityType, { message: 'entityType must be a valid FileEntityType' })
  entityType?: FileEntityType;
}