import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Supplier Runtime — Commercial Summary (read-only).
 *
 * Offer = Commercial Layer. This is the ONLY commercial shape the Supplier
 * Runtime exposes for a SupplierProduct. It is an aggregated summary and MUST
 * NOT expose the full commercial data set (no per-offer detail / pricing /
 * counterparty) in the runtime workspace.
 */
export class WorkspaceSupplierProductCommercialSummaryDto {
  @ApiProperty({ description: 'Total offers scoped to the supplier organization and this SupplierProduct' })
  total: number;

  @ApiProperty({ description: 'Active offers (OfferStatus.ACTIVE) scoped to this SupplierProduct' })
  activeCount: number;

  @ApiPropertyOptional({ description: 'Minimum published commercial price across all associated offers' })
  minPrice?: number | null;

  @ApiPropertyOptional({ description: 'Maximum published commercial price across all associated offers' })
  maxPrice?: number | null;
}

/**
 * Supplier Runtime — Capability Authority context.
 * The bound Platform Product is the Capability Authority; the SupplierProduct is
 * a Supplier Owned Model Entity anchored on it. Never rendered as catalog ownership.
 */
export class WorkspaceSupplierProductPlatformProductDto {
  @ApiProperty({ description: 'Platform Product (Capability Authority) UUID' })
  id: string;

  @ApiProperty({ description: 'Platform Product display name' })
  name: string;
}

/**
 * Supplier Runtime — SupplierProduct Overview item (read-only).
 *
 * Predicate: organizationId → SupplierProduct List → Published / Active Context.
 * Enables the Supplier to inspect its own capability models (status) and a
 * summarized commercial availability, without exposing Buyer interest here.
 * Buyer Interest is served by the dedicated Inquiry Context view.
 */
export class WorkspaceSupplierProductDto {
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

  @ApiProperty({ description: 'SupplierProduct lifecycle status' })
  status: string;

  @ApiProperty({ description: 'SupplierProduct creation time' })
  createdAt: Date;

  @ApiProperty({ description: 'SupplierProduct last update time' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Published time (PUBLISHED only)' })
  publishedAt?: Date | null;

  @ApiProperty({ type: WorkspaceSupplierProductPlatformProductDto })
  platformProduct: WorkspaceSupplierProductPlatformProductDto;

  @ApiProperty({ type: WorkspaceSupplierProductCommercialSummaryDto })
  commercialSummary: WorkspaceSupplierProductCommercialSummaryDto;
}

/**
 * Supplier Runtime — SupplierProduct List response envelope.
 * Pagination metadata added in M28.0 P2-A Runtime Scaling.
 */
export class WorkspaceSupplierProductsDto {
  @ApiProperty({ type: [WorkspaceSupplierProductDto] })
  data: WorkspaceSupplierProductDto[];

  @ApiProperty({ description: 'Total SupplierProducts owned by the supplier organization (matching filters)' })
  total: number;

  @ApiProperty({ description: 'Current page (1-based)' })
  page: number;

  @ApiProperty({ description: 'Page size (default 20)' })
  pageSize: number;
}