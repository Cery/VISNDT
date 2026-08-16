/**
 * Assistant Request Interface — M21.7.5 AI Assistant Foundation
 *
 * Defines the request contract for AI Assistant orchestration.
 * All requests require human review. No autonomous execution.
 */

import { AssistantContext } from './assistant-context.interface';

// ============================================
// Assistant Request
// ============================================

export interface AssistantRequest {
  /** Capability ID to invoke */
  capabilityId: string;
  /** Assistant context */
  context: AssistantContext;
  /** Input payload */
  input: Record<string, unknown>;
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

// ============================================
// Assistant Request Status
// ============================================

export type AssistantRequestStatus =
  | 'RECEIVED'      // Request received
  | 'VALIDATED'     // Context validated
  | 'REJECTED'      // Request rejected
  | 'DEFERRED'      // Execution deferred (capability PLANNED)
  | 'ROUTED'        // Routed to Agent Runtime
  | 'COMPLETED'     // Completed (advisory output)
  | 'ERROR';        // Error