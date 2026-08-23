import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Supplier Model Facet Search — M28.0 M661.4.
 *
 * Search = Discovery Acceleration Layer (not Business Authority).
 * Only PUBLISHED SupplierProduct is indexed. Results are DTO projections;
 * no raw Prisma entity / DB join is returned.
 *
 * Result item shape:
 *   {
 *     capability: {},
 *     supplierProduct: {},
 *     facetSummary: {},
 *     commercialSummary: {},
 *     inquiryAvailable: true
 *   }
 */

export class SupplierModelSearchCapabilityDTO {
  @ApiProperty({ description: 'Platform Product (Capability Authority) UUID' })
  id: string;

  @ApiProperty({ description: 'Platform Product display name' })
  name: string;

  @ApiPropertyOptional({ description: 'Platform Product slug' })
  slug?: string | null;

  @ApiPropertyOptional({ description: 'ProductCategory UUID the capability belongs to' })
  categoryId?: string | null;
}

export class SupplierModelSearchSupplierProductDTO {
  @ApiProperty({ description: 'SupplierProduct UUID' })
  id: string;

  @ApiProperty({ description: 'Supplier model brand' })
  brand: string;

  @ApiPropertyOptional({ description: 'Supplier model series' })
  series?: string | null;

  @ApiProperty({ description: 'Supplier model number' })
  modelNumber: string;

  @ApiPropertyOptional({ description: 'Supplier model slug' })
  slug?: string | null;

  @ApiProperty({ description: 'SupplierProduct status (always PUBLISHED in search)' })
  status: string;

  @ApiProperty({ description: 'Binding to Platform Product (Capability Authority) UUID' })
  platformProductId: string;
}

export class SupplierModelSearchFacetSummaryDTO {
  @ApiProperty({ description: 'Supplier Product Parameters count contributing to this result' })
  parameterCount: number;

  @ApiPropertyOptional({ description: 'Primary capability name for contextual display' })
  primaryCategoryName?: string | null;
}

export class SupplierModelSearchCommercialSummaryDTO {
  @ApiProperty({ description: 'Total offers scoped to this SupplierProduct' })
  offerCount: number;

  @ApiProperty({ description: 'Active offers (OfferStatus.ACTIVE)' })
  activeOfferCount: number;

  @ApiPropertyOptional({ description: 'Minimum active price' })
  priceFrom?: number | null;

  @ApiPropertyOptional({ description: 'Maximum active price' })
  priceTo?: number | null;

  @ApiPropertyOptional({ description: 'Currency code' })
  currency?: string | null;
}

/**
 * A single result projection for a published supplier model.
 */
export class SupplierModelSearchResultItemDTO {
  @ApiProperty({ type: SupplierModelSearchCapabilityDTO })
  capability: SupplierModelSearchCapabilityDTO;

  @ApiProperty({ type: SupplierModelSearchSupplierProductDTO })
  supplierProduct: SupplierModelSearchSupplierProductDTO;

  @ApiProperty({ type: SupplierModelSearchFacetSummaryDTO })
  facetSummary: SupplierModelSearchFacetSummaryDTO;

  @ApiProperty({ type: SupplierModelSearchCommercialSummaryDTO })
  commercialSummary: SupplierModelSearchCommercialSummaryDTO;

  @ApiProperty({ description: 'Whether a Buyer Inquiry entry is available for this capability' })
  inquiryAvailable: boolean;
}

/** A single aggreggated facet option. */
export class SupplierModelFacetOptionDTO {
  @ApiProperty({ description: 'Option value' })
  value: string;

  @ApiProperty({ description: 'Option display label' })
  label: string;

  @ApiProperty({ description: 'Count of published supplier models matching' })
  count: number;
}

/** A parameter-level facet with aggregated values. */
export class SupplierModelParameterFacetDTO {
  @ApiProperty({ description: 'ParameterDefinition UUID' })
  parameterId: string;

  @ApiProperty({ description: 'Parameter name' })
  parameterName: string;

  @ApiProperty({ description: 'Parameter key/code' })
  parameterKey: string;

  @ApiPropertyOptional({ description: 'Parameter unit' })
  unit?: string | null;

  @ApiProperty({ type: SupplierModelFacetOptionDTO, isArray: true })
  values: SupplierModelFacetOptionDTO[];
}

/** Commercial availability facet groups. */
export class SupplierModelCommercialFacetDTO {
  @ApiProperty({ description: 'Count of published supplier models with >=1 active offer' })
  hasActiveOffer: number;

  @ApiProperty({ description: 'Count of published supplier models (all are inquiry-available by design)' })
  inquiryAvailable: number;
}

/** Facet aggregate response. */
export class SupplierModelFacetDTO {
  @ApiProperty({ type: SupplierModelFacetOptionDTO, isArray: true })
  capabilities: SupplierModelFacetOptionDTO[];

  @ApiProperty({ type: SupplierModelFacetOptionDTO, isArray: true })
  brands: SupplierModelFacetOptionDTO[];

  @ApiProperty({ type: SupplierModelFacetOptionDTO, isArray: true })
  series: SupplierModelFacetOptionDTO[];

  @ApiProperty({ type: SupplierModelParameterFacetDTO, isArray: true })
  parameters: SupplierModelParameterFacetDTO[];

  @ApiProperty({ type: SupplierModelCommercialFacetDTO })
  commercial: SupplierModelCommercialFacetDTO;
}

/** Supplier Model facet search response envelope. */
export class SupplierModelFacetSearchResponseDTO {
  @ApiProperty({ description: 'Original search keyword' })
  query: string;

  @ApiProperty({ type: SupplierModelSearchResultItemDTO, isArray: true })
  items: SupplierModelSearchResultItemDTO[];

  @ApiProperty({ description: 'Total published supplier models matching (before pagination)' })
  total: number;

  @ApiProperty({ type: SupplierModelFacetDTO })
  facets: SupplierModelFacetDTO;
}