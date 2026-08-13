import { getParameterGroups as fetchGroups } from '@/lib/api/parameter-groups';
import type { ParameterGroup } from '@/types/product';

/**
 * Load all parameter groups for the product detail page.
 * GET /parameter-groups (public)
 */
export async function getParameterGroups(): Promise<ParameterGroup[]> {
  const res = await fetchGroups(1, 100);
  return res.data ?? [];
}