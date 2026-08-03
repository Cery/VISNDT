import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export interface DemandItem {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  category?: { id: string; name: string; slug: string } | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DemandDetailItem extends DemandItem {
  parameters?: DemandParameter[];
  parameterValues?: DemandParameter[];
  matchesCount?: number;
}

export interface DemandParameter {
  id: string;
  name: string;
  value: string;
  unit?: string | null;
}

/**
 * Get current user's organization demands.
 * GET /demands/my (JWT)
 */
export async function getMyDemands(
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<DemandItem>> {
  const res = await apiClient<ApiResponse<PaginatedResponse<DemandItem>>>(
    '/demands/my',
    { params: { page, pageSize } },
  );
  return res.data;
}

/**
 * Get a single demand by ID.
 * GET /demands/:id (JWT)
 */
export async function getDemand(id: string): Promise<DemandDetailItem> {
  const res = await apiClient<ApiResponse<DemandDetailItem>>(
    `/demands/${id}`,
  );
  return res.data;
}

export interface CreateDemandParams {
  title: string;
  description?: string;
  budgetRange?: string;
  quantity?: number;
  quantityUnit?: string;
  expectedDeliveryDate?: string;
}

/**
 * Create a new demand.
 * POST /demands (JWT)
 */
export async function createDemand(params: CreateDemandParams): Promise<DemandItem> {
  const res = await apiClient<ApiResponse<DemandItem>>('/demands', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.data;
}

/**
 * Get matches for a specific demand.
 * GET /demands/:id/matches (JWT)
 */
export async function getDemandMatches(
  demandId: string,
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<unknown>> {
  const res = await apiClient<ApiResponse<PaginatedResponse<unknown>>>(
    `/demands/${demandId}/matches`,
    { params: { page, pageSize } },
  );
  return res.data;
}