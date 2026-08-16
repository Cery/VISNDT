// ============================================
// Ranking Contract — M21.4.6 FROZEN
//
// Semantic Ranking Layer defines the contract between
// Retrieval output and Ranked output.
//
// Principles:
//   1. Ranking Layer = Independent (not Retrieval, not Business)
//   2. semanticScore = similarity (base strategy)
//   3. rankingScore = computed score (0-1)
//   4. Original similarity ALWAYS preserved
//   5. RankingStrategy extension point for future algorithms
//
// NOT in contract:
//   - supplierScore, commercialScore, purchaseScore, recommendationScore
//   - User profile ranking
//   - Business weight ranking
//   - Click/Conversion ranking
// ============================================

/**
 * Ranking Input — comes from Retrieval Layer.
 * The Ranking Layer only processes what Retrieval provides.
 * No direct database access, no business model access.
 */
export interface RankingInput {
  /** Entity type (content, product, chunk) */
  entityType: string;
  /** Unique entity identifier */
  entityId: string;
  /** Original cosine similarity [0, 1] from pgvector — ALWAYS PRESERVED */
  similarity: number;
  /** Optional entity metadata from retrieval */
  metadata?: Record<string, unknown>;
}

/**
 * Ranked Result — output of Ranking Layer.
 *
 * FROZEN CONTRACT (M21.4.6):
 *   - similarity: original vector similarity (preserved, never modified)
 *   - semanticScore: normalized semantic relevance (0-1)
 *   - rankingScore: final ranking score (0-1)
 *
 * Future extension:
 *   - scoreBreakdown: RankingFactorBreakdown (M21.4.7+)
 */
export interface RankedResult {
  /** Entity type */
  entityType: string;
  /** Unique entity identifier */
  entityId: string;
  /** Original cosine similarity [0, 1] — ALWAYS PRESERVED, NEVER MODIFIED */
  similarity: number;
  /** Semantic relevance score [0, 1] */
  semanticScore: number;
  /** Final ranking score [0, 1] used for ordering */
  rankingScore: number;
  /** Optional entity metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Ranking Factor Breakdown — future extension (M21.4.7+).
 * Explains WHY a result is ranked at its position.
 * NOT implemented in M21.4.6 (all factors = 0 except similarity).
 */
export interface RankingFactorBreakdown {
  /** Vector similarity contribution (0-1) */
  similarity: number;
  /** Content freshness factor (0-1) — future */
  freshness?: number;
  /** Content authority/quality factor (0-1) — future */
  authority?: number;
  /** Entity popularity factor (0-1) — future */
  popularity?: number;
  /** Custom factor (0-1) — future extension */
  custom?: Record<string, number>;
}

/**
 * Ranking Output — complete ranking result with diagnostics.
 */
export interface RankingOutput {
  /** Ranked results sorted by rankingScore descending */
  results: RankedResult[];
  /** Total number of ranked results */
  total: number;
  /** Ranking strategy used */
  strategy: string;
  /** Ranking execution time in ms */
  executionTimeMs: number;
}

/**
 * Ranking Strategy — extension point for future algorithms.
 *
 * M21.4.6: DefaultStrategy (semanticScore = rankingScore = similarity)
 * Future: CompositeStrategy, WeightedStrategy, etc.
 */
export interface RankingStrategy {
  /** Strategy name for diagnostics */
  readonly name: string;
  /** Compute ranking score for a single input */
  compute(input: RankingInput): RankedResult;
  /** Compute ranking scores for batch inputs */
  rank(inputs: RankingInput[]): Promise<RankingOutput>;
}