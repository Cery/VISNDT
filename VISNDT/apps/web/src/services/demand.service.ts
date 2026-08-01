/**
 * Demand Service Layer
 */
import { getMyDemands, getDemand as fetchDemand, getDemandMatches } from '@/lib/api/demands';
import type { PaginatedResponse } from '@/types/api';
import type { DemandItem, DemandDetailItem } from '@/lib/api/demands';

export async function getDemands(
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<DemandItem>> {
  return getMyDemands(page, pageSize);
}

export async function getDemand(id: string): Promise<DemandDetailItem> {
  return fetchDemand(id);
}

export { getDemandMatches };