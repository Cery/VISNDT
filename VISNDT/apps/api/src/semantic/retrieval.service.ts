import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// ============================================
// RetrievalService — M21.4.5 Retrieval Enhancement
// Enhanced vector similarity queries using pgvector.
// No ranking, no aggregation, no business rules.
//
// M21.4.5 Additions:
//   - Similarity threshold filtering
//   - Retrieval metadata / diagnostics
//   - Unified entity retrieval abstraction
//   - Query normalization
//   - Result count validation
// ============================================

// ============================================
// Core Interfaces (M21.4.3 — preserved)
// ============================================

export interface SimilarityResult {
  id: string;
  similarity: number; // cosine similarity [0, 1], higher = more similar
}

export interface EmbeddingStats {
  contentEmbeddings: number;
  productEmbeddings: number;
  chunkEmbeddings: number;
}

// ============================================
// M21.4.5 Enhanced Interfaces
// ============================================

/** Retrieval options for enhanced query methods */
export interface RetrievalOptions {
  /** Maximum number of results (1-50, default 10) */
  limit?: number;
  /** Minimum cosine similarity threshold [0, 1]. Results below this are filtered out. */
  threshold?: number;
  /** Include entity metadata in results (title, status, etc.) */
  includeMetadata?: boolean;
}

/** Enhanced retrieval result with optional metadata */
export interface EnhancedRetrievalResult extends SimilarityResult {
  /** Entity metadata (only populated when includeMetadata=true) */
  metadata?: Record<string, unknown>;
}

/** Retrieval execution diagnostics */
export interface RetrievalDiagnostics {
  /** Query execution time in milliseconds */
  executionTimeMs: number;
  /** Total results before threshold filtering */
  totalScanned: number;
  /** Results filtered out by similarity threshold */
  filteredByThreshold: number;
  /** Final results returned */
  resultsReturned: number;
  /** Threshold value applied (0 if none) */
  thresholdApplied: number;
}

/** Combined retrieval response with diagnostics */
export interface RetrievalResponse {
  results: EnhancedRetrievalResult[];
  diagnostics: RetrievalDiagnostics;
}

/** Supported entity types for unified retrieval */
export type RetrievalEntityType = 'content' | 'product' | 'chunk';

/** Default retrieval options */
const DEFAULT_OPTIONS: Required<RetrievalOptions> = {
  limit: 10,
  threshold: 0,
  includeMetadata: false,
};

/** Maximum allowed limit */
const MAX_LIMIT = 50;
/** Minimum allowed limit */
const MIN_LIMIT = 1;

// ============================================
// Query Normalization (M21.4.5)
// ============================================

function normalizeVector(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}

function clampLimit(limit: number): number {
  return Math.max(MIN_LIMIT, Math.min(MAX_LIMIT, Math.floor(limit)));
}

function applyThreshold(
  results: EnhancedRetrievalResult[],
  threshold: number,
): EnhancedRetrievalResult[] {
  if (threshold <= 0) return results;
  return results.filter((r) => r.similarity >= threshold);
}

// ============================================
// RetrievalService (M21.4.5 Enhanced)
// ============================================

@Injectable()
export class RetrievalService {
  private readonly logger = new Logger(RetrievalService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // Embedding Statistics (M21.4.3)
  // ============================================

  async getEmbeddingStats(): Promise<EmbeddingStats> {
    const [contentEmbeddings, productEmbeddings, chunkEmbeddings] = await Promise.all([
      this.prisma.$queryRawUnsafe<{ count: bigint }[]>(
        `SELECT COUNT(*)::int as count FROM content WHERE embedding IS NOT NULL`,
      ).then((r) => Number(r[0].count)),
      this.prisma.$queryRawUnsafe<{ count: bigint }[]>(
        `SELECT COUNT(*)::int as count FROM product WHERE embedding IS NOT NULL`,
      ).then((r) => Number(r[0].count)),
      this.prisma.$queryRawUnsafe<{ count: bigint }[]>(
        `SELECT COUNT(*)::int as count FROM content_chunk WHERE embedding IS NOT NULL`,
      ).then((r) => Number(r[0].count)),
    ]);

    return { contentEmbeddings, productEmbeddings, chunkEmbeddings };
  }

  // ============================================
  // Legacy Methods (M21.4.3 — preserved for backward compatibility)
  // ============================================

  async findSimilarContent(embedding: number[], limit = 10): Promise<SimilarityResult[]> {
    const response = await this.findSimilarContentEnhanced(embedding, { limit });
    return response.results.map(({ id, similarity }) => ({ id, similarity }));
  }

  async findSimilarProducts(embedding: number[], limit = 10): Promise<SimilarityResult[]> {
    const response = await this.findSimilarProductsEnhanced(embedding, { limit });
    return response.results.map(({ id, similarity }) => ({ id, similarity }));
  }

  async findSimilarChunks(embedding: number[], limit = 10): Promise<SimilarityResult[]> {
    const response = await this.findSimilarChunksEnhanced(embedding, { limit });
    return response.results.map(({ id, similarity }) => ({ id, similarity }));
  }

  // ============================================
  // Enhanced Retrieval Methods (M21.4.5)
  // ============================================

  /**
   * Enhanced content retrieval with threshold, metadata, and diagnostics.
   */
  async findSimilarContentEnhanced(
    embedding: number[],
    options: RetrievalOptions = {},
  ): Promise<RetrievalResponse> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const limit = clampLimit(opts.limit);
    const startTime = Date.now();

    const vectorStr = normalizeVector(embedding);

    const results = await this.prisma.$queryRawUnsafe<
      { id: string; similarity: number; title?: string; status?: string }[]
    >(
      `SELECT id, 1 - (embedding <=> $1::vector) AS similarity
       ${
         opts.includeMetadata ? `, title, status` : ''
       }
       FROM content
       WHERE embedding IS NOT NULL
         AND status = 'PUBLISHED'
       ORDER BY embedding <=> $1::vector
       LIMIT $2::int`,
      vectorStr,
      limit,
    );

    const totalScanned = results.length;
    const mapped: EnhancedRetrievalResult[] = results.map((r) => ({
      id: r.id,
      similarity: Number(r.similarity),
      ...(opts.includeMetadata && r.title
        ? { metadata: { title: r.title, status: r.status } as Record<string, unknown> }
        : {}),
    }));

    const filtered = applyThreshold(mapped, opts.threshold);

    const diagnostics: RetrievalDiagnostics = {
      executionTimeMs: Date.now() - startTime,
      totalScanned,
      filteredByThreshold: mapped.length - filtered.length,
      resultsReturned: filtered.length,
      thresholdApplied: opts.threshold,
    };

    return { results: filtered, diagnostics };
  }

