import { IsString, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateSupplierProductDto — M28.0 Hybrid Model C / 816 Governance Foundation.
 *
 * Admin-governance create contract. The owning Supplier Organization is now
 * explicitly selected by the Platform Admin (organizationId).
 *
 * 816 correction: organizationId is NO LONGER derived from the authenticated
 * admin's own organization. Platform Admin selects a target SUPPLIER org.
 * Server-side validation enforces: org exists + ACTIVE + type is SUPPLIER.
 *
 * Ownership anchors (organizationId + platformProductId) are immutable via edit.
 */
export class CreateSupplierProductDto {
  @ApiProperty({ description: 'Owning Supplier Organization UUID the model is assigned to', example: 'uuid' })
  @IsUUID()
  organizationId: string;

  @ApiProperty({ description: 'Platform Product (capability node) UUID the model binds to', example: 'uuid' })
  @IsUUID()
  platformProductId: string;

  @ApiProperty({ description: 'Supplier brand name', example: 'Acme Inspection' })
  @IsString()
  @MaxLength(255)
  brand: string;

  @ApiPropertyOptional({ description: 'Series', example: 'X9' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  series?: string | null;

  @ApiProperty({ description: 'Supplier model number', example: 'X9-200' })
  @IsString()
  @MaxLength(255)
  modelNumber: string;

  @ApiPropertyOptional({ description: 'Supplier product description' })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ description: 'Technical description' })
  @IsOptional()
  @IsString()
  technicalDescription?: string | null;

  @ApiPropertyOptional({ description: 'Application info' })
  @IsOptional()
  @IsString()
  applicationInfo?: string | null;
}