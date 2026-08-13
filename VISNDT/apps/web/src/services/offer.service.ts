/**
 * Offer Service Layer
 *
 * Encapsulates Offer API calls for page-level consumption.
 * Underlying HTTP calls are delegated to lib/api/offers.ts.
 */
import { getOffers as fetchOffers } from '@/lib/api/offers';
import type { PaginatedResponse } from '@/types/api';
import type { Offer } from '@/types/product';

export interface OffersSearchParams {
  organizationId?: string;
  keyword?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

/**
 * List offers with optional filtering.
 * GET /offers
 */
export async function getOffers(
  params: OffersSearchParams = {},
): Promise<PaginatedResponse<Offer>> {
  return fetchOffers(params);
}