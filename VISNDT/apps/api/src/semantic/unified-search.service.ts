import { Injectable, Logger } from '@nestjs/common';
import { SemanticQueryService } from './semantic-query.service';
import { SemanticQueryDto, SemanticEntityType } from './dto/semantic-query.dto';
import {
  UnifiedSearchRequest,
  UnifiedSearchResponse,
  UnifiedSearchOrchestration,
  UnifiedSearchOrchestrator,
  SearchEntityScope,
  EntitySearchResult,
} from './unified-search.contract';

// ============================================
// UnifiedSearchService — M21.4.7 Unified Search Ranking Foundation
//
// Internal search orchestration layer.
// Wraps the Retrieval → Ranking pipeline into a unified search interface.
//
// Architecture:
//   UnifiedSearchService.search(request)
//     → SemanticQueryService.query() per entity type
//     → Merge results across entity types
//     → UnifiedSearchResponse
//
// NOT:
//   - Public search API
//   - Search page
//   - Search UI
//   - Business logic
//   - Recommendation
//
// This is the last P1 GAP (GAP-07) for M21.4.
// After this, M21.4 Semantic Intelligence Layer is CLOSED.
// ============================================

@Injectable()
export class UnifiedSearchService implements UnifiedSearchOrchestrator {
  private readonly logger = new Logger(UnifiedSearchService.name);

  constructor(private readonly semanticQueryService: SemanticQueryService) {}

  /**
   * Execute unified search across multiple entity types.
   *
   * Flow:
   *   1. Validate entity scope
   *   2. Execute SemanticQueryService.query() for each entity type (parallel)
   *   3. Merge results into per-entity groups
   *   4. Return UnifiedSearchResponse with orchestration metadata
   *
   * @param request - UnifiedSearchRequest with entity scope
   * @returns UnifiedSearchResponse with merged results
   */
  async search(request: UnifiedSearchRequest): Promise<UnifiedSearchResponse> {
    const startTime = Date.now();
    const scope = this.validateScope(request.entityScope);

    this.logger.log(
      `Unified search: scope=[${scope.join(',')}], limit=${request.limit}, threshold=${request.threshold}`,
    );

    // Step 1: Execute per-entity queries in parallel
    const queryPromises = scope.map((entityType) =>
      this.executeEntityQuery(entityType, request),
    );

    const entityResults = await Promise.all(queryPromises);

    // Step 2: Build orchestration metadata
    const orchestration: UnifiedSearchOrchestration = {
      pipeline: 'retrieval-ranking-v1',
      totalExecutionTimeMs: Date.now() - startTime,
      entityTimings: entityResults.map((r) => ({
        entityType: r.entityType,
        executionTimeMs: r.executionTimeMs,
      })),
      rankingStrategy: entityResults[0]?.rankingStrategy ?? 'DefaultRankingStrategy',
      timestamp: new Date().toISOString(),
    };

    // Step 3: Merge results
    const results: EntitySearchResult[] = entityResults.map((r) => ({
      entityType: r.entityType,
      total: r.results.length,
      results: r.results,
    }));

    const totalResults = results.reduce((sum, r) => sum + r.total, 0);

    this.logger.log(
      `Unified search complete: ${totalResults} results across ${scope.length} entities in ${orchestration.totalExecutionTimeMs}ms`,
    );

    return {
      query: request.query,
      results,
      totalResults,
      entitiesSearched: scope.length,
      orchestration,
    };
  }

  /**
   * Get available entity types for search.
   */
  getAvailableEntityTypes(): SearchEntityScope {
    return [
      SemanticEntityType.CONTENT,
      SemanticEntityType.PRODUCT,
      SemanticEntityType.CHUNK,
    ];
  }

  /**
   * Validate and normalize entity scope.
   */
  private validateScope(scope: SearchEntityScope): SearchEntityScope {
    const valid = this.getAvailableEntityTypes();
    const normalized = scope.filter((t) => valid.includes(t));

    if (normalized.length === 0) {
      this.logger.warn('Empty entity scope, defaulting to all types');
      return valid;
    }

    return normalized;
  }

  /**
   * Execute a single entity query and return results with timing.
   */
  private async executeEntityQuery(
    entityType: SemanticEntityType,
    request: UnifiedSearchRequest,
  ): Promise<{
    entityType: SemanticEntityType;
    results: Array<{
      entityId: string;
      similarity: number;
      semanticScore: number;
      rankingScore: number;
      metadata?: Record<string, unknown>;
    }>;
    executionTimeMs: number;
    rankingStrategy: string;
  }> {
    const startTime = Date.now();

    const dto: SemanticQueryDto = {
      query: request.query,
      entityType,
      limit: request.limit ?? 10,
      threshold: request.threshold ?? 0,
    };

    const response = await this.semanticQueryService.query(dto);

    return {
      entityType,
      results: response.results.map((r) => ({
        entityId: r.entityId,
        similarity: r.similarity,
        semanticScore: r.semanticScore ?? r.similarity,
        rankingScore: r.rankingScore ?? r.similarity,
        ...(r.metadata ? { metadata: r.metadata } : {}),
      })),
      executionTimeMs: response.diagnostics?.executionTimeMs ?? Date.now() - startTime,
      rankingStrategy: response.rankingStrategy ?? 'DefaultRankingStrategy',
    };
  }
}