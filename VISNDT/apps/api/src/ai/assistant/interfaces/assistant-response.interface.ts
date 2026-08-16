/**
 * Assistant Response Interface — M21.7.5 AI Assistant Foundation
 *
 * Defines the response contract for AI Assistant orchestration.
 * All responses are ADVISORY. Human review is required for any action.
 */

// ============================================
// Assistant Response
// ============================================

export interface AssistantResponse {
  /** Response status */
  status: AssistantResponseStatus;
  /** Advisory output */
  output: AssistantOutput;
  /** Human review is ALWAYS required */
  requiresHumanReview: true;
  /** Capability ID that was invoked */
  capabilityId: string;
  /** Session ID for correlation */
  sessionId: string;
  /** Audit log ID */
  auditId: string;
  /** Execution timestamp */
  executedAt: string;
  /** Optional error message */
  error?: string;
}

export type AssistantResponseStatus =
  | 'RECEIVED'      // Request received
  | 'VALIDATED'     // Context validated
  | 'REJECTED'      // Request rejected
  | 'DEFERRED'      // Capability is PLANNED, execution deferred
  | 'COMPLETED'     // Completed (advisory)
  | 'ERROR';        // Error

// ============================================
// Assistant Output
// ============================================

export interface AssistantOutput {
  /** Output type */
  type: AssistantOutputType;
  /** Summary of the output */
  summary: string;
  /** Structured data (advisory only) */
  data?: Record<string, unknown>;
  /** Suggestions for human review */
  suggestions?: string[];
  /** Confidence level (0-1) */
  confidence?: number;
}

export type AssistantOutputType =
  | 'OBSERVATION'   // Observed state
  | 'ANALYSIS'      // Analytical insight
  | 'SUGGESTION'    // Action suggestion
  | 'STATUS';       // Status report