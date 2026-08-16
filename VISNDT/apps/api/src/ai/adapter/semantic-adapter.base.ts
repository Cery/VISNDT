import { Injectable, Logger } from '@nestjs/common';
import { ToolAdapterInterface, AdapterType, AdapterStatus, AdapterCapability } from './interfaces/adapter-contract.interface';
import { SemanticAdapterContract, SemanticQueryRequest, SemanticQueryResponse, SemanticAdapterHealth } from './interfaces/semantic-adapter.interface';
import { AIToolDefinition } from '../tools/tool-definition.interface';
import { ToolInvocationRequest, ToolInvocationResult } from '../tools/tool-invocation.interface';

/**
 * Abstract Semantic Adapter — M21.7.4 AI Tool Registry & Semantic Adapter Foundation
 *
 * Foundation abstract class for Semantic adapters.
 * This is a PLACEHOLDER — no real Semantic Layer calls.
 *
 * Rules:
 * 1. All methods return UNAVAILABLE status.
 * 2. No direct exposure of RetrievalService, RankingService, UnifiedSearchService.
 * 3. No exposure of raw embedding vectors.
 * 4. No business mutation.
 */

@Injectable()
export abstract class AbstractSemanticAdapter implements ToolAdapterInterface, SemanticAdapterContract {
  private readonly logger = new Logger(this.constructor.name);

  readonly type: AdapterType = 'SEMANTIC';
  readonly status: AdapterStatus = 'UNAVAILABLE';

  // ============================================
  // ToolAdapterInterface Implementation
  // ============================================

  getCapabilities(): AdapterCapability[] {
    return [
      {
        id: 'SEMANTIC-SEARCH',
        name: 'Semantic Search',
        description: 'AI-powered semantic search across Products and Content',
        mutationAllowed: false,
        status: 'UNAVAILABLE',
      },
      {
        id: 'SEMANTIC-DISCOVERY',
        name: 'Content Discovery',
        description: 'Discover relevant content assets via semantic similarity',
        mutationAllowed: false,
        status: 'UNAVAILABLE',
      },
    ];
  }

  canHandle(tool: AIToolDefinition): boolean {
    return tool.category === 'SEMANTIC';
  }

  async execute(request: ToolInvocationRequest): Promise<ToolInvocationResult> {
    this.logger.log(`[Semantic Adapter] Execute called for tool: ${request.toolId} — adapter is UNAVAILABLE`);

    return {
      status: 'DEFERRED',
      output: {
        type: 'CONTEXT',
        summary: 'Semantic adapter is not yet available. Execution deferred to future implementation.',
        data: {
          adapterStatus: 'UNAVAILABLE',
          toolId: request.toolId,
        },
      },
      requiresHumanReview: true,
      toolId: request.toolId,
      requestId: request.agentContext.requestId,
      executedAt: new Date().toISOString(),
    };
  }

  // ============================================
  // SemanticAdapterContract Implementation
  // ============================================

  async semanticSearch(_request: SemanticQueryRequest): Promise<SemanticQueryResponse> {
    this.logger.log('[Semantic Adapter] Semantic search called — adapter is UNAVAILABLE');

    return {
      query: _request.query,
      results: [],
      total: 0,
      executedAt: new Date().toISOString(),
      adapterStatus: 'UNAVAILABLE',
    };
  }

  isAvailable(): boolean {
    return false;
  }

  getHealth(): SemanticAdapterHealth {
    return {
      status: 'UNAVAILABLE',
      semanticLayerAvailable: false,
      embeddingServiceAvailable: false,
      lastChecked: new Date().toISOString(),
      error: 'Semantic adapter not yet implemented. Deferred to M21.7.5+.',
    };
  }
}