import { IsString, IsOptional, IsIn, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ParameterFilterDto {
  @ApiProperty({ description: 'Parameter Definition ID', example: 'uuid' })
  @IsString()
  parameterDefinitionId: string;

  @ApiPropertyOptional({ description: 'Exact match value (string). Cannot be used with valueMin/valueMax', example: '2.8mm' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({ description: 'Minimum numeric value (inclusive). Use with valueNumber field', example: 2 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  valueMin?: number;

  @ApiPropertyOptional({ description: 'Maximum numeric value (inclusive). Use with valueNumber field', example: 3 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  valueMax?: number;
}

export class SearchProductDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Keyword search (name, model, description)', example: '内窥镜' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: 'Filter by category ID', example: 'uuid' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Include products from descendant subcategories when categoryId is set', example: 'true' })
  @IsOptional()
  @Type(() => Boolean)
  includeSubcategories?: boolean;

  @ApiPropertyOptional({ description: 'Filter by product status', example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Sort field', example: 'name', enum: ['createdAt', 'updatedAt', 'name'] })
  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'updatedAt', 'name'])
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order', example: 'asc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Parameter filters (AND logic). Supports exact match (value) or numeric range (valueMin/valueMax). Cannot mix both modes in one filter',
    type: [ParameterFilterDto],
    example: [
      { parameterDefinitionId: 'uuid-1', valueMin: 2, valueMax: 3 },
      { parameterDefinitionId: 'uuid-2', value: 'LED' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParameterFilterDto)
  parameterFilters?: ParameterFilterDto[];
}