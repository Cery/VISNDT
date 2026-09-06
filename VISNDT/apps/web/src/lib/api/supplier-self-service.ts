import { apiClient } from '../api-client';
import type { ApiResponse } from '@/types/api';

/**
 * 820 Supplier Self-Service (SupplierProduct) API bindings.
 * Backed by GET/POST/PATCH /supplier-products/my* — every call is org-scoped
 * server-side to the authenticated supplier organization.
 */

export interface MySupplierProductMedia {
  id: string;
  fileAssetId: string | null;
  mediaType?: string;
  documentType?: string | null;
  title?: string | null;
  altText?: string | null;
  isPrimary: boolean;
  displayOrder: number;
}

export interface MySupplierProductParameterDefinition {
  id: string;
  name: string;
  code?: string | null;
  dataType?: string;
  unit?: string | null;
  parameterGroupId?: string | null;
}

export interface MySupplierProductParameterValue {
  id: string;
  parameterDefinitionId: string;
  value: string | null;
  valueNumber?: number | null;
  parameterDefinition?: MySupplierProductParameterDefinition | null;
}

export interface MySupplierProduct {
  id: string;
  organizationId: string;
  platformProductId: string;
  brand: string;
  series?: string | null;
  modelNumber: string;
  slug?: string | null;
  description?: string | null;
  technicalDescription?: string | null;
  applicationInfo?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  /** 820 computed flag — true when the row still carries platform-derived seed placeholders (not a real supplier model). */
  isPlaceholder?: boolean;
  platformProduct?: {
    id: string;
    name: string;
    slug?: string | null;
  } | null;
  organization?: { id: string; name: string } | null;
  /** SupplierProduct 归属的型号级媒体（getMySupplierProduct 返回；顺序遵循 isPrimary / displayOrder）。 */
  media?: MySupplierProductMedia[] | null;
  /** 型号级技术参数覆盖（parameterDefinition 联动平台参数定义）。 */
  parameterValues?: MySupplierProductParameterValue[] | null;
}

export interface MySupplierProducts {
  data: MySupplierProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MySupplierProductsQuery {
  keyword?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateMySupplierProductPayload {
  platformProductId: string;
  brand: string;
  series?: string | null;
  modelNumber: string;
  description?: string | null;
  technicalDescription?: string | null;
  applicationInfo?: string | null;
}

export interface UpdateMySupplierProductPayload {
  brand?: string;
  series?: string | null;
  modelNumber?: string;
  description?: string | null;
  technicalDescription?: string | null;
  applicationInfo?: string | null;
}

/** List my organization SupplierProducts (org-scoped, keyword/status/pagination). */
export async function getMySupplierProducts(
  query?: MySupplierProductsQuery,
): Promise<MySupplierProducts> {
  const params = new URLSearchParams();
  if (query?.keyword) params.set('keyword', query.keyword);
  if (query?.status) params.set('status', query.status);
  if (query?.page) params.set('page', String(query.page));
  if (query?.pageSize) params.set('pageSize', String(query.pageSize));
  const qs = params.toString();
  const res = await apiClient<ApiResponse<MySupplierProducts>>(
    `/supplier-products/my${qs ? '?' + qs : ''}`,
  );
  return res.data;
}

/** Read one of my organization SupplierProducts. */
export async function getMySupplierProduct(id: string): Promise<MySupplierProduct> {
  const res = await apiClient<ApiResponse<MySupplierProduct>>(`/supplier-products/my/${id}`);
  return res.data;
}

/** Create an own SupplierProduct DRAFT (server-derived organizationId). */
export async function createMySupplierProduct(
  payload: CreateMySupplierProductPayload,
): Promise<MySupplierProduct> {
  const res = await apiClient<ApiResponse<MySupplierProduct>>('/supplier-products/my', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

/** Edit an own SupplierProduct (org-scoped). */
export async function updateMySupplierProduct(
  id: string,
  payload: UpdateMySupplierProductPayload,
): Promise<MySupplierProduct> {
  const res = await apiClient<ApiResponse<MySupplierProduct>>(`/supplier-products/my/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return res.data;
}

/** 821 — submit an own SupplierProduct for admin review (DRAFT → SUBMITTED, org-scoped). */
export async function submitMySupplierProduct(id: string): Promise<MySupplierProduct> {
  const res = await apiClient<ApiResponse<MySupplierProduct>>(
    `/supplier-products/my/${id}/submit`,
    { method: 'POST' },
  );
  return res.data;
}