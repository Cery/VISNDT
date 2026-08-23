import { IsString, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateSupplierProductDto — M28.0 Hybrid Model C.
 *
 * Admin-governance create contract. organizationId is omitted on purpose:
 * it is derived from the authenticated user's organization context server-side.
 */
export class CreateSupplierProductDto {
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