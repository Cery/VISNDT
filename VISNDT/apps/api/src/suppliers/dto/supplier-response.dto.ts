import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SupplierListItemDto {
  @ApiProperty({ description: 'Organization ID' })
  id: string;

  @ApiProperty({ description: 'Organization name' })
  name: string;

  @ApiProperty({ description: 'Organization type', example: 'supplier' })
  type: string;

  @ApiProperty({ description: 'Number of offers (products) this supplier provides' })
  offersCount: number;
}

export class SupplierDetailDto {
  @ApiProperty({ description: 'Organization ID' })
  id: string;

  @ApiProperty({ description: 'Organization name' })
  name: string;

  @ApiProperty({ description: 'Organization type', example: 'supplier' })
  type: string;

  @ApiProperty({ description: 'Organization status' })
  status: string;

  @ApiProperty({ description: 'Total number of products offered' })
  productCount: number;

  @ApiProperty({ description: 'Total number of offers' })
  offerCount: number;

  @ApiProperty({ description: 'Total number of demand matches' })
  matchCount: number;

  @ApiProperty({ description: 'Organization creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Organization last update timestamp' })
  updatedAt: string;
}

export class SupplierProductDto {
  @ApiProperty({ description: 'Product ID' })
  id: string;

  @ApiProperty({ description: 'Product name' })
  name: string;

  @ApiPropertyOptional({ description: 'Product model' })
  model?: string;

  @ApiProperty({ description: 'Product status' })
  status: string;

  @ApiProperty({ description: 'Product category info' })
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;

  @ApiProperty({ description: 'Offer status' })
  offerStatus: string;

  @ApiProperty({ description: 'Offer ID' })
  offerId: string;
}

export class SupplierMatchDto {
  @ApiProperty({ description: 'Match ID' })
  id: string;

  @ApiProperty({ description: 'Match score' })
  matchScore: number;

  @ApiProperty({ description: 'Match status' })
  matchStatus: string;

  @ApiProperty({ description: 'Demand summary' })
  demand: {
    id: string;
    title: string;
    status: string;
  };

  @ApiProperty({ description: 'Product summary' })
  product: {
    id: string;
    name: string;
  };

  @ApiPropertyOptional({ description: 'When the match was made' })
  matchedAt?: string;

  @ApiPropertyOptional({ description: 'When the match was reviewed' })
  reviewedAt?: string;
}