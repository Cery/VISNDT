import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Supplier Runtime — Buyer Inquiry context item (read-only).
 *
 * Represents a single Buyer Interest surfaced against the Platform Capability
 * that a SupplierProduct is anchored on. Strictly read-side; never mutates the
 * inquiry, never triggers order / payment / contract flow.
 */
export class WorkspaceSupplierInquiryItemDto {
  @ApiProperty({ description: 'Inquiry UUID' })
  id: string;

  @ApiPropertyOptional({ description: 'Inquiry status' })
  status?: string | null;

  @ApiPropertyOptional({ description: 'Buyer contact name' })
  contactName?: string | null;

  @ApiProperty({ description: 'Inquiry message (escaped, preview-only)' })
  message: string;

  @ApiProperty({ description: 'Inquiry creation time' })
  createdAt: Date;
}

/**
 * Supplier Runtime — Inquiry Context View.
 *
 * Predicate: SupplierProduct → Related Inquiry Context (read-only).
 * Buyer Interest is surfaced at the Scrum capability level (the Platform Product
 * a SupplierProduct is anchored on) so that cross-model interest is not lost.
 */
export class WorkspaceSupplierInquiryContextDto {
  @ApiProperty({ description: 'SupplierProduct UUID' })
  supplierProductId: string;

  @ApiProperty({ description: 'Supplier model display label (brand series modelNumber)' })
  supplierModelLabel: string;

  @ApiProperty({ description: 'SupplierProduct lifecycle status' })
  status: string;

  @ApiProperty({ description: 'Bound Platform Product (Capability Authority) UUID' })
  platformProductId: string;

  @ApiProperty({ description: 'Bound Platform Product display name' })
  platformProductName: string;

  @ApiProperty({ type: [WorkspaceSupplierInquiryItemDto] })
  inquiries: WorkspaceSupplierInquiryItemDto[];

  @ApiProperty({ description: 'Total related Buyer inquiries' })
  total: number;
}