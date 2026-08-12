import { IsString, IsOptional, IsIn, IsUUID, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContentDto {
  @ApiPropertyOptional({ description: 'Content type', enum: ['ARTICLE', 'KNOWLEDGE', 'SOLUTION', 'INSIGHT'] })
  @IsOptional()
  @IsIn(['ARTICLE', 'KNOWLEDGE', 'SOLUTION', 'INSIGHT'])
  type?: 'ARTICLE' | 'KNOWLEDGE' | 'SOLUTION' | 'INSIGHT';

  @ApiPropertyOptional({ description: 'Content title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Content slug (unique)' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: 'Content summary' })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({ description: 'Content body (Markdown/rich text)' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Cover image FileAsset ID' })
  @IsOptional()
  @IsUUID()
  coverImageId?: string;

  @ApiPropertyOptional({ description: 'SEO title' })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'SEO description' })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiPropertyOptional({ description: 'SEO keywords' })
  @IsOptional()
  @IsString()
  seoKeywords?: string;

  @ApiPropertyOptional({
    description: 'Scheduled publish time (ISO 8601). Only settable when status=REVIEW. Pass null to clear.',
    example: '2026-08-13T09:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  scheduledPublishAt?: string | null;
}