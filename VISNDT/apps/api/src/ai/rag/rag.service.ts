import { Injectable, Logger } from '@nestjs/common';
import { AuditLogService } from '../../audit-log/audit-log.service';
import {
  RAGContext,
  RAGStatus,
} from './interfaces/rag-context.interface';
import {
  RetrievalRequest,
  RetrievalResult,
  RetrievalReference,
  RAGPipelineContract,
} from './interfaces/retrieval-contract.interface';
import {
  KnowledgeSource,
  KnowledgeSourceStatus,
  KnowledgeSourceType,
  KnowledgeSourceValidationResult,
  KnowledgeSourceRegistryStatus,
} from './interfaces/knowledge-source.interface';

/**
 * RAG Service — M21.7.6 AI RAG Foundation
 *
 * Knowledge Retrieval Preparation Layer.
 * Provides retrieval context, source registry, and pipeline foundation.
 *
 * Rules:
 * 1. All knowledge sources are PLANNED — no real retrieval.
 * 2. No direct access to Prisma, Business Service, or Semantic Service.
 * 3. All outputs require human review.
 * 4. RAG provides CONTEXT | OBSERVATION | REFERENCE, never DECISION.
 * 5. No LLM, no embedding, no vector database.
 */

@Injectable()
export class RAGService implements RAGPipelineContract {
  private readonly logger = new Logger(RAGService.name);

  /** Knowledge source registry */
  private readonly sources = new Map<string, KnowledgeSource>();

  constructor(
    private readonly auditLogService: AuditLogService,
  ) {
    this.initializeSources();
  }

  // ============================================
  // Knowledge Source Registry
  // ============================================

  getSources(): KnowledgeSource[] {
    return Array.from(this.sources.values());
  }

  getSource(id: string): KnowledgeSource | undefined {
    return this.sources.get(id);
  }

  listByType(type: KnowledgeSourceType): KnowledgeSource[] {
    return Array.from(this.sources.values()).filter(s => s.type === type);
  }

  validateSource(id: string): KnowledgeSourceValidationResult {
    const source = this.sources.get(id);
    if (!source) {
      return {
        valid: false,
        sourceId: id,
        status: 'PLANNED',
        available: false,
        reason: `Knowledge source '${id}' not found in registry`,
      };
    }
    return {
      valid: true,
      sourceId: source.id,
      status: source.status,
      available: source.status === 'AVAILABLE',
      reason: source.status !== 'AVAILABLE'
        ? `Knowledge source '${source.name}' is ${source.status}`
        : undefined,
    };
  }

  getSourceRegistryStatus(): KnowledgeSourceRegistryStatus {
    const all = Array.from(this.sources.values());
    const byType: Record<KnowledgeSourceType, number> = {
      PRODUCT: 0,
      CONTENT: 0,
      DOCUMENTATION: 0,
      GUIDE: 0,
    };
    for (const s of all) {
      byType[s.type] = (byType[s.type] || 0) + 1;
    }
    return {
      total: all.length,
      planned: all.filter(s => s.status === 'PLANNED').length,
      available: all.filter(s => s.status === 'AVAILABLE').length,
      byType,
    };
  }

  // ============================================
  // RAG Status
  // ============================================

  getStatus(): RAGStatus {
    const srcStatus = this.getSourceRegistryStatus();
    return {
      status: 'READY',
      totalSources: srcStatus.total,
      availableSources: srcStatus.available,
      plannedSources: srcStatus.planned,
      boundaries: {
        noAutonomousDecision: true,
        noLLMExecution: true,
        noVectorDatabase: true,
        noEmbedding: true,
        humanInLoopEnforced: true,
      },
    };
  }

  // ============================================
  // RAG Pipeline
  // ============================================

  /**
   * Pipeline: receive → validate → retrieve → format → audit
   * All sources are PLANNED — retrieval returns DEFERRED.
   */
  async receive(request: RetrievalRequest): Promise<RetrievalResult> {
    this.logger.log(`[RAG] Received request: ${request.context.requestId}, query="${request.query}"`);

    // Step 1: Validate context
    if (!this.validate(request.context)) {
      const result = this.buildResult(request, 'ERROR', 'Invalid RAG context');
      await this.auditRequest(request.context, result);
      return result;
    }

    // Step 2: Retrieve (DEFERRED — all sources PLANNED)
    const result = await this.retrieve(request);

    // Step 3: Format
    const formatted = this.format(result);

    // Step 4: Audit
    await this.auditRequest(request.context, formatted);

    return formatted;
  }

