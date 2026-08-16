/**
 * Knowledge Context Interface — M21.7.7 AI Knowledge Context Foundation
 *
 * Defines the knowledge context contract for future Knowledge Base integration.
 * No real knowledge access in current phase. Foundation contract only.
 */

import { AIContext } from './ai-context.interface';

// ============================================
// Knowledge Context
// ============================================

export interface KnowledgeContext extends AIContext {
  type: 'KNOWLEDGE';
  /** Knowledge domain */
  knowledgeDomain: KnowledgeDomain;
  /** Knowledge query */
  query: KnowledgeQuery;
  /** Knowledge source scope */
  sourceScope: KnowledgeSourceScope;
  /** Knowledge response (populated after retrieval) */
  response?: KnowledgeResponse;
}

export type KnowledgeDomain =
  | 'PRODUCT'       // Product knowledge
  | 'CONTENT'       // Content knowledge
  | 'TECHNICAL'     // Technical documentation
  | 'INSPECTION';   // Inspection guides

export type KnowledgeSourceScope =
  | 'INTERNAL'      // Internal knowledge base
  | 'ALL';          // All available sources

// ============================================
// Knowledge Query
// ============================================

export interface KnowledgeQuery {
  /** Natural language query */
  text: string;
  /** Query language */
  language?: string;
  /** Maximum results */
  maxResults?: number;
  /** Minimum relevance threshold */
  threshold?: number;
  /** Query filters */
  filters?: KnowledgeQueryFilter[];
}

export interface KnowledgeQueryFilter {
  /** Filter field */
  field: string;
  /** Filter operator */
  operator: 'EQUALS' | 'CONTAINS' | 'RANGE' | 'IN';
  /** Filter value */
  value: unknown;
}

// ============================================
// Knowledge Response
// ============================================

export interface KnowledgeResponse {
  /** Response status */
  status: 'AVAILABLE' | 'DEFERRED' | 'ERROR';
  /** Knowledge items */
  items: KnowledgeItem[];
  /** Total results */
  total: number;
  /** Response timestamp */
  respondedAt: string;
  /** Human review is ALWAYS required */
  requiresHumanReview: true;
}

export interface KnowledgeItem {
  /** Item ID */
  id: string;
  /** Source type */
  sourceType: KnowledgeDomain;
  /** Source ID */
  sourceId: string;
  /** Item title */
  title: string;
  /** Item content/snippet */
  snippet: string;
  /** Relevance score */
  relevanceScore: number;
  /** Item metadata */
  metadata?: Record<string, unknown>;
}