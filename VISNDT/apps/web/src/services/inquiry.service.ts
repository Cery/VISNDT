/**
 * Inquiry Service Layer
 *
 * Encapsulates inquiry API calls for page-level consumption.
 */
import { createInquiry as postInquiry, getMyInquiries as fetchMyInquiries } from '@/lib/api/inquiries';
import type { CreateInquiryDto, InquiryResponse } from '@/types/inquiry';

/**
 * Submit a product inquiry.
 * POST /inquiries
 */
export async function createInquiry(
  dto: CreateInquiryDto,
): Promise<InquiryResponse> {
  return postInquiry(dto);
}

/**
 * Get my organization inquiries (paginated).
 * GET /inquiries/mine (JWT)
 */
export async function getMyInquiries(
  page = 1,
  pageSize = 20,
): ReturnType<typeof fetchMyInquiries> {
  return fetchMyInquiries(page, pageSize);
}
