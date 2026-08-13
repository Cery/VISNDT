import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { ParameterGroup } from '@/types/product';

/**
 * List all parameter groups (public).
 * GET /parameter-groups
 */
export async function getParameterGroups(
  page = 1,
  pageSize = 100,
): Promise<PaginatedResponse<ParameterGroup>> {
  const res = await apiClient<ApiResponse<PaginatedResponse<ParameterGroup>>>(
    '/parameter-groups',
    { params: { page, pageSize } },
  );
  return res.data;
}