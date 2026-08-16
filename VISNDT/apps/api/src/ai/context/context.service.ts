/**
 * Context Service — M21.7.7 AI Knowledge Context Foundation
 *
 * Context governance layer for AI capability orchestration.
 * Provides context validation, registry, traceability, and audit.
 *
 * Rules:
 * 1. Context only defines contracts — no execution.
 * 2. All contexts require human review.
 * 3. No LLM, no vector DB, no embedding, no business mutation.
 * 4. Context is the governance layer, not the decision layer.
 */

import { Injectable, Logger } from '@nestjs/common';
import { AuditLogService } from '../../audit-log/audit-log.service';
import {
  AIContext,
  AIContextStatus,
  AIContextType,
  ContextTrace,
  ContextTraceEvent,
  ContextAuditRecord,
  ContextReference,
} from './interfaces/ai-context.interface';
import {
  KnowledgeContext,
  KnowledgeDomain,
  KnowledgeQuery,
  KnowledgeResponse,
} from './interfaces/knowledge-context.interface';

@Injectable()
export class ContextService {
  private readonly logger = new Logger(ContextService.name);

  /** In-memory context registry */
  private readonly contexts = new Map<string, AIContext>();

  constructor(
    private readonly auditLogService: AuditLogService,
  ) {}

  // ============================================
  // Context Lifecycle
  // ============================================

  /**
   * Create a new AI context.
   */
  createContext(
    contextId: string,
    userId: string,
    capabilityId: string,
    type: AIContextType,
    options?: {
      tags?: string[];
      priority?: 'LOW' | 'MEDIUM' | 'HIGH';
      scope?: string;
      references?: ContextReference[];
      extra?: Record<string, unknown>;
    },
  ): AIContext {
    const now = new Date().toISOString();

    const context: AIContext = {
      contextId,
      userId,
      capabilityId,
      type,
      humanReviewRequired: true,
      createdAt: now,
      status: 'CREATED',
      metadata: {
        source: type,
        tags: options?.tags,
        priority: options?.priority,
        scope: options?.scope,
        extra: options?.extra,
      },
      references: options?.references ?? [],
      trace: {
        traceId: `trace-${contextId}`,
        contextId,
        events: [
          {
            event: 'CREATED',
            timestamp: now,
            description: `Context created for capability: ${capabilityId}`,
          },
        ],
        startedAt: now,
      },
      audit: {
        auditId: `audit-${contextId}`,
        contextId,
        userId,
        action: 'CONTEXT_CREATE',
        timestamp: now,
      },
    };

    this.contexts.set(contextId, context);
    this.logger.log(`[Context] Created: ${contextId} (type=${type}, user=${userId})`);

    return context;
  }

  /**
   * Validate a context.
   */
  validate(context: AIContext): AIContext {
    if (context.humanReviewRequired !== true) {
      this.logger.warn(`[Context] humanReviewRequired was not true for ${context.contextId}`);
    }

    const updated: AIContext = {
      ...context,
      status: 'VALIDATED',
      trace: {
        ...context.trace,
        events: [
          ...context.trace.events,
          {
            event: 'VALIDATED',
            timestamp: new Date().toISOString(),
            description: 'Context validated successfully',
          },
        ],
      },
    };

    this.contexts.set(context.contextId, updated);
    this.logger.log(`[Context] Validated: ${context.contextId}`);

    return updated;
  }

  /**
   * Complete a context.
   */
  complete(context: AIContext): AIContext {
    const now = new Date().toISOString();

    const updated: AIContext = {
      ...context,
      status: 'COMPLETED',
      trace: {
        ...context.trace,
        events: [
          ...context.trace.events,
          {
            event: 'COMPLETED',
            timestamp: now,
            description: 'Context completed',
          },
        ],
        completedAt: now,
      },
    };

    this.contexts.set(context.contextId, updated);
    this.logger.log(`[Context] Completed: ${context.contextId}`);

    return updated;
  }

  // ============================================
  // Context Registry
  // ============================================

