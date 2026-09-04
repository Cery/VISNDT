import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * WorkspaceAttachSupplierProductDto — 817 Supplier Attach contract.
 *
 * The ONLY supplier-submitted field is the chosen Platform Product (the Platform
 * Authority / capability node the supplier organization wants to associate with).
 *
 * organizationId is NOT accepted here: it is always server-derived from the
 * authenticated supplier context (getSupplierOrganizationId). A client-supplied
 * organizationId is ignored — ownership can never be spoofed via the request body.
 */
export class WorkspaceAttachSupplierProductDto {
  @ApiProperty({
    description:
      'Existing Platform Product (Platform Authority) UUID the supplier chooses to attach. On success a NEW organization-owned SupplierProduct DRAFT is created from it.',
    example: 'uuid',
  })
  @IsUUID()
  platformProductId: string;
}