  validate(context: RAGContext): boolean {
    if (!context.requestId) {
      this.logger.warn('[RAG] Validation failed: missing requestId');
      return false;
    }
    if (!context.userId) {
      this.logger.warn('[RAG] Validation failed: missing userId');
      return false;
    }
    if (!context.query) {
      this.logger.warn('[RAG] Validation failed: missing query');
      return false;
    }
    if (context.humanReviewRequired !== true) {
      this.logger.warn('[RAG] humanReviewRequired was not true');
    }
    return true;
  }

  async retrieve(request: RetrievalRequest): Promise<RetrievalResult> {
    this.logger.log(`[RAG] Retrieve called for query="${request.query}" — all sources PLANNED`);

    // Check if any source is available
    const availableSources = Array.from(this.sources.values())
      .filter(s => s.status === 'AVAILABLE');

    if (availableSources.length === 0) {
      return this.buildResult(
        request,
        'DEFERRED',
        'All knowledge sources are PLANNED. Retrieval deferred to future implementation.',
      );
    }

    // Future: execute retrieval through available sources
    return this.buildResult(
      request,
      'DEFERRED',
      'Retrieval execution not yet implemented.',
    );
  }

  format(result: RetrievalResult): RetrievalResult {
    return {
      ...result,
      executedAt: new Date().toISOString(),
      requiresHumanReview: true,
    };
  }

  // ============================================
  // Audit Integration
  // ============================================

  private async auditRequest(
    context: RAGContext,
    result: RetrievalResult,
  ): Promise<void> {
    try {
      await this.auditLogService.log({
        entityType: 'AI_RAG',
        entityId: context.requestId,
        action: 'STATUS_CHANGE',
        operatorId: context.userId,
        newValue: {
          query: context.query,
          status: result.status,
          totalReferences: result.total,
          requiresHumanReview: true,
          sourceScope: context.sourceScope,
          timestamp: context.timestamp,
        },
      });
      this.logger.log(`[RAG] Audit logged: request=${context.requestId}, status=${result.status}`);
    } catch (error) {
      this.logger.error(`[RAG] Audit log failed: ${error}`);
    }
  }

  // ============================================
  // Result Builder
  // ============================================

  private buildResult(
    request: RetrievalRequest,
    status: RetrievalResult['status'],
    message: string,
  ): RetrievalResult {
    return {
      status,
      references: [],
      total: 0,
      query: request.query,
      executedAt: new Date().toISOString(),
      requiresHumanReview: true,
      metadata: {
        message,
        requestId: request.context.requestId,
        sourceScope: request.context.sourceScope,
        availableSources: Array.from(this.sources.values())
          .filter(s => s.status === 'AVAILABLE').length,
        plannedSources: Array.from(this.sources.values())
          .filter(s => s.status === 'PLANNED').length,
      },
    };
  }

  // ============================================
  // Planned Knowledge Sources
  // ============================================

  private initializeSources(): void {
    const planned: KnowledgeSource[] = [
      {
        id: 'KS-001',
        name: 'Product Knowledge',
        type: 'PRODUCT',
        description: 'Product specifications, parameters, and capability descriptions',
        mutationAllowed: false,
        status: 'PLANNED',
        metadata: {
          estimatedDocumentCount: 0,
          owner: 'Product Center',
        },
      },
      {
        id: 'KS-002',
        name: 'Content Assets',
        type: 'CONTENT',
        description: 'Content articles, guides, and documentation',
        mutationAllowed: false,
        status: 'PLANNED',
        metadata: {
          estimatedDocumentCount: 0,
          owner: 'Content Management',
        },
      },
      {
        id: 'KS-003',
        name: 'Technical Documentation',
        type: 'DOCUMENTATION',
        description: 'Technical specifications, standards, and reference materials',
        mutationAllowed: false,
        status: 'PLANNED',
        metadata: {
          estimatedDocumentCount: 0,
          owner: 'Documentation',
        },
      },
      {
        id: 'KS-004',
        name: 'Inspection Guides',
        type: 'GUIDE',
        description: 'Industrial inspection guides and best practices',
        mutationAllowed: false,
        status: 'PLANNED',
        metadata: {
          estimatedDocumentCount: 0,
          owner: 'Knowledge Base',
        },
      },
    ];

    for (const source of planned) {
      this.sources.set(source.id, source);
      this.logger.log(`[RAG] Registered knowledge source: ${source.id} (${source.type}, ${source.status})`);
    }
  }
}