  getContext(contextId: string): AIContext | undefined {
    return this.contexts.get(contextId);
  }

  listContexts(type?: AIContextType): AIContext[] {
    const all = Array.from(this.contexts.values());
    return type ? all.filter(c => c.type === type) : all;
  }

  getContextStatus(contextId: string): AIContextStatus | undefined {
    return this.contexts.get(contextId)?.status;
  }

  // ============================================
  // Knowledge Context
  // ============================================

  /**
   * Create a knowledge context (future Knowledge Base integration).
   */
  createKnowledgeContext(
    contextId: string,
    userId: string,
    capabilityId: string,
    domain: KnowledgeDomain,
    query: KnowledgeQuery,
  ): KnowledgeContext {
    const base = this.createContext(
      contextId,
      userId,
      capabilityId,
      'KNOWLEDGE',
      {
        scope: domain,
        extra: { query },
      },
    );

    const knowledgeContext: KnowledgeContext = {
      ...base,
      type: 'KNOWLEDGE',
      knowledgeDomain: domain,
      query,
      sourceScope: 'ALL',
      response: {
        status: 'DEFERRED',
        items: [],
        total: 0,
        respondedAt: new Date().toISOString(),
        requiresHumanReview: true,
      },
    };

    this.contexts.set(contextId, knowledgeContext);
    this.logger.log(`[Context] Knowledge context created: ${contextId} (domain=${domain})`);

    return knowledgeContext;
  }

  // ============================================
  // Context Trace
  // ============================================

  getTrace(contextId: string): ContextTrace | undefined {
    return this.contexts.get(contextId)?.trace;
  }

  addTraceEvent(contextId: string, event: ContextTraceEvent): void {
    const context = this.contexts.get(contextId);
    if (!context) {
      this.logger.warn(`[Context] Cannot add trace event: context ${contextId} not found`);
      return;
    }

    context.trace.events.push(event);
    this.contexts.set(contextId, context);
    this.logger.log(`[Context] Trace event added: ${contextId} -> ${event.event}`);
  }

  // ============================================
  // Context Audit
  // ============================================

  async auditContext(context: AIContext): Promise<void> {
    try {
      await this.auditLogService.log({
        entityType: 'AI_CONTEXT',
        entityId: context.contextId,
        action: 'STATUS_CHANGE',
        operatorId: context.userId,
        newValue: {
          contextType: context.type,
          contextStatus: context.status,
          capabilityId: context.capabilityId,
          humanReviewRequired: true,
          traceEvents: context.trace.events.length,
          createdAt: context.createdAt,
        },
      });
      this.logger.log(`[Context] Audit logged: ${context.contextId}, status=${context.status}`);
    } catch (error) {
      this.logger.error(`[Context] Audit log failed: ${error}`);
    }
  }

  getAuditRecord(contextId: string): ContextAuditRecord | undefined {
    return this.contexts.get(contextId)?.audit;
  }

  // ============================================
  // Context Status
  // ============================================

  getStatus(): {
    totalContexts: number;
    byType: Record<AIContextType, number>;
    byStatus: Record<AIContextStatus, number>;
    boundaries: {
      humanInLoopEnforced: boolean;
      noAutonomousDecision: boolean;
      noBusinessMutation: boolean;
      noLLMExecution: boolean;
    };
  } {
    const all = Array.from(this.contexts.values());
    const byType: Record<AIContextType, number> = {
      KNOWLEDGE: 0,
      ASSISTANT: 0,
      RAG: 0,
      TOOL: 0,
    };
    const byStatus: Record<AIContextStatus, number> = {
      CREATED: 0,
      VALIDATED: 0,
      ACTIVE: 0,
      COMPLETED: 0,
      EXPIRED: 0,
    };

    for (const c of all) {
      byType[c.type] = (byType[c.type] || 0) + 1;
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
    }

    return {
      totalContexts: all.length,
      byType,
      byStatus,
      boundaries: {
        humanInLoopEnforced: true,
        noAutonomousDecision: true,
        noBusinessMutation: true,
        noLLMExecution: true,
      },
    };
  }
}