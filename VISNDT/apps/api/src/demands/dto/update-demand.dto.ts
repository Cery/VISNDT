import { IsString, IsOptional, IsEnum, IsInt, IsBoolean, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DemandStatus } from '@prisma/client';

export class UpdateDemandDto {
  @ApiPropertyOptional({ description: 'Demand title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Demand description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Demand status', enum: DemandStatus })
  @IsOptional()
  @IsEnum(DemandStatus)
  status?: DemandStatus;

  @ApiPropertyOptional({ description: 'Budget range' })
  @IsOptional()
  @IsString()
  budgetRange?: string;

  @ApiPropertyOptional({ description: 'Quantity required' })
  @IsOptional()
  @IsInt()
  quantity?: number;

  @ApiPropertyOptional({ description: 'Quantity unit' })
  @IsOptional()
  @IsString()
  quantityUnit?: string;

  @ApiPropertyOptional({ description: 'Expected delivery date (ISO 8601)' })
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

  @ApiPropertyOptional({ description: 'Make contact info publicly visible' })
  @IsOptional()
  @IsBoolean()
  contactVisible?: boolean;

  @ApiPropertyOptional({ description: 'Demand category id (ProductCategory relation)' })
  @IsOptional()
  @IsString()
  categoryId?: string;
}