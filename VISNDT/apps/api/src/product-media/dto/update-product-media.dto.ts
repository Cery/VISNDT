import { IsString, IsOptional, IsBoolean, IsInt, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FileType } from '@prisma/client';

export class UpdateProductMediaDto {
  @ApiPropertyOptional({ description: 'FileAsset ID' })
  @IsOptional()
  @IsString()
  fileAssetId?: string;

  @ApiPropertyOptional({ description: 'Media type', enum: FileType })
  @IsOptional()
  @IsEnum(FileType)
  mediaType?: FileType;

  @ApiPropertyOptional({ description: 'Media title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Media description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Is this the primary image?' })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ description: 'Display order' })
  @IsOptional()
  @IsInt()
  displayOrder?: number;
}