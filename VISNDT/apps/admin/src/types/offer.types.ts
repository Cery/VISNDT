export type OfferStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface Offer {
  id: string;
  organizationId: string;
  productId: string;
  supplierProductId?: string | null;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
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

  /** Capability Model (SupplierProduct) binding — M30.5 projection extension. */
  supplierProduct?: {
    id: string;
    brand: string;
    series?: string | null;
    modelNumber: string;
    status?: string | null;
    platformProduct?: { id: string; name?: string | null } | null;
    organization?: { id: string; name?: string | null } | null;
  } | null;

  createdByUser?: {
    id: string;
    email: string;
    name?: string | null;
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