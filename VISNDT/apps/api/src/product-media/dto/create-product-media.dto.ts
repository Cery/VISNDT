import { IsString, IsOptional, IsBoolean, IsInt, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FileType } from '@prisma/client';

export class CreateProductMediaDto {
  @ApiPropertyOptional({ description: 'FileAsset ID (future: populated by file upload)', example: 'uuid' })
  @IsOptional()
  @IsString()
  fileAssetId?: string;

  @ApiProperty({ description: 'Media type', enum: FileType, example: 'IMAGE' })
  @IsEnum(FileType)
  mediaType: FileType;

  @ApiPropertyOptional({ description: 'Media title', example: 'Front View' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Media description', example: 'Product front view under daylight' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Is this the primary image?', default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ description: 'Display order', default: 0 })
  @IsOptional()
  @IsInt()
  displayOrder?: number;
}