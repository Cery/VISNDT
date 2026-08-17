/**
 * Search Analytics Foundation Types — M23.0.3
 *
 * Unified Discovery Observability Layer.
 * Defines contracts for search event capture, result context,
 * interaction events, and analytics context.
 *
 * Architecture:
 *   Search ≠ Ranking Engine
 *   Analytics ≠ Automatic Optimization
 *   AI ≠ Search Decision Maker
 */

// ─── Search Event ────────────────────────────────────────────

/** Source of the search query */
export type SearchSource = 'web' | 'admin' | 'api' | 'public';

/** Context captured when a search is performed */
export interface SearchEventContext {
  sessionId?: string;
  userId?: string;
  organizationId?: string;
}

/** Core search event — captured at query submission */
export interface SearchEvent {
  /** Unique event identifier */
  id: string;
  /** The search query text */
  query: string;
  /** Where the search originated */
  source: SearchSource;
  /** When the search was performed */
  timestamp: Date;
  /** Entity types included in the search (product, knowledge, content, solution, supplier) */
  entityTypes: string[];
  /** Total number of results across all entity types */
  resultCount: number;
  /** Optional session/user context */
  sessionContext?: SearchEventContext;
}

// ─── Search Result Context ───────────────────────────────────

/** Per-entity result context captured after search */
export interface SearchResultContext {
  /** Entity type (product, knowledge, content, solution, supplier) */
  entityType: string;
  /** Entity identifier */
  entityId: string;
  /** Position in the result list (0-based, optional) */
  position?: number;
  /** Source of this result (e.g., 'product_adapter', 'knowledge_adapter') */
  resultSource: string;
  /** Additional view context */
  viewContext?: Record<string, unknown>;
}

// ─── Interaction Event ───────────────────────────────────────

/** Discovery interaction event types */
export type DiscoveryInteractionEventType =
  | 'SEARCH_SUBMITTED'
  | 'RESULT_VIEWED'
  | 'ENTITY_CLICKED'
  | 'DETAIL_OPENED';

/** User interaction event in the discovery flow */
export interface DiscoveryInteractionEvent {
  /** Event type */
  type: DiscoveryInteractionEventType;
  /** Associated search event ID (for correlation) */
  searchEventId?: string;
  /** Entity type involved (if applicable) */
  entityType?: string;
  /** Entity ID involved (if applicable) */
  entityId?: string;
  /** When the interaction occurred */
  timestamp: Date;
  /** Additional event context */
  context?: Record<string, unknown>;
}

// ─── Analytics Context ───────────────────────────────────────

/** Unified analytics context combining search, results, and interactions */
export interface DiscoveryAnalyticsContext {
  /** The originating search event */
  search: SearchEvent;
  /** Result contexts for this search */
  results: SearchResultContext[];
  /** Interactions that occurred during this search session */
  interactions: DiscoveryInteractionEvent[];
}

// ─── Result Count by Entity Type ─────────────────────────────

/** Breakdown of result counts per entity type */
export interface SearchResultCount {
  products: number;
  knowledge: number;
  content: number;
  solutions: number;
  suppliers: number;
}