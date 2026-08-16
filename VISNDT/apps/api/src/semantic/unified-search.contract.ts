// ============================================
// Unified Search Orchestration Contract — M21.4.7 FROZEN
//
// Unified Search Foundation provides the orchestration layer
// on top of Retrieval + Ranking to form a single internal
// search capability.
//
// Architecture:
//   UnifiedSearchService
//     ├── SemanticQueryService (embedding + retrieval + ranking)
//     └── UnifiedSearchResponse (merged across entity types)
//
// This is INTERNAL capability, NOT a public search product.
//
// Future extensions:
//   - Public Search API (M21.5+)
//   - Admin Intelligence Search (M21.6+)
//   - AI Agent Knowledge Retrieval (M21.7+)
//   - RAG Pipeline (M21.7+)
// ============================================

import { SemanticEntityType } from './dto/semantic-query.dto';

/**
 * Entity scope for unified search.
 * Defines which entity types to search across.
 */
export type SearchEntityScope = SemanticEntityType[];

/**
 * Unified Search Request — internal orchestration input.
 *
 * FROZEN CONTRACT:
 *   - query: text query
 *   - entityScope: which entity types to search (e.g., ['content', 'product'])
 *   - limit: max results per entity type
 *   - threshold: minimum similarity threshold
 */
export interface UnifiedSearchRequest {
  /** Text query */
  query: string;
  /** Entity types to search across */
  entityScope: SearchEntityScope;
  /** Maximum results per entity type */
  limit?: number;
  /** Minimum similarity threshold */
  threshold?: number;
}

/**
 * Per-entity search result group.
 */
export interface EntitySearchResult {
  /** Entity type */
  entityType: SemanticEntityType;
  /** Number of results found */
  total: number;
  /** Ranked results for this entity type */
  results: Array<{
    entityId: string;
    similarity: number;
    semanticScore: number;
    rankingScore: number;
    metadata?: Record<string, unknown>;
  }>;
}

/**
 * Unified Search Response — orchestration output.
 *
 * FROZEN CONTRACT:
 *   - query: original query
 *   - results: per-entity-type result groups
 *   - totalResults: sum of all results across entity types
 *   - entitiesSearched: number of entity types searched
 *   - orchestration: metadata about the search pipeline
 */
export interface UnifiedSearchResponse {
  /** Original query */
  query: string;
  /** Per-entity result groups */
  results: EntitySearchResult[];
  /** Total results across all entity types */
  totalResults: number;
  /** Number of entity types searched */
  entitiesSearched: number;
  /** Internal orchestration metadata */
  orchestration: UnifiedSearchOrchestration;
}

/**
 * Search orchestration metadata — internal diagnostics.
 */
export interface UnifiedSearchOrchestration {
  /** Pipeline version */
  pipeline: 'retrieval-ranking-v1';
  /** Total execution time in ms */
  totalExecutionTimeMs: number;
  /** Per-entity execution times */
  entityTimings: Array<{
    entityType: SemanticEntityType;
    executionTimeMs: number;
  }>;
  /** Ranking strategy used */
  rankingStrategy: string;
  /** Timestamp of search execution */
  timestamp: string;
}

/**
 * Unified Search Orchestration Contract — extension point.
 *
 * Future: PublicSearchService, AdminSearchService, AgentSearchService
 * implement this contract for different search contexts.
 */
export interface UnifiedSearchOrchestrator {
  search(request: UnifiedSearchRequest): Promise<UnifiedSearchResponse>;
  getAvailableEntityTypes(): SearchEntityScope;
}