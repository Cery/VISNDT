/**
 * Assistant Context Interface — M21.7.5 AI Assistant Foundation
 *
 * Defines the context contract for AI Assistant orchestration.
 * Human review is always required. No autonomous execution.
 */

// ============================================
// Assistant Context
// ============================================

export interface AssistantContext {
  /** Unique session identifier */
  sessionId: string;
  /** User ID from JWT */
  userId: string;
  /** Request timestamp (ISO 8601) */
  timestamp: string;
  /** Human review is ALWAYS required */
  humanReviewRequired: true;
  /** Audit context for traceability */
  auditContext: AssistantAuditContext;
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

// ============================================
// Assistant Audit Context
// ============================================

export interface AssistantAuditContext {
  /** Request origin (e.g., 'ADMIN', 'WORKSPACE', 'INTERNAL') */
  origin: string;
  /** Previous audit log ID for correlation */
  correlationId?: string;
  /** Request trace identifier */
  traceId?: string;
}

// ============================================
// Assistant Session
// ============================================

export interface AssistantSession {
  /** Session ID */
  sessionId: string;
  /** User ID */
  userId: string;
  /** Session status */
  status: AssistantSessionStatus;
  /** Created at */
  createdAt: string;
  /** Last updated at */
  updatedAt: string;
  /** Capability ID being used */
  capabilityId?: string;
  /** Audit log ID */
  auditId?: string;
}

export type AssistantSessionStatus =
  | 'CREATED'      // Session created
  | 'ACTIVE'       // Session active
  | 'COMPLETED'    // Session completed
  | 'ERROR';       // Session error

// ============================================
// Assistant Status
// ============================================

export interface AssistantStatus {
  /** Assistant module status */
  status: 'READY' | 'DEGRADED' | 'UNAVAILABLE';
  /** Total sessions created */
  totalSessions: number;
  /** Active sessions */
  activeSessions: number;
  /** Capability registry status */
  capabilityRegistry: {
    totalCapabilities: number;
    plannedCapabilities: number;
    availableCapabilities: number;
  };
  /** Boundary enforcement */
  boundaries: {
    humanInLoopEnforced: boolean;
    noAutonomousDecision: boolean;
    noBusinessMutation: boolean;
    noLLMExecution: boolean;
  };
}