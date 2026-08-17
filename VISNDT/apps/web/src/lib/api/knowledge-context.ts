/**
 * Knowledge Context API — Read-side Consumption
 *
 * M23.0 — Consumes GET /matches/:id/knowledge-context
 * Knowledge ≠ Score Input. KnowledgeContext is Runtime Computed Object.
 */

import { apiClient } from '../api-client';
import type { ApiResponse } from '@/types/api';

export interface KnowledgeEntryRef {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
}

export interface KnowledgeDomainRef {
  id: string;
  name: string;
  slug: string;
}

export interface KnowledgeCategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface KnowledgeContext {
  domain: KnowledgeDomainRef | null;
  category: KnowledgeCategoryRef | null;
  relevantEntries: KnowledgeEntryRef[];
  prerequisiteKnowledge: KnowledgeEntryRef[];
  relatedKnowledge: KnowledgeEntryRef[];
  followupKnowledge: KnowledgeEntryRef[];
}

/**
 * Get Knowledge Context for a DemandMatch.
 * GET /matches/:id/knowledge-context (JWT)
 */
export async function getMatchKnowledgeContext(
  matchId: string,
): Promise<KnowledgeContext> {
  const res = await apiClient<ApiResponse<KnowledgeContext>>(
    `/matches/${matchId}/knowledge-context`,
  );
  return res.data;
}