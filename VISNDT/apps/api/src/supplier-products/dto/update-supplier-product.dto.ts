import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * UpdateSupplierProductDto — 816 Admin edit contract.
 *
 * Edits supplier-owned content fields only. Ownership anchors are intentionally
 * NOT present:
 *   - organizationId   (immutable — the owning Supplier Organization)
 *   - platformProductId(immutable — the Platform Capability Node)
 *
 * These anchors cannot be changed through ordinary Admin editing.
 */
export class UpdateSupplierProductDto {
  @ApiPropertyOptional({ description: 'Supplier brand name', example: 'Acme Inspection' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  brand?: string;

  @ApiPropertyOptional({ description: 'Series', example: 'X9' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  series?: string | null;

  @ApiPropertyOptional({ description: 'Supplier model number', example: 'X9-200' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  modelNumber?: string;

  @ApiPropertyOptional({ description: 'Supplier product slug' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string | null;

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