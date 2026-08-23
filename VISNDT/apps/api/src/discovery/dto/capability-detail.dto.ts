import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CapabilityDetailDTO families — M28.0 Hybrid Model C capability read contract.
 *
 * Response shape (transport boundary only; NO raw Prisma relations, NO DB joins,
 * NO bare Offer list — every supplier product carries only its own offers[]):
 *
 *   {
 *     platformProduct,
 *     supplierProducts: [
 *       { supplierProduct, offers: [] }
 *     ]
 *   }
 */

export class CapabilityPlatformProductDTO {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Ultrasonic Flaw Detector' })
  name: string;

  @ApiPropertyOptional({ example: 'ultrasonic-flaw-detector' })
  slug?: string | null;

  @ApiPropertyOptional({ example: 'uuid' })
  categoryId?: string | null;

  @ApiPropertyOptional({ example: 'PUBLISHED' })
  status?: string;
}

class CapabilityOrganizationDTO {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Acme Inspection' })
  name: string;
}

class CapabilitySupplierProductMediaDTO {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiPropertyOptional({ example: 'uuid' })
  fileAssetId?: string | null;

  @ApiPropertyOptional({ example: 'IMAGE' })
  mediaType?: string;

  @ApiPropertyOptional({ example: 'Front view' })
  title?: string | null;
}

/**
 * CapabilityCommercialSummaryDTO — the commercial layer summary for a published
 * SupplierProduct. Derived from its offers; reveals only commercial availability
 * (count + price band), never internal governance data.
 */
export class CapabilityCommercialSummaryDTO {
  @ApiProperty({ example: 3 })
  offerCount: number;

  @ApiProperty({ example: 2 })
  activeOfferCount: number;

  @ApiPropertyOptional({ example: 1200.0 })
  priceFrom?: number | null;

  @ApiPropertyOptional({ example: 2600.0 })
  priceTo?: number | null;

  @ApiPropertyOptional({ example: 'CNY' })
  currency?: string | null;
}

/**
 * CapabilityParameterDefinitionDTO — the definition of a technical parameter
 * carried by a SupplierProduct override. Read-side reference only; reveals
 * name/code/type/unit so the Buyer can compare like-for-like.
 */
export class CapabilityParameterDefinitionDTO {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: '探测范围' })
  name: string;

  @ApiPropertyOptional({ example: 'detection_range' })
  code?: string | null;

  @ApiPropertyOptional({ example: 'NUMBER' })
  dataType?: string;

  @ApiPropertyOptional({ example: 'mm' })
  unit?: string | null;

  @ApiPropertyOptional({ example: 'uuid' })
  parameterGroupId?: string | null;
}

/**
 * CapabilitySupplierProductParameterValueDTO — one technical parameter override
 * on a SupplierProduct (the Buyer Comparison data source). Carries both the raw
 * value and its definition; no governance metadata is exposed.
 */
export class CapabilitySupplierProductParameterValueDTO {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  parameterDefinitionId: string;

  @ApiPropertyOptional({ example: '1200' })
  value?: string | null;

  @ApiPropertyOptional({ example: 1200 })
  valueNumber?: number | null;

  @ApiPropertyOptional({ type: CapabilityParameterDefinitionDTO })
  parameterDefinition?: CapabilityParameterDefinitionDTO | null;
}

export class CapabilitySupplierProductDTO {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  organizationId: string;

  @ApiProperty({ example: 'Acme Inspection' })
  brand: string;

  @ApiPropertyOptional({ example: 'X9' })
  series?: string | null;

  @ApiProperty({ example: 'X9-200' })
  modelNumber: string;

  @ApiPropertyOptional({ example: 'x9-200' })
  slug?: string | null;

  @ApiPropertyOptional({ example: 'PUBLISHED' })
  status?: string;

  @ApiPropertyOptional({ example: 'Long product description' })
  description?: string | null;

  @ApiPropertyOptional({ example: 'Technical description' })
  technicalDescription?: string | null;

  @ApiPropertyOptional({ type: CapabilityOrganizationDTO })
  organization?: CapabilityOrganizationDTO | null;

  @ApiPropertyOptional({ type: CapabilitySupplierProductMediaDTO, isArray: true })
  media?: CapabilitySupplierProductMediaDTO[];

  @ApiPropertyOptional({ type: CapabilityCommercialSummaryDTO })
  commercialSummary?: CapabilityCommercialSummaryDTO;

  @ApiPropertyOptional({
    type: CapabilitySupplierProductParameterValueDTO,
    isArray: true,
  })
  parameterValues?: CapabilitySupplierProductParameterValueDTO[];
}

export class CapabilityOfferDTO {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  organizationId: string;

  @ApiPropertyOptional({ example: 'uuid' })
  productId?: string | null;

  @ApiPropertyOptional({ example: 'uuid' })
  supplierProductId?: string | null;

  @ApiProperty({ example: 'Premium Widget Offer' })
  title: string;

  @ApiPropertyOptional({ example: 'Detailed offer description' })
  description?: string | null;

  @ApiPropertyOptional({ example: 1999.99 })
  price?: number | null;

  @ApiPropertyOptional({ example: 'CNY' })
  currency?: string | null;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  status?: string;
}

export class CapabilitySupplierProductWithOffersDTO {
  @ApiProperty({ type: CapabilitySupplierProductDTO })
  supplierProduct: CapabilitySupplierProductDTO;

  @ApiProperty({ type: CapabilityOfferDTO, isArray: true })
  offers: CapabilityOfferDTO[];
}

export class CapabilityDetailDTO {
  @ApiProperty({ type: CapabilityPlatformProductDTO })
  platformProduct: CapabilityPlatformProductDTO;

  @ApiProperty({ type: CapabilitySupplierProductWithOffersDTO, isArray: true })
  supplierProducts: CapabilitySupplierProductWithOffersDTO[];
}