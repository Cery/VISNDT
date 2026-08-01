import type { ProductCategory } from './category';

/** Product media (image, document, etc.) */
export interface ProductMedia {
  id: string;
  productId: string;
  fileAssetId: string | null;
  mediaType: 'IMAGE' | 'DOCUMENT' | 'CERTIFICATE' | 'OTHER';
  title: string | null;
  description: string | null;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Parameter definition */
export interface ParameterDefinition {
  id: string;
  parameterGroupId: string | null;
  name: string;
  code: string;
  dataType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ENUM';
  unit: string | null;
  required: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Product parameter value */
export interface ProductParameterValue {
  id: string;
  productId: string;
  parameterDefinitionId: string;
  value: string;
  valueNumber: number | null;
  createdAt: string;
  updatedAt: string;
  parameterDefinition: ParameterDefinition;
}

/** Product (list view - includes category) */
export interface Product {
  id: string;
  categoryId: string;
  name: string;
  model: string | null;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory;
}

/** Product detail (includes parameterValues, media, category) */
export interface ProductDetail extends Product {
  parameterValues: ProductParameterValue[];
  media: ProductMedia[];
}

/** Search parameters for GET /products */
export interface ProductSearchParams {
  keyword?: string;
  categoryId?: string;
  status?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  parameterFilters?: {
    parameterDefinitionId: string;
    value?: string;
    valueMin?: number;
    valueMax?: number;
  }[];
}