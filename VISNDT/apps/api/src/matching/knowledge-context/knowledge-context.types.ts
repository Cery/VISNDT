/**
 * KnowledgeContext Types
 *
 * M23.0 Knowledge Context Foundation — Read-side Companion Capability
 *
 * KnowledgeContext is a Runtime Computed Object, NOT a Database Entity.
 * It bridges Matching Results with Knowledge Assets without changing
 * the Matching Engine or Scoring Algorithm.
 *
 * Architectural Constraints:
 * - Knowledge ≠ Score Input
 * - KnowledgeContext ≠ Database Entity
 * - AI ≠ Matching Engine
 */

/** Lightweight reference to a KnowledgeEntry in context */
export interface KnowledgeEntryRef {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
}

/** Domain reference in context */
export interface KnowledgeDomainRef {
  id: string;
  name: string;
  slug: string;
}

/** Category reference in context */
export interface KnowledgeCategoryRef {
  id: string;
  name: string;
  slug: string;
}

/**
 * KnowledgeContext — Runtime Computed Knowledge Context for a DemandMatch
 *
 * Resolved from:
 *   DemandMatch → Product → ProductCategory
 *     → KnowledgeDomain → KnowledgeCategory
 *     → KnowledgeEntry → KnowledgeRelation
 */
export interface KnowledgeContext {
  /** The matched knowledge domain (derived from product category) */
  domain: KnowledgeDomainRef | null;

  /** The matched knowledge category (derived from product category) */
  category: KnowledgeCategoryRef | null;

  /** Knowledge entries directly relevant to the product category */
  relevantEntries: KnowledgeEntryRef[];

  /** Prerequisite knowledge (PREREQUISITE relations from relevant entries) */
  prerequisiteKnowledge: KnowledgeEntryRef[];

  /** Related knowledge (RELATED relations from relevant entries) */
  relatedKnowledge: KnowledgeEntryRef[];

  /** Follow-up / next-step knowledge (FOLLOWUP relations from relevant entries) */
  followupKnowledge: KnowledgeEntryRef[];
}

/** Input for KnowledgeContextAdapter.resolveKnowledgeContext() */
export interface KnowledgeContextInput {
  matchId: string;
}