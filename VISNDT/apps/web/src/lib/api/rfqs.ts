import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export interface RfqDemandSummary {
  id: string;
  title: string;
  description?: string | null;
  organizationId: string;
}

export interface RfqItem {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  demandId?: string | null;
  organizationId: string;
  publishedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  demand?: RfqDemandSummary | null;
  createdByUser?: { id: string; name?: string | null; email: string } | null;
}

export type RfqDetailItem = RfqItem;

export interface AvailableRfqItem {
  id: string;
  status: string;
  publishedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  demand: RfqDemandSummary;
}

export interface RfqResponseItem {
  id: string;
  rfqId: string;
  organizationId: string;
  status: string;
  offerId?: string | null;
  message?: string | null;
  decisionNote?: string | null;
  createdAt: string;
  updatedAt: string;
  rfq?: {
    id: string;
    status?: string;
    demand?: {
      id: string;
      title: string;
    } | null;
  } | null;
  organization?: {
    id: string;
    name?: string;
  } | null;
  offer?: {
    id: string;
    organizationId: string;
    productId: string;
    createdBy?: string | null;
    title: string;
    description?: string | null;
    price?: string | number | null;
    currency?: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

/**
 * List available RFQs for supplier to quote.
 * GET /rfqs/available (JWT)
 * Default statuses: OPEN + RESPONDING
 */
export async function getAvailableRfqs(
  params: { page?: number; pageSize?: number; keyword?: string; status?: string } = {},
): Promise<PaginatedResponse<AvailableRfqItem>> {
  const { page = 1, pageSize = 20, keyword, status } = params;
  const res = await apiClient<ApiResponse<PaginatedResponse<AvailableRfqItem>>>(
    '/rfqs/available',
    { params: { page, pageSize, ...(keyword ? { keyword } : {}), ...(status ? { status } : {}) } },
  );
  return res.data;
}

/**
 * Get RFQs published by current buyer organization.
 * GET /rfqs/mine (JWT)
 */
export async function getMyRfqs(
  page = 1,
  pageSize = 20,
): Promise<PaginatedResponse<RfqItem>> {
  const res = await apiClient<ApiResponse<PaginatedResponse<RfqItem>>>(
    '/rfqs/mine',
    { params: { page, pageSize } },
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

export interface CreateRfqParams {
  demandId: string;
}

/**
 * Create a new RFQ from a demand.
 * POST /rfqs (JWT)
 */
export async function createRfq(params: CreateRfqParams): Promise<RfqItem> {
  const res = await apiClient<ApiResponse<RfqItem>>('/rfqs', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.data;
}

/**
 * Update an RFQ.
 * PATCH /rfqs/:id (JWT)
 */
export async function updateRfq(
  id: string,
  params: Partial<CreateRfqParams>,
): Promise<RfqDetailItem> {
  const res = await apiClient<ApiResponse<RfqDetailItem>>(`/rfqs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
  return res.data;
}

/**
 * Delete an RFQ.
 * DELETE /rfqs/:id (JWT)
 */
export async function deleteRfq(id: string): Promise<{ id: string }> {
  const res = await apiClient<ApiResponse<{ id: string }>>(`/rfqs/${id}`, {
    method: 'DELETE',
  });
  return res.data;
}

/**
 * Publish an RFQ (DRAFT → OPEN).
 * POST /rfqs/:id/publish (JWT)
 */
export async function publishRfq(id: string): Promise<RfqDetailItem> {
  const res = await apiClient<ApiResponse<RfqDetailItem>>(
    `/rfqs/${id}/publish`,
    { method: 'POST' },
  );
  return res.data;
}

/**
 * Close an RFQ.
 * POST /rfqs/:id/close (JWT)
 */
export async function closeRfq(id: string): Promise<RfqDetailItem> {
  const res = await apiClient<ApiResponse<RfqDetailItem>>(
    `/rfqs/${id}/close`,
    { method: 'POST' },
  );
  return res.data;
}

/**
 * Get responses for a specific RFQ.
 * GET /rfqs/:id/responses (JWT)
 */
export async function getRfqResponsesById(
  rfqId: string,
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<RfqResponseItem>> {
  const res = await apiClient<ApiResponse<PaginatedResponse<RfqResponseItem>>>(
    `/rfqs/${rfqId}/responses`,
    { params: { page, pageSize } },
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

export interface CreateRfqResponseParams {
  offerId?: string;
  message?: string;
}

/**
 * Create a supplier response to an RFQ.
 * POST /rfqs/:id/responses (JWT)
 */
export async function createRfqResponse(
  rfqId: string,
  params: CreateRfqResponseParams,
): Promise<RfqResponseItem> {
  const res = await apiClient<ApiResponse<RfqResponseItem>>(`/rfqs/${rfqId}/responses`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.data;
}

/**
 * Mark an RFQ response as viewed.
 * POST /rfq-responses/:id/view (JWT)
 */
export async function viewRfqResponse(
  responseId: string,
): Promise<RfqResponseItem> {
  const res = await apiClient<ApiResponse<RfqResponseItem>>(
    `/rfq-responses/${responseId}/view`,
    { method: 'POST' },
  );
  return res.data;
}

/**
 * Accept an RFQ response.
 * POST /rfq-responses/:id/accept (JWT)
 */
export async function acceptRfqResponse(
  responseId: string,
  params: { decisionNote?: string } = {},
): Promise<RfqResponseItem> {
  const res = await apiClient<ApiResponse<RfqResponseItem>>(
    `/rfq-responses/${responseId}/accept`,
    {
      method: 'POST',
      body: JSON.stringify(params),
    },
  );
  return res.data;
}

/**
 * Reject an RFQ response.
 * POST /rfq-responses/:id/reject (JWT)
 */
export async function rejectRfqResponse(
  responseId: string,
  params: { decisionNote?: string } = {},
): Promise<RfqResponseItem> {
  const res = await apiClient<ApiResponse<RfqResponseItem>>(
    `/rfq-responses/${responseId}/reject`,
    {
      method: 'POST',
      body: JSON.stringify(params),
    },
  );
  return res.data;
}
