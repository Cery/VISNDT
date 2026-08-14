import { IsOptional, IsIn, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryContentDto {
  @ApiPropertyOptional({ description: 'Content type filter', enum: ['ARTICLE', 'KNOWLEDGE', 'SOLUTION', 'INSIGHT'] })
  @IsOptional()
  @IsIn(['ARTICLE', 'KNOWLEDGE', 'SOLUTION', 'INSIGHT'])
  type?: 'ARTICLE' | 'KNOWLEDGE' | 'SOLUTION' | 'INSIGHT';

  @ApiPropertyOptional({ description: 'Content status filter', enum: ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'] })
  @IsOptional()
  @IsIn(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

  @ApiPropertyOptional({ description: 'Keyword search on title and summary' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: 'Filter content by tag slug' })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ description: 'Page number (1-based)', default: 1 })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20, maximum: 100 })
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  pageSize?: number = 20;
}