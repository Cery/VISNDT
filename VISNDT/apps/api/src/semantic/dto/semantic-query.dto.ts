import { IsString, IsEnum, IsOptional, IsInt, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// ============================================
// Semantic Query Contract — M21.4.4 FROZEN
//
// Input Contract:  query, entityType, limit, [threshold] (M21.4.5 additive)
// Output Contract: entityType, entityId, similarity, [semanticScore, rankingScore] (M21.4.6 additive)
//
// M21.4.5 additive: threshold, diagnostics
// M21.4.6 additive: semanticScore, rankingScore, rankingStrategy
//
// Semantic Layer = Retrieve, NOT Decide.
// No business ranking, no recommendation, no transaction logic.
// ============================================

export enum SemanticEntityType {
  CONTENT = 'content',
  PRODUCT = 'product',
  CHUNK = 'chunk',
}

/**
 * Semantic Query Request DTO
 *
 * FROZEN CONTRACT (M21.4.4):
 * - query: text query to find similar entities
 * - entityType: target entity type (content | product | chunk)
 * - limit: max results (1-50, default 10)
 *
 * M21.4.5 additive:
 * - threshold: minimum cosine similarity [0, 1], results below filtered out
 */
export class SemanticQueryDto {
  @ApiProperty({
    description: 'Text query to find semantically similar entities',
    example: '工业检测设备',
  })
  @IsString()
  query: string;

  @ApiProperty({
    description: 'Target entity type for retrieval',
    enum: SemanticEntityType,
    example: 'product',
  })
  @IsEnum(SemanticEntityType)
  entityType: SemanticEntityType;

  @ApiPropertyOptional({
    description: 'Maximum number of results',
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
    description: 'Minimum cosine similarity threshold [0, 1]. Results below this are filtered out.',
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

/**
 * Semantic Query Result Item
 *
 * FROZEN CONTRACT (M21.4.4):
 * - entityType: type of matched entity
 * - entityId: unique identifier
 * - similarity: cosine similarity score [0, 1] (ALWAYS PRESERVED)
 *
 * M21.4.6 additive:
 * - semanticScore: normalized semantic relevance [0, 1]
 * - rankingScore: final ranking score [0, 1] used for ordering
 * - metadata: optional entity metadata
 */
export interface SemanticQueryResultItem {
  entityType: SemanticEntityType;
  entityId: string;
  similarity: number;
  semanticScore?: number;
  rankingScore?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Retrieval diagnostics (M21.4.5 additive — internal field)
 */
export interface SemanticQueryDiagnostics {
  /** Query execution time in milliseconds */
  executionTimeMs: number;
  /** Total results before threshold filtering */
  totalScanned: number;
  /** Results filtered out by similarity threshold */
  filteredByThreshold: number;
  /** Threshold value applied */
  thresholdApplied: number;
}

/**
 * Semantic Query Response
 *
 * FROZEN CONTRACT (M21.4.4):
 * - query: original query text
 * - entityType: target entity type
 * - results: sorted by rankingScore descending
 * - total: number of results returned
 *
 * M21.4.5 additive: diagnostics (internal)
 * M21.4.6 additive: rankingStrategy (internal)
 */
export interface SemanticQueryResponse {
  query: string;
  entityType: SemanticEntityType;
  results: SemanticQueryResultItem[];
  total: number;
  diagnostics?: SemanticQueryDiagnostics;
  rankingStrategy?: string;
}