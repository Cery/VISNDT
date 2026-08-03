export type InquiryStatus = 'NEW' | 'PROCESSING' | 'REPLIED' | 'CLOSED';

export interface Inquiry {
  id: string;
  productId: string | null;
  product: { id: string; name: string } | null;
  organizationId: string | null;
  organization: { id: string; name: string } | null;
  createdById: string | null;
  createdBy: { id: string; email: string; name: string | null } | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryListResponse {
  data: Inquiry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}