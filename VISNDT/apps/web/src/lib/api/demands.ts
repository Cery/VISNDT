import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export interface DemandItem {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  budgetRange?: string | null;
  quantity?: number | null;
  quantityUnit?: string | null;
  expectedDeliveryDate?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  contactVisible?: boolean | null;
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

export type ParameterDataType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ENUM';

export interface DemandParameterOption {
  id: string;
  parameterDefinitionId: string;
  value: string;
  label: string;
  sortOrder: number;
}

export interface DemandParameterDefinition {
  id: string;
  name: string;
  code: string;
  dataType: ParameterDataType;
  unit?: string | null;
  required: boolean;
  parameterGroupId?: string | null;
  group?: {
    id: string;
    name: string;
    code?: string | null;
  } | null;
  options?: DemandParameterOption[];
}

export interface DemandParameter {
  id: string;
  demandId: string;
  parameterDefinitionId: string;
  value?: string | null;
  valueMin?: number | null;
  valueMax?: number | null;
  required: boolean;
  priority: number;
  parameterDefinition: DemandParameterDefinition;
}

export interface UpsertDemandParameterParams {
  parameterDefinitionId: string;
  value?: string;
  valueMin?: number;
  valueMax?: number;
  required?: boolean;
  priority?: number;
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
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactVisible?: boolean;
  categoryId?: string;
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
 * Update a demand.
 * PATCH /demands/:id (JWT)
 */
export async function updateDemand(
  id: string,
  params: Partial<CreateDemandParams>,
): Promise<DemandDetailItem> {
  const res = await apiClient<ApiResponse<DemandDetailItem>>(`/demands/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
  return res.data;
}

/**
 * Delete a demand.
 * DELETE /demands/:id (JWT)
 */
export async function deleteDemand(id: string): Promise<{ id: string }> {
  const res = await apiClient<ApiResponse<{ id: string }>>(`/demands/${id}`, {
    method: 'DELETE',
  });
  return res.data;
}

/**
 * Publish a demand (DRAFT → PUBLISHED).
 * POST /demands/:id/publish (JWT)
 */
export async function publishDemand(id: string): Promise<DemandDetailItem> {
  const res = await apiClient<ApiResponse<DemandDetailItem>>(
    `/demands/${id}/publish`,
    { method: 'POST' },
  );
  return res.data;
}

/**
 * Close a demand (PUBLISHED/PROCESSING → CLOSED).
 * POST /demands/:id/close (JWT)
 */
export async function closeDemand(id: string): Promise<DemandDetailItem> {
  const res = await apiClient<ApiResponse<DemandDetailItem>>(
    `/demands/${id}/close`,
    { method: 'POST' },
  );
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

/**
 * Get a single match detail by demand + match id.
 * GET /demands/:id/matches/:matchId (JWT)
 */
export async function getDemandMatchDetail(
  demandId: string,
  matchId: string,
): Promise<unknown> {
  const res = await apiClient<ApiResponse<unknown>>(
    `/demands/${demandId}/matches/${matchId}`,
  );
  return res.data;
}

/**
 * Get parameters for a demand.
 * GET /demands/:id/parameters (JWT)
 */
export async function getDemandParameters(
  demandId: string,
): Promise<DemandParameter[]> {
  const res = await apiClient<ApiResponse<DemandParameter[]>>(
    `/demands/${demandId}/parameters`,
  );
  return res.data;
}

/**
 * Add a demand parameter.
 * POST /demands/:id/parameters (JWT)
 */
export async function addDemandParameter(
  demandId: string,
  params: UpsertDemandParameterParams,
): Promise<DemandParameter> {
  const res = await apiClient<ApiResponse<DemandParameter>>(
    `/demands/${demandId}/parameters`,
    {
      method: 'POST',
      body: JSON.stringify(params),
    },
  );
  return res.data;
}

/**
 * Update a demand parameter.
 * PATCH /demands/:id/parameters/:paramId (JWT)
 */
export async function updateDemandParameter(
  demandId: string,
  paramId: string,
  params: Partial<UpsertDemandParameterParams>,
): Promise<DemandParameter> {
  const res = await apiClient<ApiResponse<DemandParameter>>(
    `/demands/${demandId}/parameters/${paramId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(params),
    },
  );
  return res.data;
}

/**
 * Delete a demand parameter.
 * DELETE /demands/:id/parameters/:paramId (JWT)
 */
export async function deleteDemandParameter(
  demandId: string,
  paramId: string,
): Promise<{ deleted: boolean }> {
  const res = await apiClient<ApiResponse<{ deleted: boolean }>>(
    `/demands/${demandId}/parameters/${paramId}`,
    { method: 'DELETE' },
  );
  return res.data;
}

/**
 * Update match status.
 * PATCH /demands/:id/matches/:matchId (JWT)
 */
export async function updateMatchStatus(
  demandId: string,
  matchId: string,
  status: string,
): Promise<unknown> {
  const res = await apiClient<ApiResponse<unknown>>(
    `/demands/${demandId}/matches/${matchId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    },
  );
  return res.data;
}

/**
 * Re-match a demand.
 * POST /demands/:id/rematch (JWT)
 */
export async function rematchDemand(
  demandId: string,
): Promise<unknown> {
  const res = await apiClient<ApiResponse<unknown>>(
    `/demands/${demandId}/rematch`,
    { method: 'POST' },
  );
  return res.data;
}
