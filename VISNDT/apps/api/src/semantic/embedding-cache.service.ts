import { Injectable, Logger } from '@nestjs/common';

// ============================================
// EmbeddingCacheService — M21.4.3 Foundation
// In-memory cache for query embeddings.
// Future: Redis or dedicated cache layer (M21.5+)
// ============================================

interface CacheEntry {
  embedding: number[];
  createdAt: number;
}

@Injectable()
export class EmbeddingCacheService {
  private readonly logger = new Logger(EmbeddingCacheService.name);
  private readonly cache = new Map<string, CacheEntry>();
  private readonly maxSize = 500;
  private readonly ttlMs = 30 * 60 * 1000; // 30 minutes

  /**
   * Check if the cache service is available.
   */
  isAvailable(): boolean {
    return true; // In-memory cache is always available
  }

  /**
   * Get a cached embedding by query text.
   * Returns null if not found or expired.
   */
  get(query: string): number[] | null {
    const entry = this.cache.get(query);
    if (!entry) return null;

    if (Date.now() - entry.createdAt > this.ttlMs) {
      this.cache.delete(query);
      return null;
    }

    return entry.embedding;
  }

  /**
   * Store an embedding for a query text.
   * Evicts oldest entries if cache exceeds maxSize.
   */
  set(query: string, embedding: number[]): void {
    if (this.cache.size >= this.maxSize) {
      // Evict oldest entry (first key in Map iteration order)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(query, {
      embedding,
      createdAt: Date.now(),
    });
  }

  /**
   * Clear all cached embeddings.
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.logger.log(`Cleared ${size} cached query embeddings`);
  }

  /**
   * Get current cache statistics.
   */
  getStats(): { size: number; maxSize: number; ttlMs: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttlMs: this.ttlMs,
    };
  }
}