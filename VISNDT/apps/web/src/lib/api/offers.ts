import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
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
  const res = await apiClient<ApiResponse<PaginatedResponse<Offer>>>(
    '/offers',
    { params: params as Record<string, string | number | undefined> },
  );
  return res.data;
}