  /**
   * Enhanced product retrieval with threshold, metadata, and diagnostics.
   */
  async findSimilarProductsEnhanced(
    embedding: number[],
    options: RetrievalOptions = {},
  ): Promise<RetrievalResponse> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const limit = clampLimit(opts.limit);
    const startTime = Date.now();

    const vectorStr = normalizeVector(embedding);

    const results = await this.prisma.$queryRawUnsafe<
      { id: string; similarity: number; name?: string; status?: string }[]
    >(
      `SELECT id, 1 - (embedding <=> $1::vector) AS similarity
       ${
         opts.includeMetadata ? `, name, status` : ''
       }
       FROM product
       WHERE embedding IS NOT NULL
         AND status != 'ARCHIVED'
       ORDER BY embedding <=> $1::vector
       LIMIT $2::int`,
      vectorStr,
      limit,
    );

    const totalScanned = results.length;
    const mapped: EnhancedRetrievalResult[] = results.map((r) => ({
      id: r.id,
      similarity: Number(r.similarity),
      ...(opts.includeMetadata && r.name
        ? { metadata: { name: r.name, status: r.status } as Record<string, unknown> }
        : {}),
    }));

    const filtered = applyThreshold(mapped, opts.threshold);

    const diagnostics: RetrievalDiagnostics = {
      executionTimeMs: Date.now() - startTime,
      totalScanned,
      filteredByThreshold: mapped.length - filtered.length,
      resultsReturned: filtered.length,
      thresholdApplied: opts.threshold,
    };

    return { results: filtered, diagnostics };
  }

  /**
   * Enhanced chunk retrieval with threshold, metadata, and diagnostics.
   */
  async findSimilarChunksEnhanced(
    embedding: number[],
    options: RetrievalOptions = {},
  ): Promise<RetrievalResponse> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const limit = clampLimit(opts.limit);
    const startTime = Date.now();

    const vectorStr = normalizeVector(embedding);

    const results = await this.prisma.$queryRawUnsafe<
      { id: string; similarity: number; content_id?: string; chunk_index?: number }[]
    >(
      `SELECT id, 1 - (embedding <=> $1::vector) AS similarity
       ${
         opts.includeMetadata ? `, content_id, chunk_index` : ''
       }
       FROM content_chunk
       WHERE embedding IS NOT NULL
       ORDER BY embedding <=> $1::vector
       LIMIT $2::int`,
      vectorStr,
      limit,
    );

    const totalScanned = results.length;
    const mapped: EnhancedRetrievalResult[] = results.map((r) => ({
      id: r.id,
      similarity: Number(r.similarity),
      ...(opts.includeMetadata && r.content_id
        ? {
            metadata: {
              contentId: r.content_id,
              chunkIndex: r.chunk_index,
            } as Record<string, unknown>,
          }
        : {}),
    }));

    const filtered = applyThreshold(mapped, opts.threshold);

    const diagnostics: RetrievalDiagnostics = {
      executionTimeMs: Date.now() - startTime,
      totalScanned,
      filteredByThreshold: mapped.length - filtered.length,
      resultsReturned: filtered.length,
      thresholdApplied: opts.threshold,
    };

    return { results: filtered, diagnostics };
  }

  // ============================================
  // Unified Retrieval (M21.4.5)
  // Entity abstraction for future Ranking Layer
  // ============================================

  /**
   * Unified retrieval — dispatches to entity-specific method based on entityType.
   * Foundation for future Ranking Layer (M21.4.6+) that needs entity-agnostic retrieval.
   *
   * @param embedding - 1536-dim vector
   * @param entityType - content | product | chunk
   * @param options - retrieval options (threshold, limit, metadata)
   */
  async retrieve(
    embedding: number[],
    entityType: RetrievalEntityType,
    options: RetrievalOptions = {},
  ): Promise<RetrievalResponse> {
    this.logger.log(
      `Unified retrieval: type=${entityType}, limit=${options.limit ?? 10}, threshold=${options.threshold ?? 0}`,
    );

    switch (entityType) {
      case 'content':
        return this.findSimilarContentEnhanced(embedding, options);
      case 'product':
        return this.findSimilarProductsEnhanced(embedding, options);
      case 'chunk':
        return this.findSimilarChunksEnhanced(embedding, options);
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }
}