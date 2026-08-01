/**
 * Inquiry Service Layer
 *
 * Encapsulates POST /inquiries API call for page-level consumption.
 */
import { createInquiry as postInquiry } from '@/lib/api/inquiries';
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