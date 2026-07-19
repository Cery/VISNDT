import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DemandMatchStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class QueryMatchDto {
  @ApiPropertyOptional({ enum: DemandMatchStatus, description: 'Filter by match status' })
  @IsOptional()
  @IsEnum(DemandMatchStatus)
  status?: DemandMatchStatus;

  @ApiPropertyOptional({ enum: ['score', 'latest', 'updated'], description: 'Sort order', default: 'score' })
  @IsOptional()
  @IsString()
  sort?: 'score' | 'latest' | 'updated';

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