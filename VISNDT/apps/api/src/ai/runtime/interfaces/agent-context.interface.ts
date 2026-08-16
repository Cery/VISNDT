/**
 * Agent Context Interface — M21.7.2 Agent Runtime Foundation
 *
 * Defines the execution context contract for AI Agent Runtime.
 * All agent invocations require human review by default.
 * No autonomous decision, no business mutation.
 */

// ============================================
// Agent Execution Context
// ============================================

export interface AgentExecutionContext {
  /** Unique request identifier */
  requestId: string;
  /** User ID from JWT */
  userId: string;
  /** Capability ID being invoked */
  capabilityId: string;
  /** Request timestamp (ISO 8601) */
  timestamp: string;
  /** Audit context for traceability */
  auditContext: AgentAuditContext;
  /** Human review is REQUIRED by default */
  humanReviewRequired: boolean;
  /** Optional input payload */
  input?: Record<string, unknown>;
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

// ============================================
// Agent Audit Context
// ============================================

export interface AgentAuditContext {
  /** Request origin (e.g., 'ADMIN', 'WORKSPACE', 'INTERNAL') */
  origin: string;
  /** Previous audit log ID for correlation */
  correlationId?: string;
  /** Request trace identifier */
  traceId?: string;
}

// ============================================
// Agent Execution Request
// ============================================

export interface AgentExecutionRequest {
  /** Capability ID to invoke */
  capabilityId: string;
  /** Execution context */
  context: AgentExecutionContext;
  /** Input data for the capability */
  input: Record<string, unknown>;
}

// ============================================
// Agent Execution Status
// ============================================

export type AgentExecutionStatus =
  | 'RECEIVED'      // Request received, not yet processed
  | 'VALIDATED'     // Context validated, capability found
  | 'REJECTED'      // Request rejected (boundary violation)
  | 'ROUTED'        // Routed to capability handler
  | 'COMPLETED'     // Execution completed
  | 'ERROR';        // Execution error