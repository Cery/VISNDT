import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateParameterDefinitionDto {
  @ApiProperty({ description: 'Parameter definition name', example: 'Length' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Parameter definition code', example: 'length' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Data type', example: 'number' })
  @IsString()
  dataType: string;

  @ApiPropertyOptional({ description: 'Parameter group ID', example: 'uuid' })
  @IsOptional()
  @IsString()
  parameterGroupId?: string;

  @ApiPropertyOptional({ description: 'Unit of measurement', example: 'mm' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Whether this parameter is required', default: false })
  @IsOptional()
  @IsBoolean()
  required?: boolean;
}