export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children?: ProductCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductCategoryDto {
  name: string;
  slug: string;
  parentId?: string;
}

export interface UpdateProductCategoryDto {
  name?: string;
  slug?: string;
  parentId?: string;
}

export interface ProductCategoryListResponse {
  data: ProductCategory[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}