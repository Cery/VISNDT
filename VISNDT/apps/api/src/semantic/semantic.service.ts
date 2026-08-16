import { Injectable, Logger } from '@nestjs/common';
import { RetrievalService } from './retrieval.service';
import { EmbeddingCacheService } from './embedding-cache.service';

// ============================================
// Semantic Service — M21.4.3 Foundation
// Delegates to RetrievalService + EmbeddingCacheService
// NOT a search service — no ranking, no aggregation, no business rules
// ============================================

export interface SemanticStatus {
  module: string;
  version: string;
  status: 'ok' | 'degraded' | 'unavailable';
  capabilities: {
    vectorRetrieval: boolean;
    embeddingCache: boolean;
    cosineSimilarity: boolean;
  };
  stats: {
    contentEmbeddings: number;
    productEmbeddings: number;
    chunkEmbeddings: number;
  };
}

@Injectable()
export class SemanticService {
  private readonly logger = new Logger(SemanticService.name);

  constructor(
    private readonly retrievalService: RetrievalService,
    private readonly embeddingCache: EmbeddingCacheService,
  ) {}

  /**
   * Module health check — used by SemanticController for status verification.
   * Returns current capabilities and embedding statistics.
   */
  async getStatus(): Promise<SemanticStatus> {
    const stats = await this.retrievalService.getEmbeddingStats();

    const capabilities = {
      vectorRetrieval: stats.contentEmbeddings > 0 || stats.productEmbeddings > 0,
      embeddingCache: this.embeddingCache.isAvailable(),
      cosineSimilarity: true,
    };

    const status: SemanticStatus['status'] = capabilities.vectorRetrieval
      ? 'ok'
      : 'degraded';

    return {
      module: 'Semantic Intelligence Layer',
      version: '0.1.0',
      status,
      capabilities,
      stats,
    };
  }
}