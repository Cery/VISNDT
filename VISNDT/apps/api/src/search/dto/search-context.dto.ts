import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Search Context Query DTO — M24.1.3
 *
 * Query-level context request, pagination-independent.
 * Only accepts q (search keyword).
 *
 * Architecture: ADR-M24-009
 *   Search Context ≠ Search Result Page
 *   No page / pageSize / offset / cursor
 */
export class SearchContextDto {
  @ApiProperty({ description: 'Search keyword', example: '内窥镜' })
  @IsString()
  @IsNotEmpty()
  q: string;
}