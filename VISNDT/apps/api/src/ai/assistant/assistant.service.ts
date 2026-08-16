import { Injectable, Logger } from '@nestjs/common';
import { AuditLogService } from '../../audit-log/audit-log.service';
import {
  AssistantCapability,
  AssistantCapabilityCategory,
  AssistantCapabilityRegistryStatus,
} from './interfaces/assistant-capability.interface';
import {
  AssistantContext,
  AssistantSession,
  AssistantStatus,
} from './interfaces/assistant-context.interface';
import {
  AssistantRequest,
  AssistantRequestStatus,
} from './interfaces/assistant-request.interface';
import {
  AssistantResponse,
  AssistantOutput,
} from './interfaces/assistant-response.interface';

/**
 * Assistant Service — M21.7.5 AI Assistant Foundation
 *
 * Core orchestration service for AI Assistant.
 * Routes requests through Agent Runtime → Tool Layer → Adapter Layer.
 *
 * Rules:
 * 1. All capabilities are PLANNED — no real execution.
 * 2. All outputs require human review.
 * 3. No LLM, no business mutation, no autonomous decision.
 * 4. Assistant orchestrates; it does not decide.
 */

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);

  /** Capability registry */
  private readonly capabilities = new Map<string, AssistantCapability>();

  /** In-memory session records */
  private readonly sessions = new Map<string, AssistantSession>();

  constructor(
    private readonly auditLogService: AuditLogService,
  ) {
    this.initializeCapabilities();
  }

  // ============================================
  // Capability Registry
  // ============================================

  getCapabilities(): AssistantCapability[] {
    return Array.from(this.capabilities.values());
  }

  getCapability(id: string): AssistantCapability | undefined {
    return this.capabilities.get(id);
  }

  getCapabilityStatus(): AssistantCapabilityRegistryStatus {
    const all = Array.from(this.capabilities.values());
    const categories: Record<AssistantCapabilityCategory, number> = {
      BUSINESS_INSIGHT: 0,
      PRODUCT_ANALYSIS: 0,
      RFQ_ANALYSIS: 0,
      ADMIN_OPERATION: 0,
    };
    for (const cap of all) {
      categories[cap.category] = (categories[cap.category] || 0) + 1;
    }
    return {
      total: all.length,
      planned: all.filter(c => c.status === 'PLANNED').length,
      available: all.filter(c => c.status === 'AVAILABLE').length,
      categories,
    };
  }

  // ============================================
  // Assistant Status
  // ============================================

  getStatus(): AssistantStatus {
    const capStatus = this.getCapabilityStatus();
    return {
      status: 'READY',
      totalSessions: this.sessions.size,
      activeSessions: Array.from(this.sessions.values()).filter(s => s.status === 'ACTIVE').length,
      capabilityRegistry: {
        totalCapabilities: capStatus.total,
        plannedCapabilities: capStatus.planned,
        availableCapabilities: capStatus.available,
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
  // Assistant Request Lifecycle
  // ============================================

  /**
   * Receive an assistant request.
   * Validates context, checks capability, and returns advisory response.
   * All capabilities are PLANNED — no real execution.
   */
  async receive(request: AssistantRequest): Promise<AssistantResponse> {
    const { capabilityId, context, input } = request;

    this.logger.log(`[Assistant] Received request: capability=${capabilityId}, user=${context.userId}`);

    // Step 1: Validate context
    const validationResult = this.validateContext(context);
    if (validationResult) {
      return validationResult;
    }

    // Step 2: Validate capability
    const capability = this.capabilities.get(capabilityId);
    if (!capability) {
      this.logger.warn(`[Assistant] Unknown capability: ${capabilityId}`);
      const response = this.buildResponse(
        'REJECTED',
        context,
        capabilityId,
        'CAPABILITY_NOT_FOUND',
        `Capability '${capabilityId}' not found in registry`,
      );
      await this.auditRequest(context, response, 'REJECTED');
      return response;
    }

    // Step 3: Enforce boundary — no mutation
    if (capability.mutationAllowed) {
      this.logger.error(`[Assistant] Mutation attempt blocked: ${capabilityId}`);
      const response = this.buildResponse(
        'REJECTED',
        context,
        capabilityId,
        'MUTATION_BLOCKED',
        `Capability '${capability.name}' attempted business mutation. AI outputs are advisory only.`,
      );
      await this.auditRequest(context, response, 'REJECTED');
      return response;
    }

    // Step 4: All capabilities are PLANNED — return DEFERRED with advisory output
    if (capability.status !== 'AVAILABLE') {
      this.logger.log(`[Assistant] Capability '${capabilityId}' is ${capability.status} — advisory only`);
      const response = this.buildResponse(
        'DEFERRED',
        context,
        capabilityId,
        `CAPABILITY_${capability.status}`,
        `Capability '${capability.name}' is ${capability.status}. Execution deferred to future implementation.`,
        {
          type: 'STATUS',
          summary: `Capability '${capability.name}' is not yet available for execution.`,
          data: {
            capabilityId: capability.id,
            capabilityName: capability.name,
            capabilityCategory: capability.category,
            capabilityStatus: capability.status,
            input,
          },
          suggestions: [
            `Capability '${capability.name}' is planned for future implementation.`,
            'Human review is required for any business action.',
            'AI Assistant outputs are advisory only.',
          ],
        },
      );
      await this.auditRequest(context, response, 'DEFERRED');
      this.recordSession(context, capability, 'COMPLETED');
      return response;
    }

    // Step 5: (Future) Route through Agent Runtime → Tool Layer → Adapter → Semantic/Business
    const response = this.buildResponse(
      'DEFERRED',
      context,
      capabilityId,
      'CAPABILITY_NOT_AVAILABLE',
      `Capability '${capability.name}' execution handler not yet implemented.`,
    );
    await this.auditRequest(context, response, 'DEFERRED');
    return response;
  }

  // ============================================
  // Session Management
  // ============================================

  getSessions(): AssistantSession[] {
    return Array.from(this.sessions.values());
  }

  getSession(sessionId: string): AssistantSession | undefined {
    return this.sessions.get(sessionId);
  }

  // ============================================
  // Context Validation
  // ============================================

  private validateContext(context: AssistantContext): AssistantResponse | null {
    if (!context.sessionId) {
      return this.buildResponse('REJECTED', context, 'UNKNOWN', 'INVALID_CONTEXT', 'Missing sessionId');
    }
    if (!context.userId) {
      return this.buildResponse('REJECTED', context, 'UNKNOWN', 'INVALID_CONTEXT', 'Missing userId');
    }
    if (context.humanReviewRequired !== true) {
      this.logger.warn('[Assistant] humanReviewRequired was not true, forcing to true');
    }
    return null;
  }

  // ============================================
  // Audit Integration
  // ============================================

  private async auditRequest(
    context: AssistantContext,
    response: AssistantResponse,
    status: AssistantRequestStatus,
  ): Promise<void> {
    try {
      await this.auditLogService.log({
        entityType: 'AI_ASSISTANT',
        entityId: context.sessionId,
        action: 'STATUS_CHANGE',
        operatorId: context.userId,
        newValue: {
          capabilityId: response.capabilityId,
          status,
          requiresHumanReview: true,
          timestamp: context.timestamp,
          sessionId: context.sessionId,
        },
      });
      this.logger.log(`[Assistant] Audit logged: session=${context.sessionId}, status=${status}`);
    } catch (error) {
      this.logger.error(`[Assistant] Audit log failed: ${error}`);
    }
  }

  // ============================================
  // Session Record
  // ============================================

  private recordSession(
    context: AssistantContext,
    capability: AssistantCapability,
    status: 'COMPLETED' | 'ERROR',
  ): void {
    this.sessions.set(context.sessionId, {
      sessionId: context.sessionId,
      userId: context.userId,
      status,
      createdAt: context.timestamp,
      updatedAt: new Date().toISOString(),
      capabilityId: capability.id,
      auditId: `audit-${context.sessionId}`,
    });
  }

  // ============================================
  // Response Builder
  // ============================================

  private buildResponse(
    status: AssistantResponse['status'],
    context: AssistantContext,
    capabilityId: string,
    reason: string,
    message: string,
    outputOverride?: AssistantOutput,
  ): AssistantResponse {
    const output: AssistantOutput = outputOverride ?? {
      type: 'STATUS',
      summary: message,
      data: { capabilityId, reason, sessionId: context.sessionId },
      suggestions: [
        'Human review is required for any business action.',
        'AI Assistant outputs are advisory only.',
      ],
    };

    return {
      status,
      output,
      requiresHumanReview: true,
      capabilityId,
      sessionId: context.sessionId,
      auditId: `audit-${context.sessionId}`,
      executedAt: new Date().toISOString(),
      error: status === 'REJECTED' || status === 'ERROR' ? message : undefined,
    };
  }

  // ============================================
  // Planned Capabilities
  // ============================================

  private initializeCapabilities(): void {
    const planned: AssistantCapability[] = [
      {
        id: 'ASSIST-001',
        name: 'Business Insight Assistant',
        category: 'BUSINESS_INSIGHT',
        description: 'AI-powered business insight analysis across Demand, RFQ, Offer, and Matching data',
        mutationAllowed: false,
        requiresHumanReview: true,
        status: 'PLANNED',
        inputSchema: {
          query: 'string',
          scope: ['demand', 'rfq', 'offer', 'matching'],
          timeRange: ['7d', '30d', '90d'],
        },
        outputSchema: {
          insight: 'object',
          recommendations: 'array',
          dataContext: 'object',
        },
        tags: ['business', 'insight', 'analysis'],
      },
      {
        id: 'ASSIST-002',
        name: 'Product Analysis Assistant',
        category: 'PRODUCT_ANALYSIS',
        description: 'AI-powered product capability analysis and comparison',
        mutationAllowed: false,
        requiresHumanReview: true,
        status: 'PLANNED',
        inputSchema: {
          productIds: 'array',
          analysisType: ['capability', 'comparison', 'specification'],
        },
        outputSchema: {
          analysis: 'object',
          comparison: 'object',
          recommendations: 'array',
        },
        tags: ['product', 'analysis', 'comparison'],
      },
      {
        id: 'ASSIST-003',
        name: 'RFQ Analysis Assistant',
        category: 'RFQ_ANALYSIS',
        description: 'AI-powered RFQ analysis and supplier matching suggestions',
        mutationAllowed: false,
        requiresHumanReview: true,
        status: 'PLANNED',
        inputSchema: {
          rfqId: 'string',
          analysisType: ['requirements', 'matching', 'summary'],
        },
        outputSchema: {
          analysis: 'object',
          matchingSuggestions: 'array',
          requirementsSummary: 'object',
        },
        tags: ['rfq', 'analysis', 'matching'],
      },
      {
        id: 'ASSIST-004',
        name: 'Admin Operation Assistant',
        category: 'ADMIN_OPERATION',
        description: 'AI-powered administrative operation support and monitoring insights',
        mutationAllowed: false,
        requiresHumanReview: true,
        status: 'PLANNED',
        inputSchema: {
          operationType: ['monitoring', 'audit', 'analytics', 'summary'],
          timeRange: ['7d', '30d', '90d'],
        },
        outputSchema: {
          insight: 'object',
          alerts: 'array',
          recommendations: 'array',
        },
        tags: ['admin', 'operation', 'monitoring'],
      },
    ];

    for (const capability of planned) {
      this.capabilities.set(capability.id, capability);
      this.logger.log(`[Assistant] Registered capability: ${capability.id} (${capability.category}, ${capability.status})`);
    }
  }
}