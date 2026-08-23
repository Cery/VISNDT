import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * Supplier Runtime — SupplierProduct List query (M28.0 P2-A Runtime Scaling).
 *
 * Extends the existing single supplier-runtime product query entry with
 * pagination / search / status / series filters. NO new pool API, NO schema.
 *
 *   page     1-based page (default 1)
 *   pageSize page size (default 20)
 *   q        unified search string (brand / series / modelNumber / platform product name)
 *   status   lifecycle status filter, comma-separated to allow multiple (e.g. SUBMITTED,REVIEWING)
 *   series   series string filter (contains)
 *
 * class-validator decorators are required: the global ValidationPipe runs with
 * `whitelist: true`, which strips any query field lacking a validation decorator.
 */
export class WorkspaceSupplierProductsQueryDto {
  @ApiPropertyOptional({ description: 'Page number (1-based)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Page size', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @ApiPropertyOptional({ description: 'Unified search string: brand / series / modelNumber / capability name' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ description: 'Lifecycle status filter (comma-separated multi value)' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Series filter (contains)' })
  @IsOptional()
  @IsString()
  series?: string;
}