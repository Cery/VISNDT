import { IsString, IsOptional, IsIn, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContentDto {
  @ApiProperty({ description: 'Content type', enum: ['ARTICLE', 'KNOWLEDGE', 'SOLUTION', 'INSIGHT'], example: 'KNOWLEDGE' })
  @IsIn(['ARTICLE', 'KNOWLEDGE', 'SOLUTION', 'INSIGHT'])
  type: 'ARTICLE' | 'KNOWLEDGE' | 'SOLUTION' | 'INSIGHT';

  @ApiProperty({ description: 'Content title', example: '工业超声检测技术指南' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Content slug (unique, used for URL & SEO)', example: 'industrial-ultrasonic-testing-guide' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ description: 'Content summary' })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ description: 'Content body (Markdown/rich text)' })
  @IsString()
  content: string;

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
}