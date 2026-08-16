/**
 * Retrieval Contract Interface — M21.7.6 AI RAG Foundation
 *
 * Defines the retrieval request/response contract for RAG.
 * All retrieval is PLANNED/DEFERRED. No real data access.
 */

import { RAGContext } from './rag-context.interface';

// ============================================
// Retrieval Request
// ============================================

export interface RetrievalRequest {
  /** Natural language query */
  query: string;
  /** RAG context */
  context: RAGContext;
  /** Optional filters for knowledge sources */
  filters?: RetrievalFilters;
  /** Maximum results to return */
  limit?: number;
}

export interface RetrievalFilters {
  /** Source type filter */
  sourceType?: KnowledgeSourceType;
  /** Source ID filter */
  sourceId?: string;
  /** Date range filter */
  dateRange?: {
    start: string;
    end: string;
  };
  /** Additional metadata filters */
  metadata?: Record<string, unknown>;
}

export type KnowledgeSourceType =
  | 'PRODUCT'       // Product knowledge
  | 'CONTENT'       // Content assets
  | 'DOCUMENTATION' // Documentation
  | 'GUIDE';        // Guides and tutorials

// ============================================
// Retrieval Result
// ============================================

export interface RetrievalResult {
  /** Retrieval status */
  status: RetrievalStatus;
  /** Retrieved references (empty when DEFERRED) */
  references: RetrievalReference[];
  /** Total references found */
  total: number;
  /** Query that was executed */
  query: string;
  /** Execution timestamp */
  executedAt: string;
  /** Human review is ALWAYS required */
  requiresHumanReview: true;
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

export type RetrievalStatus =
  | 'COMPLETED'     // Retrieval completed
  | 'DEFERRED'      // Retrieval deferred (sources are PLANNED)
  | 'ERROR';        // Retrieval error

// ============================================
// Retrieval Reference
// ============================================

export interface RetrievalReference {
  /** Reference ID */
  id: string;
  /** Source type */
  sourceType: KnowledgeSourceType;
  /** Source ID */
  sourceId: string;
  /** Title */
  title: string;
  /** Description/snippet */
  description: string;
  /** Relevance/confidence score (0-1) */
  relevanceScore: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

// ============================================
// RAG Pipeline Contract
// ============================================

export interface RAGPipelineContract {
  /** Receive a retrieval request */
  receive(request: RetrievalRequest): Promise<RetrievalResult>;
  /** Validate retrieval context */
  validate(context: RAGContext): boolean;
  /** Retrieve knowledge (DEFERRED in current phase) */
  retrieve(request: RetrievalRequest): Promise<RetrievalResult>;
  /** Format retrieval results */
  format(result: RetrievalResult): RetrievalResult;
}