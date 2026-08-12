/**
 * RFQ Service Layer
 */
import {
  getAvailableRfqs as fetchAvailableRfqs,
  getMyRfqs,
  getRfq as fetchRfq,
  getRfqResponsesById as fetchRfqResponsesById,
  getMyRfqResponses as fetchMyRfqResponses,
  createRfq as apiCreateRfq,
  deleteRfq as apiDeleteRfq,
  publishRfq as apiPublishRfq,
  closeRfq as apiCloseRfq,
  createRfqResponse as apiCreateRfqResponse,
  viewRfqResponse as apiViewRfqResponse,
  acceptRfqResponse as apiAcceptRfqResponse,
  rejectRfqResponse as apiRejectRfqResponse,
} from '@/lib/api/rfqs';
import type { PaginatedResponse } from '@/types/api';
import type {
  AvailableRfqItem,
  RfqItem,
  RfqDetailItem,
  RfqResponseItem,
  CreateRfqParams,
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

export async function createRfq(params: CreateRfqParams): Promise<RfqItem> {
  return apiCreateRfq(params);
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
  rfqId: string,
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<RfqResponseItem>> {
  return fetchRfqResponsesById(rfqId, page, pageSize);
}

export async function createRfqResponse(
  rfqId: string,
  params: CreateRfqResponseParams,
): Promise<RfqResponseItem> {
  return apiCreateRfqResponse(rfqId, params);
}

export async function viewRfqResponse(
  responseId: string,
): Promise<RfqResponseItem> {
  return apiViewRfqResponse(responseId);
}

export async function acceptRfqResponse(
  responseId: string,
  params: { decisionNote?: string } = {},
): Promise<RfqResponseItem> {
  return apiAcceptRfqResponse(responseId, params);
}

export async function rejectRfqResponse(
  responseId: string,
  params: { decisionNote?: string } = {},
): Promise<RfqResponseItem> {
  return apiRejectRfqResponse(responseId, params);
}
