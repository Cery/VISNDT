import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Unified Discovery Query DTO
 *
 * Single endpoint: GET /search?q={keyword}
 * Architecture: 580_ADR-001/002 — Unified Industrial Discovery Layer
 */
export class UnifiedSearchDto {
  @ApiProperty({ description: 'Search keyword', example: '超声检测' })
  @IsString()
  q: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page per entity type', default: 10, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize?: number = 10;
}