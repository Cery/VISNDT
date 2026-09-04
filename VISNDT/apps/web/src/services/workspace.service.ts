/**
 * Workspace Service Layer
 */
import {
  getBuyerWorkspaceOverview as fetchBuyerWorkspaceOverview,
  getBuyerWorkspaceDemands as fetchBuyerWorkspaceDemands,
  getBuyerPendingDecisions as fetchBuyerPendingDecisions,
  getSupplierWorkspaceOverview as fetchSupplierWorkspaceOverview,
  getSupplierWorkspaceRfqs as fetchSupplierWorkspaceRfqs,
  getSupplierWorkspaceResponses as fetchSupplierWorkspaceResponses,
  getSupplierRuntimeProducts as fetchSupplierRuntimeProducts,
  getSupplierRuntimeInquiryContext as fetchSupplierRuntimeInquiryContext,
  attachSupplierProduct as fetchAttachSupplierProduct,
} from '@/lib/api/workspace';
import type {
  WorkspaceBuyerDemandItem,
  WorkspaceBuyerOverview,
  WorkspaceBuyerPendingDecisionItem,
  WorkspaceSupplierOverview,
  WorkspaceSupplierResponseItem,
  WorkspaceSupplierRfqItem,
  WorkspaceSupplierProducts,
  WorkspaceSupplierProductsQuery,
  WorkspaceSupplierInquiryContext,
  WorkspaceSupplierAttachResult,
} from '@/lib/api/workspace';

export async function getBuyerWorkspaceOverview(): Promise<WorkspaceBuyerOverview> {
  return fetchBuyerWorkspaceOverview();
}

export async function getBuyerWorkspaceDemands(): Promise<WorkspaceBuyerDemandItem[]> {
  return fetchBuyerWorkspaceDemands();
}

export async function getBuyerPendingDecisions(): Promise<WorkspaceBuyerPendingDecisionItem[]> {
  return fetchBuyerPendingDecisions();
}

export async function getSupplierWorkspaceOverview(): Promise<WorkspaceSupplierOverview> {
  return fetchSupplierWorkspaceOverview();
}

export async function getSupplierWorkspaceRfqs(): Promise<WorkspaceSupplierRfqItem[]> {
  return fetchSupplierWorkspaceRfqs();
}

export async function getSupplierWorkspaceResponses(): Promise<WorkspaceSupplierResponseItem[]> {
  return fetchSupplierWorkspaceResponses();
}

export async function getSupplierRuntimeProducts(
  query?: WorkspaceSupplierProductsQuery,
): Promise<WorkspaceSupplierProducts> {
  return fetchSupplierRuntimeProducts(query);
}

export async function getSupplierRuntimeInquiryContext(
  supplierProductId: string,
): Promise<WorkspaceSupplierInquiryContext> {
  return fetchSupplierRuntimeInquiryContext(supplierProductId);
}

export async function attachSupplierProduct(
  platformProductId: string,
): Promise<WorkspaceSupplierAttachResult> {
  return fetchAttachSupplierProduct(platformProductId);
}
