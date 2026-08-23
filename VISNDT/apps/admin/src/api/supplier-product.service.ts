import { apiClient } from './client';
import type {
  SupplierProduct,
  SupplierProductDetail,
  SupplierProductListResponse,
} from '../types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

/**
 * SupplierProductService — Admin Governance Pool API client (M28.0 Hybrid Model C).
 *
 * Consumes the frozen API contract (660.9):
 *   GET    /admin/supplier-products          Admin Pool list (across organizations)
 *   GET    /admin/supplier-products/:id      Admin Pool detail (incl. capability, media, parameters)
 *   POST   /admin/supplier-products/:id/submit     DRAFT → SUBMITTED
 *   POST   /admin/supplier-products/:id/review     SUBMITTED → REVIEWING
 *   POST   /admin/supplier-products/:id/approve    REVIEWING → APPROVED
 *   POST   /admin/supplier-products/:id/reject     REVIEWING → REJECTED (reviewedNote required)
 *   POST   /admin/supplier-products/:id/publish    APPROVED → PUBLISHED
 *
 * Admin ONLY — no Supplier self-service access.
 */
export const supplierProductService = {
  async getList(
    page = 1,
    pageSize = 20,
    status?: string,
  ): Promise<SupplierProductListResponse> {
    const params: Record<string, string | number> = { page, pageSize };
    if (status) params.status = status;
    const response = (await apiClient.get('/admin/supplier-products', {
      params,
    })) as unknown as ApiResponseWrapper<SupplierProductListResponse>;
    return response.data;
  },

  async getById(id: string): Promise<SupplierProductDetail> {
    const response = (await apiClient.get(
      `/admin/supplier-products/${id}`,
    )) as unknown as ApiResponseWrapper<SupplierProductDetail>;
    return response.data;
  },

  async submit(id: string): Promise<SupplierProduct> {
    const response = (await apiClient.post(
      `/admin/supplier-products/${id}/submit`,
    )) as unknown as ApiResponseWrapper<SupplierProduct>;
    return response.data;
  },

  async beginReview(id: string): Promise<SupplierProduct> {
    const response = (await apiClient.post(
      `/admin/supplier-products/${id}/review`,
    )) as unknown as ApiResponseWrapper<SupplierProduct>;
    return response.data;
  },

  async approve(id: string): Promise<SupplierProduct> {
    const response = (await apiClient.post(
      `/admin/supplier-products/${id}/approve`,
    )) as unknown as ApiResponseWrapper<SupplierProduct>;
    return response.data;
  },

  async reject(id: string, reviewedNote: string): Promise<SupplierProduct> {
    const response = (await apiClient.post(
      `/admin/supplier-products/${id}/reject`,
      { reviewedNote },
    )) as unknown as ApiResponseWrapper<SupplierProduct>;
    return response.data;
  },

  async publish(id: string): Promise<SupplierProduct> {
    const response = (await apiClient.post(
      `/admin/supplier-products/${id}/publish`,
    )) as unknown as ApiResponseWrapper<SupplierProduct>;
    return response.data;
  },
};