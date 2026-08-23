import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Unified Discovery Query DTO
 *
 * Single endpoint: GET /search?q={keyword}
 * Architecture: 580_ADR-001/002 — Unified Industrial Discovery Layer
 *
 * M24.1.4 — Minimal Filter Contract Extension:
 *   - `category`: selected ProductCategory id (selectedCategoryTab).
 *   - `filters`: merged parameter filters. Wire format:
 *       `parameterId:value1,value2;parameterId2:value3`
 *     Same parameter joins values with OR, different parameters join with AND.
 *     Applied server-side (filter-before-pagination).
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

  @ApiPropertyOptional({ description: 'Filter products by ProductCategory id (selectedCategoryTab)', example: 'a1b2c3d4-...' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Merged parameter filters encoded as parameterId:value1,value2;parameterId2:value3',
    example: 'a1b2c3d4-...:6,4;e5f6g7h8-...:IP67',
  })
  @IsOptional()
  @IsString()
  filters?: string;

  // ─── M28.0 M661.5 — Supplier Model facet inputs (SupplierProduct dimension) ───
  // Brand / Series / Has-Active-Offer filters fold into the unified search model.
  // They only affect the SupplierProduct dimension; Product / Knowledge / Content /
  // Solution / Supplier dimensions are unchanged. No new search entry is created.

  @ApiPropertyOptional({ description: 'Filter SupplierProduct dimension by brand (contains, case-insensitive)' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ description: 'Filter SupplierProduct dimension by series (contains, case-insensitive)' })
  @IsOptional()
  @IsString()
  series?: string;

  @ApiPropertyOptional({ description: 'Filter SupplierProduct dimension to those with >=1 ACTIVE offer ("true")' })
  @IsOptional()
  @IsString()
  hasOffer?: string;
}