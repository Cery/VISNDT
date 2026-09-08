import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateParameterGroupDto {
  @ApiProperty({ description: 'Parameter group name', example: 'Dimensions' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Parameter group code', example: 'dimensions' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ description: 'Parameter group description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Associated product category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;
}