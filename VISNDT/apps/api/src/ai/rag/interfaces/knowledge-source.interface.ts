/**
 * Knowledge Source Interface — M21.7.6 AI RAG Foundation
 *
 * Defines the knowledge source registry for RAG.
 * All sources are PLANNED. No real data access.
 */

// ============================================
// Knowledge Source
// ============================================

export interface KnowledgeSource {
  /** Unique source ID */
  id: string;
  /** Human-readable source name */
  name: string;
  /** Source type */
  type: KnowledgeSourceType;
  /** Source description */
  description: string;
  /** Whether this source can modify business state */
  mutationAllowed: false;
  /** Source status */
  status: KnowledgeSourceStatus;
  /** Source metadata */
  metadata?: {
    /** Estimated document count */
    estimatedDocumentCount?: number;
    /** Last updated timestamp */
    lastUpdated?: string;
    /** Source owner */
    owner?: string;
  };
}

export type KnowledgeSourceStatus =
  | 'PLANNED'      // Planned for future implementation
  | 'AVAILABLE'    // Ready for use
  | 'DEPRECATED';  // Deprecated

// ============================================
// Knowledge Source Registry
// ============================================

export interface KnowledgeSourceRegistry {
  /** All registered sources */
  sources: Map<string, KnowledgeSource>;
  /** Register a knowledge source */
  register(source: KnowledgeSource): void;
  /** Get a source by ID */
  get(id: string): KnowledgeSource | undefined;
  /** List all sources */
  list(): KnowledgeSource[];
  /** List sources by type */
  listByType(type: KnowledgeSourceType): KnowledgeSource[];
  /** Validate a source for retrieval */
  validate(id: string): KnowledgeSourceValidationResult;
  /** Get registry status */
  getStatus(): KnowledgeSourceRegistryStatus;
}

export interface KnowledgeSourceValidationResult {
  /** Whether the source is valid */
  valid: boolean;
  /** Source ID */
  sourceId: string;
  /** Source status */
  status: KnowledgeSourceStatus;
  /** Whether the source is available for retrieval */
  available: boolean;
  /** Reason for unavailability */
  reason?: string;
}

export interface KnowledgeSourceRegistryStatus {
  total: number;
  planned: number;
  available: number;
  byType: Record<KnowledgeSourceType, number>;
}

// Re-export KnowledgeSourceType from retrieval-contract
import type { KnowledgeSourceType } from './retrieval-contract.interface';
export type { KnowledgeSourceType };