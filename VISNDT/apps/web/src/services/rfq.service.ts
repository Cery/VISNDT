/**
 * RFQ Service Layer
 */
import {
  getAvailableRfqs as fetchAvailableRfqs,
  getMyRfqs,
  getRfq as fetchRfq,
  getMyRfqResponses as fetchMyRfqResponses,
  deleteRfq as apiDeleteRfq,
  publishRfq as apiPublishRfq,
  closeRfq as apiCloseRfq,
  createRfqResponse as apiCreateRfqResponse,
} from '@/lib/api/rfqs';
import type { PaginatedResponse } from '@/types/api';
import type {
  AvailableRfqItem,
  RfqItem,
  RfqDetailItem,
  RfqResponseItem,
  CreateRfqResponseParams,
} from '@/lib/api/rfqs';

export async function getAvailableRfqs(params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
} = {}): Promise<PaginatedResponse<AvailableRfqItem>> {
  return fetchAvailableRfqs(params);
}

export async function getRfqs(
  page = 1,
  pageSize = 20,
): Promise<PaginatedResponse<RfqItem>> {
  return getMyRfqs(page, pageSize);
}

export async function getRfq(id: string): Promise<RfqDetailItem> {
  return fetchRfq(id);
}

export async function deleteRfq(id: string): Promise<{ id: string }> {
  return apiDeleteRfq(id);
}

export async function publishRfq(id: string): Promise<RfqDetailItem> {
  return apiPublishRfq(id);
}

export async function closeRfq(id: string): Promise<RfqDetailItem> {
  return apiCloseRfq(id);
}

export async function getMyRfqResponses(
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<RfqResponseItem>> {
  return fetchMyRfqResponses(page, pageSize);
}

export async function getRfqResponses(
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<RfqResponseItem>> {
  return getMyRfqResponses(page, pageSize);
}

export async function createRfqResponse(
  rfqId: string,
  params: CreateRfqResponseParams,
): Promise<RfqResponseItem> {
  return apiCreateRfqResponse(rfqId, params);
}
