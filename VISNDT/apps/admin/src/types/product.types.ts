export interface Product {
  id: string;
  categoryId: string;
  name: string;
  model?: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdBy?: {
    id: string;
    name?: string | null;
    email: string;
    organization?: {
      id: string;
      name: string;
    } | null;
  } | null;
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductParameterValue {
  id: string;
  productId: string;
  parameterDefinitionId: string;
  value?: string;
  valueNumber?: number;
  parameterDefinition: {
    id: string;
    name: string;
    code: string;
    dataType: string;
    unit?: string;
  };
}

export interface ProductMedia {
  id: string;
  productId: string;
  mediaType: string;
  title?: string;
  url?: string;
}

export interface ProductDetail extends Product {
  parameterValues?: ProductParameterValue[];
  media?: ProductMedia[];
}

export interface ProductFormData {
  name: string;
  model?: string;
  description?: string;
  categoryId: string;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
}

export interface SearchProductParams {
  keyword?: string;
  categoryId?: string;
  status?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}