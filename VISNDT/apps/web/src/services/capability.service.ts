/**
 * Capability Service Layer
 *
 * Public Capability Discovery read — delegates to lib/api/capabilities.ts.
 * Returns ONLY PUBLISHED SupplierProducts as non-commercial model context
 * (P2 frozen: no price / currency / commercialSummary / offer payload).
 */
import { getCapability as fetchCapability } from '@/lib/api/capabilities';
import type { CapabilityDetail } from '@/types/capability';

/**
 * Get the public Capability Detail graph for a Platform Product.
 * GET /capabilities/:id
 */
export async function getCapabilityDetail(
  productId: string,
): Promise<CapabilityDetail> {
  return fetchCapability(productId);
}