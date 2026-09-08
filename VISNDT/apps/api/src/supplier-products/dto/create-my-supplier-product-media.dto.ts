import { IsString, IsOptional, IsBoolean, IsInt, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FileType } from '@prisma/client';

/**
 * WP-5A — Media Write (R1) self-service DTO.
 *
 * Used to create a SupplierProduct media record:
 *   - either bound to an already-uploaded FileAsset (fileAssetId),
 *   - or, together with the multipart upload endpoint, to create-and-upload atomically.
 *
 * The SupplierProductMedia schema exposes altText (not description); isPrimary /
 * displayOrder drive the persisted media ordering and the primary badge.
 */
export class CreateMySupplierProductMediaDto {
  @ApiPropertyOptional({ description: 'FileAsset ID (from a prior supplier upload)' })
  @IsOptional()
  @IsString()
  fileAssetId?: string;

  @ApiPropertyOptional({ description: 'Media type', enum: FileType, example: 'IMAGE' })
  @IsOptional()
  @IsEnum(FileType)
  mediaType?: FileType;

  @ApiPropertyOptional({ description: 'Media title', example: '型号正面图' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Alt text (accessibility)' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ description: 'Is this the primary media?', default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ description: 'Display order', default: 0 })
  @IsOptional()
  @IsInt()
  displayOrder?: number;
}