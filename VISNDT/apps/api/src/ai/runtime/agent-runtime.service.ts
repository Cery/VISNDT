import { Injectable, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AuditLogService } from '../../audit-log/audit-log.service';
import { AIService } from '../ai.service';
import { AICapability } from '../interfaces/ai-capability.interface';
import {
  AgentExecutionContext,
  AgentExecutionRequest,
  AgentExecutionStatus,
} from './interfaces/agent-context.interface';
import {
  AgentExecutionResult,
  AgentOutput,
  CapabilityInvocation,
} from './interfaces/agent-execution.interface';
import {
  AgentRuntimeInvocation,
  AgentRuntimeStatus,
  AgentRuntimeInvocationRecord,
} from './interfaces/agent-result.interface';

/**
 * Agent Runtime Service — M21.7.2 Agent Runtime Foundation
 *
 * Core service for Agent Runtime lifecycle management.
 * This is an Execution Framework Foundation — NOT a Decision Engine.
 *
 * Rules:
 * 1. All agent invocations require human review (humanReviewRequired = true).
 * 2. No LLM execution, no business mutation, no autonomous decision.
 * 3. All capabilities are PLANNED — no real execution.
 * 4. Audit via existing AuditLog infrastructure.
 */

@Injectable()
export class AgentRuntimeService {
  private readonly logger = new Logger(AgentRuntimeService.name);

