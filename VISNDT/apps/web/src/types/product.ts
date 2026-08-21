import type { ProductCategory } from './category';
import type { Organization } from './organization';

/** Product media (image, document, spec sheet, illustration, certificate, etc.) */
export interface ProductMedia {
  id: string;
  productId: string;
  fileAssetId: string | null;
  mediaType:
    | 'IMAGE'
    | 'DOCUMENT'
    | 'CERTIFICATE'
    | 'SPEC_SHEET'
    | 'ILLUSTRATION'
    | 'OTHER';
  title: string | null;
  description: string | null;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Parameter group (for grouping parameter definitions) */
export interface ParameterGroup {
  id: string;
  name: string;
  code: string;
  description: string | null;
}

/** Parameter option (for ENUM parameter definitions) */
export interface ParameterOption {
  id: string;
  parameterDefinitionId: string;
  value: string;
  label: string;
  sortOrder: number;
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
  /** ENUM 选项（详情接口返回，用于动态参数筛选面板） */
  options?: ParameterOption[];
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

/** Primary media for a product list card (single IMAGE, M24.2.4) */
export interface ProductPrimaryMedia {
  id: string;
  fileAssetId: string | null;
  mediaType:
    | 'IMAGE'
    | 'DOCUMENT'
    | 'CERTIFICATE'
    | 'SPEC_SHEET'
    | 'ILLUSTRATION'
    | 'OTHER';
  title: string | null;
  isPrimary: boolean;
  displayOrder: number;
}

/** Key parameter summary for a product list card (≤3 items, M24.2.4) */
export interface ProductKeyParameter {
  parameterDefinitionId: string;
  name: string;
  code: string;
  dataType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ENUM';
  unit: string | null;
  value: string;
  valueNumber: number | null;
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
  /** 列表主图（单一 IMAGE，含 fileAssetId，用于 Capability Discovery Card） */
  primaryMedia?: ProductPrimaryMedia | null;
  /** 列表关键参数摘要（≤3 条，确定性排序） */
  keyParameters?: ProductKeyParameter[];
}

/** Product detail (includes parameterValues, media, category) */
export interface ProductDetail extends Product {
  parameterValues: ProductParameterValue[];
  media: ProductMedia[];
  offers: Offer[];
  createdBy?: {
    id: string;
    organization: Organization | null;
  } | null;
}

/** Offer (公开询价链路：产品详情页据其推导询价对象) */
export interface Offer {
  id: string;
  organizationId: string;
  productId: string;
  title: string;
  description: string | null;
  price: string | null;
  currency: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  organization: Organization;
}

/** Single parameter filter for GET /products (exact value OR numeric range, mutually exclusive) */
export interface ProductParameterFilter {
  parameterDefinitionId: string;
  value?: string;
  valueMin?: number;
  valueMax?: number;
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
  parameterFilters?: ProductParameterFilter[];
}