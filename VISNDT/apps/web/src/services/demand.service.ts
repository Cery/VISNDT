/**
 * Demand Service Layer
 */
import {
  getMyDemands,
  getDemand as fetchDemand,
  getDemandMatches,
  createDemand as apiCreateDemand,
  updateDemand as apiUpdateDemand,
  deleteDemand as apiDeleteDemand,
  publishDemand as apiPublishDemand,
  closeDemand as apiCloseDemand,
} from '@/lib/api/demands';
import type { PaginatedResponse } from '@/types/api';
import type {
  CreateDemandParams,
  DemandItem,
  DemandDetailItem,
} from '@/lib/api/demands';

export async function getDemands(
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<DemandItem>> {
  return getMyDemands(page, pageSize);
}

export async function getDemand(id: string): Promise<DemandDetailItem> {
  return fetchDemand(id);
}

export async function createDemand(params: CreateDemandParams): Promise<DemandItem> {
  return apiCreateDemand(params);
}

export async function updateDemand(
  id: string,
  params: Partial<CreateDemandParams>,
): Promise<DemandDetailItem> {
  return apiUpdateDemand(id, params);
}

export async function deleteDemand(id: string): Promise<{ id: string }> {
  return apiDeleteDemand(id);
}

export async function publishDemand(id: string): Promise<DemandDetailItem> {
  return apiPublishDemand(id);
}

export async function closeDemand(id: string): Promise<DemandDetailItem> {
  return apiCloseDemand(id);
}

export { getDemandMatches };
