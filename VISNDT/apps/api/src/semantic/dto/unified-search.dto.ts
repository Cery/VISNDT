import { IsString, IsArray, IsEnum, IsOptional, IsInt, IsNumber, Min, Max, ArrayMinSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SemanticEntityType } from './semantic-query.dto';

// ============================================
// Unified Search DTO — M21.4.7 Internal
//
// Internal DTO for Unified Search Orchestration.
// NOT a public API contract.
// ============================================

/**
 * Unified Search Request DTO — internal only.
 */
export class UnifiedSearchDto {
  @ApiProperty({
    description: 'Text query',
    example: '工业检测',
  })
  @IsString()
  query: string;

  @ApiProperty({
    description: 'Entity types to search across',
    enum: SemanticEntityType,
    isArray: true,
    example: ['product', 'content'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(SemanticEntityType, { each: true })
  entityScope: SemanticEntityType[];

  @ApiPropertyOptional({
    description: 'Maximum results per entity type',
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Minimum similarity threshold [0, 1]',
    minimum: 0,
    maximum: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  threshold?: number = 0;
}