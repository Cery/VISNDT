import { IsOptional, IsInt, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContentMediaType } from '@prisma/client';

export class UpdateContentMediaDto {
  @ApiPropertyOptional({ description: 'Media type', enum: ContentMediaType })
  @IsOptional()
  @IsEnum(ContentMediaType)
  type?: ContentMediaType;

  @ApiPropertyOptional({ description: 'Caption / title' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ description: 'Alt text for accessibility' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}