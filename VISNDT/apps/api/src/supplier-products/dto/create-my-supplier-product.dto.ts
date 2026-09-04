import { IsString, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateMySupplierProductDto — 820 Self-Service create contract.
 *
 * The ONLY supplier-submitted fields are the chosen Platform Product reference
 * and the supplier-OWNED model content. organizationId is NOT accepted here:
 * it is always server-derived from the authenticated supplier context
 * (user.organizationId). Ownership can never be spoofed via the request body.
 *
 * Multiple distinct real modelNumber values are permitted under the same
 * (organization, platformProduct); DB uniqueness is
 * @@unique([organizationId, platformProductId, modelNumber]).
 */
export class CreateMySupplierProductDto {
  @ApiProperty({
    description:
      'Existing Platform Product (Platform Authority) UUID this supplier model binds to. The supplier owns the MODEL, never the Platform Product.',
    example: 'uuid',
  })
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

  @ApiProperty({ description: 'Supplier real model number', example: 'X9-200B' })
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