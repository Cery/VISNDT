import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * UpdateMySupplierProductDto — 820 Self-Service edit contract.
 *
 * Supplier edits their OWN model content only. Deliberately excludes:
 *   - organizationId    (immutable — server-derived, ownership can never be spoofed)
 *   - platformProductId (immutable — the Platform Capability Node, not owned)
 *   - slug              (excluded from self-service to avoid shaping public identity;
 *                        SEO/public discovery authority stays Platform/Admin governed)
 */
export class UpdateMySupplierProductDto {
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

  @ApiPropertyOptional({ description: 'Supplier real model number', example: 'X9-200B' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  modelNumber?: string;

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