import { apiClient } from '../api-client';
import type { ApiResponse } from '@/types/api';
import type { CreateInquiryDto, InquiryResponse } from '@/types/inquiry';

/**
 * Submit a product inquiry.
 * POST /inquiries
 */
export async function createInquiry(
  dto: CreateInquiryDto,
): Promise<InquiryResponse> {
  const res = await apiClient<ApiResponse<InquiryResponse>>('/inquiries', {
    method: 'POST',
    body: JSON.stringify(dto),
  });

  return res.data;
}