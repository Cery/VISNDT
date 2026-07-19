import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DemandStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class SearchDemandDto {
  @ApiPropertyOptional({ description: 'Search keyword (title + description)' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ enum: DemandStatus, description: 'Filter by demand status' })
  @IsOptional()
  @IsEnum(DemandStatus)
  status?: DemandStatus;

  @ApiPropertyOptional({ enum: ['latest', 'updated', 'published'], description: 'Sort order', default: 'latest' })
  @IsOptional()
  @IsString()
  sort?: 'latest' | 'updated' | 'published';

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Page size', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;
}