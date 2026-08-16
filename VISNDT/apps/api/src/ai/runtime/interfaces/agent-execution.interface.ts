/**
 * Agent Execution Interface — M21.7.2 Agent Runtime Foundation
 *
 * Defines the execution contract between Agent Runtime and future Tool Layer.
 * Agent Runtime is an Execution Framework Foundation, NOT a Decision Engine.
 */

import { AgentExecutionContext } from './agent-context.interface';

// ============================================
// Agent Execution Result
// ============================================

export interface AgentExecutionResult {
  /** Execution status */
  status: 'RECEIVED' | 'VALIDATED' | 'REJECTED' | 'ROUTED' | 'COMPLETED' | 'ERROR';
  /** Output data (advisory only) */
  output: AgentOutput;
  /** Whether human review is required before action */
  requiresHumanReview: boolean;
  /** Audit log ID for traceability */
  auditId: string;
  /** Request ID for correlation */
  requestId: string;
  /** Execution timestamp */
  executedAt: string;
  /** Optional error message */
  error?: string;
}

// ============================================
// Agent Output (Advisory Only)
// ============================================

export interface AgentOutput {
  /** Output type */
  type: AgentOutputType;
  /** Advisory summary */
  summary: string;
  /** Structured data (advisory) */
  data?: Record<string, unknown>;
  /** Suggestions for human review */
  suggestions?: string[];
  /** Confidence level (0-1) */
  confidence?: number;
}

export type AgentOutputType =
  | 'OBSERVATION'   // Observed state
  | 'ANALYSIS'      // Analytical insight
  | 'SUGGESTION'    // Action suggestion
  | 'STATUS';       // Status report

// ============================================
// Agent Execution Contract
// ============================================

/**
 * Agent Execution Contract — enforced by Agent Runtime.
 * All capabilities must comply with this contract.
 */
export interface AgentExecutionContract {
  /** Validate that the capability can be invoked */
  validate(context: AgentExecutionContext): Promise<AgentExecutionResult>;
  /** Route the request to the appropriate capability handler */
  route(context: AgentExecutionContext): Promise<AgentExecutionResult>;
}

// ============================================
// Capability Invocation Boundary
// ============================================

export interface CapabilityInvocation {
  capabilityId: string;
  context: AgentExecutionContext;
  /** Human review is always required before any business action */
  humanReviewRequired: true;
}