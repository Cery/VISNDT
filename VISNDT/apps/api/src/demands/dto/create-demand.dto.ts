import { IsString, IsOptional, IsInt, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDemandDto {
  @ApiProperty({ description: 'Demand title', example: 'Need 100 industrial endoscopes' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Demand description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Budget range', example: '10000-50000' })
  @IsOptional()
  @IsString()
  budgetRange?: string;

  @ApiPropertyOptional({ description: 'Quantity required', example: 100 })
  @IsOptional()
  @IsInt()
  quantity?: number;

  @ApiPropertyOptional({ description: 'Quantity unit', example: '台' })
  @IsOptional()
  @IsString()
  quantityUnit?: string;

  @ApiPropertyOptional({ description: 'Expected delivery date (ISO 8601)', example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: string;

  @ApiPropertyOptional({ description: 'Contact person name' })
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiPropertyOptional({ description: 'Contact phone number' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Make contact info publicly visible', default: false })
  @IsOptional()
  @IsBoolean()
  contactVisible?: boolean;

  @ApiPropertyOptional({ description: 'Demand category id (ProductCategory relation)', example: 'uuid' })
  @IsOptional()
  @IsString()
  categoryId?: string;
}