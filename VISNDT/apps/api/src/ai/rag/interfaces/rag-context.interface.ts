/**
 * RAG Context Interface — M21.7.6 AI RAG Foundation
 *
 * Defines the context contract for RAG (Retrieval-Augmented Generation) requests.
 * Human review is always required. No autonomous decision.
 */

// ============================================
// RAG Context
// ============================================

export interface RAGContext {
  /** Unique request identifier */
  requestId: string;
  /** User ID from JWT */
  userId: string;
  /** Capability ID being invoked */
  capabilityId: string;
  /** Natural language query */
  query: string;
  /** Scope of knowledge sources to search */
  sourceScope: RAGSourceScope;
  /** Human review is ALWAYS required */
  humanReviewRequired: true;
  /** Request timestamp */
  timestamp: string;
  /** Audit context for traceability */
  auditContext: RAGAuditContext;
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

export type RAGSourceScope =
  | 'PRODUCT'      // Product knowledge only
  | 'CONTENT'      // Content assets only
  | 'ALL';         // All knowledge sources

// ============================================
// RAG Audit Context
// ============================================

export interface RAGAuditContext {
  /** Request origin */
  origin: 'ADMIN' | 'WORKSPACE' | 'INTERNAL';
  /** Correlation ID for request tracing */
  correlationId?: string;
}

// ============================================
// RAG Status
// ============================================

export interface RAGStatus {
  /** Module status */
  status: 'READY' | 'DEGRADED' | 'UNAVAILABLE';
  /** Total sources registered */
  totalSources: number;
  /** Available sources */
  availableSources: number;
  /** Planned sources */
  plannedSources: number;
  /** Boundary enforcement */
  boundaries: {
    noAutonomousDecision: boolean;
    noLLMExecution: boolean;
    noVectorDatabase: boolean;
    noEmbedding: boolean;
    humanInLoopEnforced: boolean;
  };
}