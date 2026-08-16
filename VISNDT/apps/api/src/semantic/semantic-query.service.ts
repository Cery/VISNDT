import { Injectable, Logger } from '@nestjs/common';
import { RetrievalService, RetrievalOptions } from './retrieval.service';
import { RankingService } from './ranking.service';
import { EmbeddingService } from '../embedding/embedding.service';
import { EmbeddingCacheService } from './embedding-cache.service';
import {
  SemanticQueryDto,
  SemanticEntityType,
  SemanticQueryResultItem,
  SemanticQueryResponse,
  SemanticQueryDiagnostics,
} from './dto/semantic-query.dto';

// ============================================
// SemanticQueryService — M21.4.6 Ranking Foundation
//
// Enhanced unified query interface with Ranking Layer integration.
// Flow: text query → embed → retrieve → RANK → ranked results
//
// M21.4.6 Additions:
//   - RankingService integration (ranked results)
//   - semanticScore + rankingScore in results
//   - rankingStrategy metadata in response
//
// NOT a search service:
//   - No ranking algorithm tuning
//   - No business filtering
//   - No recommendation logic
//   - No supplier matching
//   - No transaction logic
//
// Semantic Layer = Retrieve → Rank → STOP.
// ============================================

@Injectable()
export class SemanticQueryService {
  private readonly logger = new Logger(SemanticQueryService.name);

  constructor(
    private readonly retrievalService: RetrievalService,
    private readonly rankingService: RankingService,
    private readonly embeddingService: EmbeddingService,
    private readonly embeddingCache: EmbeddingCacheService,
  ) {}

  /**
   * Execute semantic query with ranking.
   *
   * Contract (FROZEN M21.4.4, M21.4.5/6 additive):
   *   Input:  { query, entityType, limit, [threshold] }
   *   Output: { query, entityType, results (with semanticScore+rankingScore), total, diagnostics, rankingStrategy }
   *
   * Flow:
   *   1. Generate embedding (cache-first)
   *   2. RetrievalService.retrieve() with threshold
   *   3. RankingService.rank() converts to ranked results
   *   4. Return ranked results with diagnostics
   */
  async query(dto: SemanticQueryDto): Promise<SemanticQueryResponse> {
    this.logger.log(
      `Semantic query: entityType=${dto.entityType}, limit=${dto.limit}, threshold=${dto.threshold}`,
    );

    // Step 1: Get or generate embedding
    let embedding: number[];

    const cached = this.embeddingCache.get(dto.query);
    if (cached) {
      embedding = cached;
      this.logger.log('Using cached embedding');
    } else {
      this.logger.log('Generating new embedding');
      embedding = await this.embeddingService.generateEmbedding(dto.query);
      this.embeddingCache.set(dto.query, embedding);
    }

    // Step 2: Build retrieval options
    const options: RetrievalOptions = {
      limit: dto.limit ?? 10,
      threshold: dto.threshold ?? 0,
      includeMetadata: true,
    };

    // Step 3: Unified retrieval
    const retrievalResponse = await this.retrievalService.retrieve(
      embedding,
      dto.entityType as unknown as 'content' | 'product' | 'chunk',
      options,
    );

    // Step 4: Ranking (M21.4.6) — convert retrieval results to ranked results
    const rankingInputs = retrievalResponse.results.map((r) => ({
      entityType: dto.entityType,
      entityId: r.id,
      similarity: r.similarity,
      ...(r.metadata ? { metadata: r.metadata } : {}),
    }));

    const rankingOutput = await this.rankingService.rank(rankingInputs);

    // Step 5: Map to frozen contract (M21.4.4 base + M21.4.5/6 additive)
    const results: SemanticQueryResultItem[] = rankingOutput.results.map((r) => ({
      entityType: dto.entityType,
      entityId: r.entityId,
      similarity: r.similarity,
      semanticScore: r.semanticScore,
      rankingScore: r.rankingScore,
      ...(r.metadata ? { metadata: r.metadata } : {}),
    }));

    const diagnostics: SemanticQueryDiagnostics = {
      executionTimeMs: retrievalResponse.diagnostics.executionTimeMs + rankingOutput.executionTimeMs,
      totalScanned: retrievalResponse.diagnostics.totalScanned,
      filteredByThreshold: retrievalResponse.diagnostics.filteredByThreshold,
      thresholdApplied: retrievalResponse.diagnostics.thresholdApplied,
    };

    this.logger.log(
      `Query complete: ${results.length} ranked results in ${diagnostics.executionTimeMs}ms (strategy: ${rankingOutput.strategy})`,
    );

    return {
      query: dto.query,
      entityType: dto.entityType,
      results,
      total: results.length,
      diagnostics,
      rankingStrategy: rankingOutput.strategy,
    };
  }
}