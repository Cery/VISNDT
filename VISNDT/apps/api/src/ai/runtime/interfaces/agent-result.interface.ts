/**
 * Agent Result Interface — M21.7.2 Agent Runtime Foundation
 *
 * Defines the result contract for Agent Runtime operations.
 * All results are ADVISORY only. Human confirmation is required for action.
 */

import { AgentExecutionContext } from './agent-context.interface';
import { AgentExecutionResult } from './agent-execution.interface';

// ============================================
// Agent Runtime Invocation Result
// ============================================

export interface AgentRuntimeInvocation {
  /** Unique invocation ID */
  invocationId: string;
  /** Request correlation ID */
  requestId: string;
  /** Capability invoked */
  capabilityId: string;
  /** Execution context snapshot */
  context: AgentExecutionContext;
  /** Execution result */
  result: AgentExecutionResult;
  /** When the invocation was created */
  createdAt: string;
}

// ============================================
// Agent Runtime Status
// ============================================

export interface AgentRuntimeStatus {
  /** Runtime module status */
  status: 'READY' | 'DEGRADED' | 'UNAVAILABLE';
  /** Total invocations since startup */
  totalInvocations: number;
  /** Active invocations */
  activeInvocations: number;
  /** Capability routing status */
  capabilityRouting: {
    enabled: boolean;
    availableCapabilities: number;
    plannedCapabilities: number;
  };
  /** Boundary enforcement status */
  boundaries: {
    humanInLoopEnforced: boolean;
    noAutonomousDecision: boolean;
    noBusinessMutation: boolean;
    noLLMExecution: boolean;
  };
}

// ============================================
// Agent Runtime Invocation Record
// ============================================

export interface AgentRuntimeInvocationRecord {
  invocationId: string;
  requestId: string;
  capabilityId: string;
  userId: string;
  status: string;
  requiresHumanReview: boolean;
  createdAt: string;
  auditId: string;
}