  /** In-memory invocation records (runtime only, no persistence) */
  private readonly invocationRecords: AgentRuntimeInvocationRecord[] = [];

  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly aiService: AIService,
  ) {}

  // ============================================
  // Agent Runtime Status
  // ============================================

  getRuntimeStatus(): AgentRuntimeStatus {
    return {
      status: 'READY',
      totalInvocations: this.invocationRecords.length,
      activeInvocations: 0,
      capabilityRouting: {
        enabled: true,
        availableCapabilities: 0,
        plannedCapabilities: this.aiService.getCapabilities().length,
      },
      boundaries: {
        humanInLoopEnforced: true,
        noAutonomousDecision: true,
        noBusinessMutation: true,
        noLLMExecution: true,
      },
    };
  }

  // ============================================
  // Invocation Records
  // ============================================

  getInvocationHistory(): AgentRuntimeInvocationRecord[] {
    return [...this.invocationRecords];
  }

  // ============================================
  // Agent Execution Lifecycle
  // ============================================

  /**
   * Receive an agent execution request.
   * Validates context, enforces boundaries, and routes to capability.
   * All capabilities are PLANNED — no real execution occurs.
   */
  async receive(request: AgentExecutionRequest): Promise<AgentExecutionResult> {
    const { capabilityId, context, input } = request;

    this.logger.log(`[Agent Runtime] Received request: capability=${capabilityId}, user=${context.userId}`);

    // Step 1: Validate context
    const validated = await this.validateContext(context);
    if (validated.status === 'REJECTED') {
      return validated;
    }

    // Step 2: Validate capability
    const capability = this.aiService.getCapabilities().find(c => c.id === capabilityId);
    if (!capability) {
      this.logger.warn(`[Agent Runtime] Unknown capability: ${capabilityId}`);
      await this.auditInvocation(context, 'REJECTED', `Unknown capability: ${capabilityId}`);
      return this.buildResult('REJECTED', 'CAPABILITY_NOT_FOUND', context, `Unknown capability: ${capabilityId}`);
    }

    // Step 3: Enforce boundary — no mutation allowed
    if (capability.mutationAllowed) {
      this.logger.error(`[Agent Runtime] Mutation attempt blocked: ${capabilityId}`);
      throw new ForbiddenException(
        `Capability '${capabilityId}' attempted business mutation. ` +
        'AI outputs are advisory only. See BOUNDARY-003: No Business Mutation.',
      );
    }

    // Step 4: Enforce boundary — all capabilities are PLANNED
    if (capability.status !== 'AVAILABLE') {
      this.logger.log(`[Agent Runtime] Capability '${capabilityId}' is ${capability.status} — no execution`);
      const result = this.buildResult(
        'ROUTED',
        `CAPABILITY_${capability.status}`,
        context,
        `Capability '${capability.label}' is ${capability.status}. No execution performed.`,
        {
          type: 'STATUS',
          summary: `Capability '${capability.label}' is not yet available.`,
          data: {
            capabilityId: capability.id,
            capabilityStatus: capability.status,
            capabilityCategory: capability.category,
          },
          suggestions: [
            `Capability '${capability.label}' is planned for future implementation.`,
            'Human review is required before any action.',
          ],
        },
      );

      await this.auditInvocation(context, 'ROUTED', `Capability ${capability.status}: ${capability.label}`);
      this.recordInvocation(context, capability, 'ROUTED');
      return result;
    }

    // Step 5: Route to capability (future — not yet implemented)
    this.logger.log(`[Agent Runtime] Routing to capability: ${capabilityId}`);
    const result = this.buildResult(
      'ROUTED',
      'CAPABILITY_PLANNED',
      context,
      `Capability '${capability.label}' routed. Execution deferred to Tool Layer.`,
    );

    await this.auditInvocation(context, 'ROUTED', `Routed: ${capability.label}`);
    this.recordInvocation(context, capability, 'ROUTED');
    return result;
  }

  // ============================================
  // Context Validation
  // ============================================

  private async validateContext(context: AgentExecutionContext): Promise<AgentExecutionResult> {
    // Validate required fields
    if (!context.requestId) {
      return this.buildResult('REJECTED', 'INVALID_CONTEXT', context, 'Missing requestId');
    }
    if (!context.userId) {
      return this.buildResult('REJECTED', 'INVALID_CONTEXT', context, 'Missing userId');
    }
    if (!context.capabilityId) {
      return this.buildResult('REJECTED', 'INVALID_CONTEXT', context, 'Missing capabilityId');
    }
    if (!context.timestamp) {
      return this.buildResult('REJECTED', 'INVALID_CONTEXT', context, 'Missing timestamp');
    }

    // Enforce human-in-the-loop
    if (context.humanReviewRequired !== true) {
      this.logger.warn(`[Agent Runtime] humanReviewRequired was false, forcing to true`);
      context.humanReviewRequired = true;
    }

    return this.buildResult('VALIDATED', 'CONTEXT_VALID', context);
  }

  // ============================================
  // Capability Invocation Boundary
  // ============================================

  /**
   * Create a capability invocation context.
   * humanReviewRequired is ALWAYS true.
   */
  createInvocation(capabilityId: string, userId: string, input?: Record<string, unknown>): CapabilityInvocation {
    const context: AgentExecutionContext = {
      requestId: `ai-runtime-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId,
      capabilityId,
      timestamp: new Date().toISOString(),
      auditContext: {
        origin: 'INTERNAL',
        traceId: `trace-${Date.now()}`,
      },
      humanReviewRequired: true,
      input,
    };

    return {
      capabilityId,
      context,
      humanReviewRequired: true,
    };
  }

  // ============================================
  // Audit Integration
  // ============================================

  private async auditInvocation(
    context: AgentExecutionContext,
    status: AgentExecutionStatus,
    message: string,
  ): Promise<void> {
    try {
      await this.auditLogService.log({
        entityType: 'AI_AGENT_RUNTIME',
        entityId: context.requestId,
        action: 'STATUS_CHANGE',
        operatorId: context.userId,
        newValue: {
          capabilityId: context.capabilityId,
          status,
          message,
          humanReviewRequired: context.humanReviewRequired,
          timestamp: context.timestamp,
        },
      });
      this.logger.log(`[Agent Runtime] Audit logged: requestId=${context.requestId}, status=${status}`);
    } catch (error) {
      this.logger.error(`[Agent Runtime] Audit log failed: ${error}`);
      // Audit failure should not break the main flow
    }
  }

  // ============================================
  // Invocation Record (in-memory)
  // ============================================

  private recordInvocation(
    context: AgentExecutionContext,
    capability: AICapability,
    status: string,
  ): void {
    this.invocationRecords.push({
      invocationId: `inv-${context.requestId}`,
      requestId: context.requestId,
      capabilityId: capability.id,
      userId: context.userId,
      status,
      requiresHumanReview: true,
      createdAt: context.timestamp,
      auditId: `audit-${context.requestId}`,
    });
  }

  // ============================================
  // Result Builder
  // ============================================

  private buildResult(
    status: AgentExecutionResult['status'],
    reason: string,
    context: AgentExecutionContext,
    message?: string,
    outputOverride?: AgentOutput,
  ): AgentExecutionResult {
    const output: AgentOutput = outputOverride ?? {
      type: 'STATUS',
      summary: message ?? `Execution ${status}: ${reason}`,
      data: {
        requestId: context.requestId,
        capabilityId: context.capabilityId,
        reason,
      },
      suggestions: [
        'Human review is required before any action.',
        'AI outputs are advisory only.',
      ],
    };

    return {
      status,
      output,
      requiresHumanReview: true,
      auditId: `audit-${context.requestId}`,
      requestId: context.requestId,
      executedAt: new Date().toISOString(),
      error: status === 'ERROR' || status === 'REJECTED' ? (message ?? reason) : undefined,
    };
  }
}