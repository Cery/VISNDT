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

/**
 * Update organization information (self-service for members).
 * PATCH /organizations/:id
 * Only allows name, type for non-admin users.
 */
export async function updateOrganization(
  id: string,
  data: { name?: string; type?: string },
): Promise<Organization> {
  const res = await apiClient<ApiResponse<Organization>>(
    `/organizations/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
  return res.data;
}