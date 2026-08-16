import { Injectable, Logger } from '@nestjs/common';
import {
  RankingInput,
  RankedResult,
  RankingOutput,
  RankingStrategy,
  RankingFactorBreakdown,
} from './ranking.contract';

// ============================================
// DefaultRankingStrategy — M21.4.6 Base Strategy
//
// Simplest possible ranking: semanticScore = similarity.
// This is the baseline strategy — all future strategies
// build on top of this foundation.
//
// Future strategies (M21.4.7+):
//   - FreshnessWeightedStrategy (recency boost)
//   - CompositeStrategy (multi-factor ranking)
//   - LearnedStrategy (ML-based ranking)
// ============================================

class DefaultRankingStrategy implements RankingStrategy {
  readonly name = 'DefaultRankingStrategy';

  compute(input: RankingInput): RankedResult {
    // Base strategy: semanticScore = rankingScore = similarity
    // No additional factors applied.
    const semanticScore = input.similarity;
    const rankingScore = semanticScore;

    return {
      entityType: input.entityType,
      entityId: input.entityId,
      similarity: input.similarity, // ALWAYS PRESERVED
      semanticScore,
      rankingScore,
      ...(input.metadata ? { metadata: input.metadata } : {}),
    };
  }

  async rank(inputs: RankingInput[]): Promise<RankingOutput> {
    const startTime = Date.now();

    const ranked = inputs
      .map((input) => this.compute(input))
      .sort((a, b) => b.rankingScore - a.rankingScore);

    return {
      results: ranked,
      total: ranked.length,
      strategy: this.name,
      executionTimeMs: Date.now() - startTime,
    };
  }
}

// ============================================
// RankingService — M21.4.6 Semantic Ranking Foundation
//
// Converts raw Retrieval results into Ranked results.
// Independent layer between Retrieval and future Unified Search.
//
// Architecture:
//   Retrieval Layer → RankingService → Ranked Result
//                          ↑
//                    RankingStrategy (extension point)
//
// NOT:
//   - Business logic ranking
//   - Recommendation engine
//   - User profile ranking
//   - Commercial ranking
//
// Semantic Layer: Retrieve → Rank → STOP.
// ============================================

@Injectable()
export class RankingService {
  private readonly logger = new Logger(RankingService.name);
  private strategy: RankingStrategy;

  constructor() {
    this.strategy = new DefaultRankingStrategy();
    this.logger.log(`RankingService initialized with strategy: ${this.strategy.name}`);
  }

  /**
   * Set the active ranking strategy.
   * Extension point for future strategies (M21.4.7+).
   */
  setStrategy(strategy: RankingStrategy): void {
    this.logger.log(`Strategy changed: ${this.strategy.name} → ${strategy.name}`);
    this.strategy = strategy;
  }

  /**
   * Get current strategy name.
   */
  getStrategyName(): string {
    return this.strategy.name;
  }

  /**
   * Rank a batch of retrieval inputs.
   *
   * @param inputs - raw retrieval results from RetrievalService
   * @returns Ranked output sorted by rankingScore descending
   */
  async rank(inputs: RankingInput[]): Promise<RankingOutput> {
    this.logger.log(`Ranking ${inputs.length} inputs using ${this.strategy.name}`);
    return this.strategy.rank(inputs);
  }

  /**
   * Rank a single retrieval input.
   *
   * @param input - single retrieval result
   * @returns Ranked result
   */
  compute(input: RankingInput): RankedResult {
    return this.strategy.compute(input);
  }
}