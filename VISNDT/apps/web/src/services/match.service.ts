/**
 * Match Service Layer
 */
import { getDemandMatches } from '@/lib/api/demands';
import { getDemands } from '@/services/demand.service';
import type { PaginatedResponse } from '@/types/api';

export interface MatchItem {
  id: string;
  demandId: string;
  demandTitle?: string;
  productId?: string | null;
  organizationId?: string | null;
  status: string;
  score?: number | null;
  createdAt: string;
  updatedAt: string;
}

export async function getMatches(
  demandId: string,
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<MatchItem>> {
  return getDemandMatches(demandId, page, pageSize) as Promise<PaginatedResponse<MatchItem>>;
}

/**
 * Aggregate matches across all current user demands.
 * Fetches demands → fetches matches for each → flattens.
 */
export async function getAllMatches(): Promise<MatchItem[]> {
  const demandsRes = await getDemands(1, 50);
  const demands = demandsRes.data || [];

  const matchResults = await Promise.allSettled(
    demands.map((d) => getDemandMatches(d.id, 1, 50)),
  );

  const allMatches: MatchItem[] = [];
  matchResults.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const data = (result.value.data || []) as MatchItem[];
      data.forEach((m) => {
        allMatches.push({ ...m, demandTitle: demands[index].title });
      });
    }
  });

  return allMatches.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}