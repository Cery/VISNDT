import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContentTagType } from '@prisma/client';

export class UpdateContentTagDto {
  @ApiPropertyOptional({ description: 'Tag name', example: '智能制造' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'URL-friendly slug', example: 'smart-manufacturing' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: 'Tag type', enum: ContentTagType })
  @IsOptional()
  @IsEnum(ContentTagType)
  type?: ContentTagType;

  @ApiPropertyOptional({ description: 'Tag description' })
  @IsOptional()
  @IsString()
  description?: string;
}