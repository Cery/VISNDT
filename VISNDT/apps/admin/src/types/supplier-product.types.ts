/**
 * SupplierProduct domain types — M28.0 Hybrid Model C (Admin Governance Pool).
 *
 * Domain boundary (frozen):
 *   Product         = Platform Capability Authority (global, NOT organization-owned)
 *   SupplierProduct = Supplier Owned Model Entity (belongsTo Organization, binds to Platform Product)
 *   Offer           = Commercial Layer
 */

export type SupplierProductStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'REVIEWING'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED';

export interface SupplierProductPlatformProduct {
  id: string;
  name: string;
  slug?: string | null;
  categoryId?: string | null;
  status?: string;
}

export interface SupplierProductOrganization {
  id: string;
  name: string;
  type?: string;
}

export interface SupplierProductMedia {
  id: string;
  fileAssetId?: string | null;
  mediaType?: string;
  title?: string | null;
}

export interface SupplierProductParameterDefinition {
  id: string;
  name: string;
  dataType?: string;
}

export interface SupplierProductParameterValue {
  id?: string;
  parameterDefinitionId: string;
  value?: string | null;
  parameterDefinition?: SupplierProductParameterDefinition;
}

export interface SupplierProduct {
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
  status: SupplierProductStatus;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  reviewedNote?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  // included relations
  platformProduct?: SupplierProductPlatformProduct;
  organization?: SupplierProductOrganization;
  media?: SupplierProductMedia[];
  parameterValues?: SupplierProductParameterValue[];
}

export interface SupplierProductListResponse {
  data: SupplierProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type SupplierProductDetail = SupplierProduct;