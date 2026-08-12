import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { ParameterDefinition, ParameterOption } from '@/types/product';

/** Parameter definition detail (includes ENUM options) */
export interface ParameterDefinitionDetail extends ParameterDefinition {
  options: ParameterOption[];
}

/**
 * List all parameter definitions (public).
 * GET /parameter-definitions
 */
export async function getParameterDefinitions(
  page = 1,
  pageSize = 100,
): Promise<PaginatedResponse<ParameterDefinition>> {
  const res = await apiClient<ApiResponse<PaginatedResponse<ParameterDefinition>>>(
    '/parameter-definitions',
    { params: { page, pageSize } },
  );
  return res.data;
}

/**
 * Get a single parameter definition with its ENUM options (public).
 * GET /parameter-definitions/:id
 */
export async function getParameterDefinition(
  id: string,
): Promise<ParameterDefinitionDetail> {
  const res = await apiClient<ApiResponse<ParameterDefinitionDetail>>(
    `/parameter-definitions/${id}`,
  );
  return res.data;
}