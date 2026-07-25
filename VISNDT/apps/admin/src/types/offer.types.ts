export type OfferStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

export interface Offer {
  id: string;
  organizationId: string;
  productId: string;
  title: string;
  description?: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;

  organization?: {
    id: string;
    name: string;
    type?: string;
  };

  product?: {
    id: string;
    name: string;
    model?: string;
    status?: string;
  };
}

export interface OfferListResponse {
  data: Offer[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type OfferDetail = Offer;