import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Electronics' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Category slug', example: 'electronics' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ description: 'Parent category ID', example: 'uuid' })
  @IsOptional()
  @IsString()
  parentId?: string;
}