import { apiClient } from '../api-client';
import type { ApiResponse } from '@/types/api';
import type { CapabilityDetail } from '@/types/capability';

/**
 * Get the public Capability Detail graph for a Platform Product (Capability Authority).
 * GET /capabilities/:id
 *
 * Returns Capability → Published SupplierProducts → (per-supplier) Offers.
 * Backend enforces SupplierProduct.status = PUBLISHED; DRAFT/SUBMITTED/REVIEWING/
 * APPROVED/REJECTED never reach the public boundary.
 */
export async function getCapability(productId: string): Promise<CapabilityDetail> {
  const res = await apiClient<ApiResponse<CapabilityDetail>>(
    `/capabilities/${productId}`,
  );
  return res.data;
}