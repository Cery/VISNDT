import { apiClient } from '../api-client';
import type { ApiResponse } from '@/types/api';

export type WorkspaceStatusCounts = Record<string, number>;

export interface WorkspaceBuyerDemandSummary {
  total: number;
  statusCounts: WorkspaceStatusCounts;
}

export interface WorkspaceBuyerMatchSummary {
  total: number;
  statusCounts: WorkspaceStatusCounts;
}

export interface WorkspaceBuyerRfqSummary {
  total: number;
}

export interface WorkspaceBuyerResponseSummary {
  pendingCount: number;
  acceptedCount: number;
  rejectedCount: number;
}

export interface WorkspaceBuyerNotificationSummary {
  unreadCount: number;
}

export interface WorkspaceBuyerOverview {
  demandSummary: WorkspaceBuyerDemandSummary;
  matchSummary: WorkspaceBuyerMatchSummary;
  rfqSummary: WorkspaceBuyerRfqSummary;
  responseSummary: WorkspaceBuyerResponseSummary;
  notificationSummary: WorkspaceBuyerNotificationSummary;
}

export interface WorkspaceBuyerDemandItem {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  matchCount: number;
  rfqCount: number;
}

export interface WorkspaceBuyerPendingDecisionRfq {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceBuyerPendingDecisionDemand {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceBuyerPendingDecisionSupplierOrganization {
  id: string;
  name: string;
  type: string;
}

export interface WorkspaceBuyerPendingDecisionItem {
  id: string;
  status: string;
  pendingSince: string;
  rfq: WorkspaceBuyerPendingDecisionRfq;
  demand: WorkspaceBuyerPendingDecisionDemand;
  supplierOrganization: WorkspaceBuyerPendingDecisionSupplierOrganization;
}

export interface WorkspaceSupplierRfqSummary {
  total: number;
  statusCounts: WorkspaceStatusCounts;
}

export interface WorkspaceSupplierResponseSummary {
  total: number;
  statusCounts: WorkspaceStatusCounts;
}

export interface WorkspaceSupplierNotificationSummary {
  unreadCount: number;
}

export interface WorkspaceSupplierMatchSummary {
  total: number;
  statusCounts: WorkspaceStatusCounts;
}

export interface WorkspaceSupplierOverview {
  rfqSummary: WorkspaceSupplierRfqSummary;
  responseSummary: WorkspaceSupplierResponseSummary;
  notificationSummary: WorkspaceSupplierNotificationSummary;
  matchSummary: WorkspaceSupplierMatchSummary;
}

export interface WorkspaceSupplierBuyerOrganization {
  id?: string;
  name?: string;
  type?: string;
}

export interface WorkspaceSupplierRfqItem {
  id: string;
  title: string;
  reference: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  buyerOrganization: WorkspaceSupplierBuyerOrganization;
}

export interface WorkspaceSupplierResponseRfq {
  id: string;
  title: string;
  reference: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceSupplierResponseDemand {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceSupplierResponseItem {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  rfq: WorkspaceSupplierResponseRfq;
  demand: WorkspaceSupplierResponseDemand;
  buyerOrganization: WorkspaceSupplierBuyerOrganization;
}

// ── Supplier Runtime ──────────────────────────────────────────────────────
// 661.3 M28.0 — read-only Supplier Capability Operation Boundary.

export interface WorkspaceSupplierCommercialSummary {
  total: number;
  activeCount: number;
  minPrice?: number | null;
  maxPrice?: number | null;
}

export interface WorkspaceSupplierPlatformProduct {
  id: string;
  name: string;
}

export interface WorkspaceSupplierProductItem {
  id: string;
  brand: string;
  series?: string | null;
  modelNumber: string;
  slug?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  platformProduct: WorkspaceSupplierPlatformProduct;
  commercialSummary: WorkspaceSupplierCommercialSummary;
}

export interface WorkspaceSupplierProducts {
  data: WorkspaceSupplierProductItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface WorkspaceSupplierProductsQuery {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: string;
  series?: string;
}

export interface WorkspaceSupplierInquiryItem {
  id: string;
  status?: string | null;
  contactName?: string | null;
  message: string;
  createdAt: string;
}

export interface WorkspaceSupplierInquiryContext {
  supplierProductId: string;
  supplierModelLabel: string;
  status: string;
  platformProductId: string;
  platformProductName: string;
  inquiries: WorkspaceSupplierInquiryItem[];
  total: number;
}

/**
 * Get buyer workspace overview aggregates.
 * GET /workspace/buyer/overview (JWT)
 */
export async function getBuyerWorkspaceOverview(): Promise<WorkspaceBuyerOverview> {
  const res = await apiClient<ApiResponse<WorkspaceBuyerOverview>>('/workspace/buyer/overview');
  return res.data;
}

/**
 * List buyer workspace demands.
 * GET /workspace/buyer/demands (JWT)
 */
export async function getBuyerWorkspaceDemands(): Promise<WorkspaceBuyerDemandItem[]> {
  const res = await apiClient<ApiResponse<WorkspaceBuyerDemandItem[]>>('/workspace/buyer/demands');
  return res.data;
}

/**
 * List buyer pending RFQ response decisions.
 * GET /workspace/buyer/pending-decisions (JWT)
 */
export async function getBuyerPendingDecisions(): Promise<WorkspaceBuyerPendingDecisionItem[]> {
  const res = await apiClient<ApiResponse<WorkspaceBuyerPendingDecisionItem[]>>(
    '/workspace/buyer/pending-decisions',
  );
  return res.data;
}

/**
 * Get supplier workspace overview aggregates.
 * GET /workspace/supplier/overview (JWT)
 */
export async function getSupplierWorkspaceOverview(): Promise<WorkspaceSupplierOverview> {
  const res = await apiClient<ApiResponse<WorkspaceSupplierOverview>>('/workspace/supplier/overview');
  return res.data;
}

/**
 * List supplier workspace targeted RFQs.
 * GET /workspace/supplier/rfqs (JWT)
 */
export async function getSupplierWorkspaceRfqs(): Promise<WorkspaceSupplierRfqItem[]> {
  const res = await apiClient<ApiResponse<WorkspaceSupplierRfqItem[]>>('/workspace/supplier/rfqs');
  return res.data;
}

/**
 * List supplier workspace RFQ responses.
 * GET /workspace/supplier/responses (JWT)
 */
export async function getSupplierWorkspaceResponses(): Promise<WorkspaceSupplierResponseItem[]> {
  const res = await apiClient<ApiResponse<WorkspaceSupplierResponseItem[]>>(
    '/workspace/supplier/responses',
  );
  return res.data;
}

/**
 * Supplier Runtime — SupplierProduct Overview for the current supplier org.
 * GET /workspace/supplier/runtime/products (JWT, SUPPLIER)
 */
export async function getSupplierRuntimeProducts(
  query?: WorkspaceSupplierProductsQuery,
): Promise<WorkspaceSupplierProducts> {
  const res = await apiClient<ApiResponse<WorkspaceSupplierProducts>>(
    '/workspace/supplier/runtime/products',
    { params: query ? { ...query } : undefined },
  );
  return res.data;
}

/**
 * Supplier Runtime — Buyer Inquiry context for a SupplierProduct (read-only).
 * GET /workspace/supplier/runtime/products/:id/inquiry-context (JWT, SUPPLIER)
 */
export async function getSupplierRuntimeInquiryContext(
  supplierProductId: string,
): Promise<WorkspaceSupplierInquiryContext> {
  const res = await apiClient<ApiResponse<WorkspaceSupplierInquiryContext>>(
    `/workspace/supplier/runtime/products/${supplierProductId}/inquiry-context`,
  );
  return res.data;
}
