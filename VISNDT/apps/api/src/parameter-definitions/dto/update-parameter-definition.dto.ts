import { IsString, IsOptional, IsBoolean, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateParameterDefinitionDto {
  @ApiPropertyOptional({ description: 'Parameter definition name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Parameter definition code' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Data type', enum: ['STRING', 'NUMBER', 'BOOLEAN', 'ENUM'] })
  @IsOptional()
  @IsString()
  @IsIn(['STRING', 'NUMBER', 'BOOLEAN', 'ENUM'])
  dataType?: string;

  @ApiPropertyOptional({ description: 'Parameter group ID' })
  @IsOptional()
  @IsString()
  parameterGroupId?: string;

  @ApiPropertyOptional({ description: 'Unit of measurement' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Whether this parameter is required' })
  @IsOptional()
  @IsBoolean()
  required?: boolean;
}