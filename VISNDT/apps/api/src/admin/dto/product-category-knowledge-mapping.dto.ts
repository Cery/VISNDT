import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateProductCategoryKnowledgeMappingDto {
  @ApiProperty({ description: 'Product Category ID', example: 'uuid' })
  @IsUUID()
  productCategoryId: string;

  @ApiProperty({ description: 'Knowledge Category ID', example: 'uuid' })
  @IsUUID()
  knowledgeCategoryId: string;

  @ApiPropertyOptional({ description: 'Sort order', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Active status', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateProductCategoryKnowledgeMappingDto {
  @ApiPropertyOptional({ description: 'Sort order' })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateMappingStatusDto {
  @ApiProperty({ description: 'Active status' })
  @IsBoolean()
  isActive: boolean;
}