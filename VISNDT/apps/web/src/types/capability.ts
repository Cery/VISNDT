/**
 * Capability Discovery types — M28.0 Hybrid Model C public read contract.
 *
 * Domain boundary:
 *   Platform Product            = Capability Authority
 *   SupplierProduct (published) = Supplier Model
 *   Offer                        = Commercial Layer
 *
 * Only PUBLISHED SupplierProducts ever appear (backend enforces the filter).
 */

export interface CapabilityPlatformProduct {
  id: string;
  name: string;
  slug?: string | null;
  categoryId?: string | null;
  status?: string;
}

export interface CapabilityOrganization {
  id: string;
  name: string;
}

export interface CapabilitySupplierProductMedia {
  id: string;
  fileAssetId: string | null;
  mediaType?: string;
  title?: string | null;
}

/** Commercial layer summary — count + price band from ACTIVE offers only. */
export interface CapabilityCommercialSummary {
  offerCount: number;
  activeOfferCount: number;
  priceFrom?: number | null;
  priceTo?: number | null;
  currency?: string | null;
}

/** Technical parameter definition carried by a SupplierProduct override. */
export interface CapabilityParameterDefinition {
  id: string;
  name: string;
  code?: string | null;
  dataType?: string;
  unit?: string | null;
  parameterGroupId?: string | null;
}

/** One technical parameter override on a SupplierProduct (Buyer Comparison source). */
export interface CapabilitySupplierProductParameterValue {
  id: string;
  parameterDefinitionId: string;
  value?: string | null;
  valueNumber?: number | null;
  parameterDefinition?: CapabilityParameterDefinition | null;
}

export interface CapabilitySupplierProduct {
  id: string;
  organizationId: string;
  brand: string;
  series?: string | null;
  modelNumber: string;
  slug?: string | null;
  status?: string;
  description?: string | null;
  technicalDescription?: string | null;
  organization?: CapabilityOrganization | null;
  media?: CapabilitySupplierProductMedia[];
  commercialSummary?: CapabilityCommercialSummary;
  parameterValues?: CapabilitySupplierProductParameterValue[];
}

export interface CapabilityOffer {
  id: string;
  organizationId: string;
  productId?: string | null;
  supplierProductId?: string | null;
  title: string;
  description?: string | null;
  price?: number | null;
  currency?: string | null;
  status?: string;
}

export interface CapabilitySupplierProductWithOffers {
  supplierProduct: CapabilitySupplierProduct;
  offers: CapabilityOffer[];
}

export interface CapabilityDetail {
  platformProduct: CapabilityPlatformProduct;
  supplierProducts: CapabilitySupplierProductWithOffers[];
}