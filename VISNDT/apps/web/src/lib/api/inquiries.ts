import { apiClient } from '../api-client';
import type { ApiResponse } from '@/types/api';
import type { CreateInquiryDto, InquiryResponse } from '@/types/inquiry';

export interface InquiryItem {
  id: string;
  productId: string;
  productName?: string | null;
  organizationId: string;
  organizationName?: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone?: string | null;
  message: string;
  status: string;
  createdAt: string;
}

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

/**
 * Get my organization inquiries (paginated).
 * GET /inquiries/mine (JWT)
 */
export async function getMyInquiries(
  page = 1,
  pageSize = 20,
): Promise<{ data: InquiryItem[]; total: number; page: number; pageSize: number; totalPages: number }> {
  const res = await apiClient<
    ApiResponse<{
      data: InquiryItem[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    }>
  >('/inquiries/mine', { params: { page, pageSize } });
  return res.data;
}

/**
 * Get a single inquiry by ID (must belong to the user's organization).
 * GET /inquiries/:id (JWT)
 */
export async function getInquiryById(id: string): Promise<InquiryItem> {
  const res = await apiClient<ApiResponse<InquiryItem>>(`/inquiries/${id}`);
  return res.data;
}