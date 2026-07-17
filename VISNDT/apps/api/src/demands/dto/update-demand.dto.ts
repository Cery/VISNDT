import { IsString, IsOptional, IsEnum } from 'class-validator';
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

  @ApiPropertyOptional({ description: 'Dynamic parameters as JSON object' })
  @IsOptional()
  parametersJson?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Budget range' })
  @IsOptional()
  @IsString()
  budgetRange?: string;
}