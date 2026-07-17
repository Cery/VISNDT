import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product category ID', example: 'uuid' })
  @IsString()
  categoryId: string;

  @ApiProperty({ description: 'Product name', example: 'Widget A' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Product model number', example: 'WA-100' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;
}