import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export interface RfqItem {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  demandId?: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RfqDetailItem extends RfqItem {
  demand?: { id: string; title: string } | null;
  createdByUser?: { id: string; name?: string | null; email: string } | null;
}

export interface RfqResponseItem {
  id: string;
  rfqId: string;
  organizationId: string;
  status: string;
  offerId?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get RFQs for current supplier organization.
 * GET /rfqs/mine (JWT)
 */
export async function getMyRfqs(): Promise<PaginatedResponse<RfqItem>> {
  const res = await apiClient<ApiResponse<PaginatedResponse<RfqItem>>>(
    '/rfqs/mine',
  );
  return res.data;
}

/**
 * Get a single RFQ by ID.
 * GET /rfqs/:id
 */
export async function getRfq(id: string): Promise<RfqDetailItem> {
  const res = await apiClient<ApiResponse<RfqDetailItem>>(
    `/rfqs/${id}`,
  );
  return res.data;
}

/**
 * Get current organization's RFQ responses.
 * GET /rfq-responses/mine (JWT)
 */
export async function getMyRfqResponses(
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<RfqResponseItem>> {
  const res = await apiClient<ApiResponse<PaginatedResponse<RfqResponseItem>>>(
    '/rfq-responses/mine',
    { params: { page, pageSize } },
  );
  return res.data;
}