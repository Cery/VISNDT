/**
 * Semantic Adapter Interface — M21.7.4 AI Tool Registry & Semantic Adapter Foundation
 *
 * Defines the contract for Semantic adapters.
 * Semantic Adapter is the boundary between Tool Layer and Semantic Layer.
 * Does NOT expose internal RetrievalService, RankingService, or UnifiedSearchService.
 */

// ============================================
// Semantic Query Request
// ============================================

export interface SemanticQueryRequest {
  /** Natural language query text */
  query: string;
  /** Entity type filter */
  entityType?: SemanticEntityType;
  /** Maximum results to return */
  limit?: number;
  /** Minimum similarity threshold (0-1) */
  threshold?: number;
  /** Optional metadata filters */
  filters?: Record<string, unknown>;
}

export type SemanticEntityType = 'PRODUCT' | 'CONTENT' | 'ALL';

// ============================================
// Semantic Query Response
// ============================================

export interface SemanticQueryResponse {
  /** Query that was executed */
  query: string;
  /** Normalized results (adapter-defined, not raw Semantic output) */
  results: SemanticQueryResult[];
  /** Total results found */
  total: number;
  /** Execution timestamp */
  executedAt: string;
  /** Adapter status */
  adapterStatus: 'AVAILABLE' | 'UNAVAILABLE' | 'ERROR';
}

// ============================================
// Semantic Query Result
// ============================================

export interface SemanticQueryResult {
  /** Entity type */
  entityType: string;
  /** Entity ID */
  entityId: string;
  /** Normalized relevance score (0-1) */
  relevanceScore: number;
  /** Entity title/label */
  title: string;
  /** Entity description snippet */
  description?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

// ============================================
// Semantic Adapter Contract
// ============================================

/**
 * Semantic Adapter Contract — enforced by the Adapter layer.
 * All Semantic adapters must comply with this contract.
 *
 * Rules:
 * 1. No direct exposure of RetrievalService, RankingService, UnifiedSearchService.
 * 2. No exposure of raw embedding vectors.
 * 3. All responses are normalized through the adapter.
 * 4. No business mutation.
 */
export interface SemanticAdapterContract {
  /** Execute a semantic search query */
  semanticSearch(request: SemanticQueryRequest): Promise<SemanticQueryResponse>;

  /** Check if the adapter is available */
  isAvailable(): boolean;

  /** Get adapter health status */
  getHealth(): SemanticAdapterHealth;
}

// ============================================
// Semantic Adapter Health
// ============================================

export interface SemanticAdapterHealth {
  /** Adapter status */
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'DEGRADED';
  /** Whether the underlying Semantic Layer is available */
  semanticLayerAvailable: boolean;
  /** Whether the underlying Embedding Service is available */
  embeddingServiceAvailable: boolean;
  /** Last health check timestamp */
  lastChecked: string;
  /** Optional error message */
  error?: string;
}