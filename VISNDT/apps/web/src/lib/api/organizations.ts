import { apiClient } from '../api-client';
import type { ApiResponse } from '@/types/api';
import type { Organization } from '@/types/organization';

/**
 * Get public organization information.
 * GET /organizations/:id
 */
export async function getOrganization(id: string): Promise<Organization> {
  const res = await apiClient<ApiResponse<Organization>>(
    `/organizations/${id}`,
  );
  return res.data;
}