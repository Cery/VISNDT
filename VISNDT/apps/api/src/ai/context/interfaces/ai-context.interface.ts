/**
 * AI Context Interface — M21.7.7 AI Knowledge Context Foundation
 *
 * Root context contract for AI capability orchestration.
 * All AI contexts must conform to this contract.
 * Human review is always required. No autonomous decision.
 */

// ============================================
// AI Context (Root)
// ============================================

export interface AIContext {
  /** Unique context identifier */
  contextId: string;
  /** User ID from JWT */
  userId: string;
  /** Capability ID being invoked */
  capabilityId: string;
  /** Context type */
  type: AIContextType;
  /** Human review is ALWAYS required */
  humanReviewRequired: true;
  /** Context creation timestamp */
  createdAt: string;
  /** Context lifecycle status */
  status: AIContextStatus;
  /** Context metadata */
  metadata: ContextMetadata;
  /** Related context references */
  references: ContextReference[];
  /** Traceability record */
  trace: ContextTrace;
  /** Audit context */
  audit: ContextAuditRecord;
}

export type AIContextType =
  | 'KNOWLEDGE'    // Knowledge context
  | 'ASSISTANT'    // Assistant context
  | 'RAG'          // RAG context
  | 'TOOL';        // Tool context

export type AIContextStatus =
  | 'CREATED'      // Context created
  | 'VALIDATED'    // Context validated
  | 'ACTIVE'       // Context in use
  | 'COMPLETED'    // Context completed
  | 'EXPIRED';     // Context expired

// ============================================
// Context Metadata
// ============================================

export interface ContextMetadata {
  /** Context source */
  source: AIContextType;
  /** Context tags */
  tags?: string[];
  /** Context priority */
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  /** Context scope */
  scope?: string;
  /** Additional metadata */
  extra?: Record<string, unknown>;
}

// ============================================
// Context Reference
// ============================================

export interface ContextReference {
  /** Reference ID */
  id: string;
  /** Reference type (e.g., RAG result, tool output) */
  type: 'RAG' | 'TOOL' | 'ASSISTANT' | 'KNOWLEDGE';
  /** Reference entity type */
  entityType?: string;
  /** Reference entity ID */
  entityId?: string;
  /** Reference title */
  title: string;
  /** Reference description */
  description?: string;
  /** Reference timestamp */
  referencedAt: string;
}

// ============================================
// Context Trace
// ============================================

export interface ContextTrace {
  /** Trace ID */
  traceId: string;
  /** Context ID */
  contextId: string;
  /** Trace events */
  events: ContextTraceEvent[];
  /** Trace start time */
  startedAt: string;
  /** Trace end time */
  completedAt?: string;
}

export interface ContextTraceEvent {
  /** Event type */
  event: 'CREATED' | 'VALIDATED' | 'ROUTED' | 'COMPLETED' | 'ERROR';
  /** Event timestamp */
  timestamp: string;
  /** Event description */
  description: string;
  /** Event metadata */
  metadata?: Record<string, unknown>;
}

// ============================================
// Context Audit Record
// ============================================

export interface ContextAuditRecord {
  /** Audit ID */
  auditId: string;
  /** Context ID */
  contextId: string;
  /** User ID */
  userId: string;
  /** Action performed */
  action: 'CONTEXT_CREATE' | 'CONTEXT_VALIDATE' | 'CONTEXT_COMPLETE' | 'CONTEXT_ERROR';
  /** Audit timestamp */
  timestamp: string;
  /** Audit metadata */
  metadata?: Record<string, unknown>;
}