/**
 * Organization Service Layer
 *
 * Encapsulates Organization API calls for page-level consumption.
 * Underlying HTTP calls are delegated to lib/api/organizations.ts.
 */
import { getOrganization as fetchOrganization, updateOrganization as apiUpdateOrganization } from '@/lib/api/organizations';
import type { Organization } from '@/types/organization';

/**
 * Get a single organization by ID (public info).
 * GET /organizations/:id
 */
export async function getOrganization(id: string): Promise<Organization> {
  return fetchOrganization(id);
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
  return apiUpdateOrganization(id, data);
}