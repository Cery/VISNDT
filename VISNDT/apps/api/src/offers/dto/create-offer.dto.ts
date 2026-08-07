import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOfferDto {
  @ApiProperty({ description: 'Product ID', example: 'uuid' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Offer title', example: 'Premium Widget Offer' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Offer description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Offer price', example: 1999.99 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ description: 'Currency code', example: 'CNY', default: 'CNY' })
  @IsOptional()
  @IsString()
  currency?: string;
}