import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentMediaType } from '@prisma/client';

export class CreateContentMediaDto {
  @ApiPropertyOptional({ description: 'FileAsset ID (set when linking an existing asset)', example: 'uuid' })
  @IsOptional()
  @IsString()
  fileAssetId?: string;

  @ApiProperty({ description: 'Media type', enum: ContentMediaType, example: 'IMAGE' })
  @IsEnum(ContentMediaType)
  type: ContentMediaType;

  @ApiPropertyOptional({ description: 'Caption / title', example: '产品示意图' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ description: 'Alt text for accessibility', example: '产品主视图' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ description: 'Sort order', default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}