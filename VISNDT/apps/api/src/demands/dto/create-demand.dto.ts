import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDemandDto {
  @ApiProperty({ description: 'Demand title', example: 'Need 1000 steel plates' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'User ID who created this demand', example: 'uuid' })
  @IsString()
  createdBy: string;

  @ApiPropertyOptional({ description: 'Demand description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Organization ID', example: 'uuid' })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @ApiPropertyOptional({ description: 'Dynamic parameters as JSON object' })
  @IsOptional()
  @IsObject()
  parametersJson?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Budget range', example: '10000-50000' })
  @IsOptional()
  @IsString()
  budgetRange?: string;
}