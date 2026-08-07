/**
 * RFQ Service Layer
 */
import { getMyRfqs, getRfq as fetchRfq, getMyRfqResponses, deleteRfq as apiDeleteRfq, publishRfq as apiPublishRfq, closeRfq as apiCloseRfq } from '@/lib/api/rfqs';
import type { PaginatedResponse } from '@/types/api';
import type { RfqItem, RfqDetailItem, RfqResponseItem } from '@/lib/api/rfqs';

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

export async function getRfqResponses(
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<RfqResponseItem>> {
  return getMyRfqResponses(page, pageSize);
}