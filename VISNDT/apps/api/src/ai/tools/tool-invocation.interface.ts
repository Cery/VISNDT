/**
 * Tool Invocation Interface — M21.7.3 AI Tool Layer Foundation
 *
 * Defines the invocation contract between Agent Runtime and Tool Layer.
 * All invocations require human review. No autonomous execution.
 */

import { AgentExecutionContext } from '../runtime/interfaces/agent-context.interface';

// ============================================
// Tool Invocation Request
// ============================================

export interface ToolInvocationRequest {
  /** Tool ID to invoke */
  toolId: string;
  /** Agent execution context */
  agentContext: AgentExecutionContext;
  /** Input payload for the tool */
  input: Record<string, unknown>;
}

// ============================================
// Tool Invocation Result
// ============================================

export interface ToolInvocationResult {
  /** Invocation status */
  status: ToolInvocationStatus;
  /** Tool output (advisory only) */
  output: ToolInvocationOutput;
  /** Human review is always required */
  requiresHumanReview: true;
  /** Tool ID that was invoked */
  toolId: string;
  /** Request ID for correlation */
  requestId: string;
  /** Execution timestamp */
  executedAt: string;
  /** Optional error message */
  error?: string;
}

// ============================================
// Tool Invocation Status
// ============================================

export type ToolInvocationStatus =
  | 'RECEIVED'      // Request received
  | 'VALIDATED'     // Input validated
  | 'REJECTED'      // Request rejected
  | 'DEFERRED'      // Tool is PLANNED, execution deferred
  | 'COMPLETED'     // Execution completed
  | 'ERROR';        // Execution error

// ============================================
// Tool Invocation Output
// ============================================

export interface ToolInvocationOutput {
  /** Output type */
  type: ToolOutputType;
  /** Summary of the output */
  summary: string;
  /** Structured data (advisory) */
  data?: Record<string, unknown>;
  /** Confidence level (0-1) */
  confidence?: number;
}

export type ToolOutputType =
  | 'OBSERVATION'   // Observed data
  | 'ANALYSIS'      // Analytical insight
  | 'CONTEXT';      // Contextual information

// ============================================
// Tool Invocation Boundary
// ============================================

/**
 * Tool Invocation Boundary — enforced by Tool Layer.
 * All tool invocations must comply with this contract.
 */
export interface ToolInvocationContract {
  /** Validate input against tool schema */
  validateInput(request: ToolInvocationRequest): Promise<ToolInvocationResult>;
  /** Invoke the tool (deferred for PLANNED tools) */
  invoke(request: ToolInvocationRequest): Promise<ToolInvocationResult>;
}