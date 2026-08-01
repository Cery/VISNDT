/**
 * RFQ Service Layer
 */
import { getMyRfqs, getRfq as fetchRfq, getMyRfqResponses } from '@/lib/api/rfqs';
import type { PaginatedResponse } from '@/types/api';
import type { RfqItem, RfqDetailItem, RfqResponseItem } from '@/lib/api/rfqs';

export async function getRfqs(): Promise<PaginatedResponse<RfqItem>> {
  return getMyRfqs();
}

export async function getRfq(id: string): Promise<RfqDetailItem> {
  return fetchRfq(id);
}

export async function getRfqResponses(
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<RfqResponseItem>> {
  return getMyRfqResponses(page, pageSize);
}