export interface Supplier {
  id: string;
  name: string;
  type: string;
  offersCount: number;
}

export interface SupplierListResponse {
  items: Supplier[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SupplierDetail {
  id: string;
  name: string;
  type: string;
  status: string;
  productCount: number;
  offerCount: number;
  matchCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierProduct {
  id: string;
  name: string;
  model?: string;
  status: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  offerStatus: string;
  offerId: string;
}

export interface SupplierProductListResponse {
  items: SupplierProduct[];
  total: number;
  page: number;
  pageSize: number;
}