import { IsString, IsOptional, IsBoolean, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDemandParameterDto {
  @ApiProperty({ description: 'Parameter definition UUID' })
  @IsUUID()
  parameterDefinitionId: string;

  @ApiPropertyOptional({ description: 'Exact value requirement' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({ description: 'Minimum numeric value' })
  @IsOptional()
  @IsNumber()
  valueMin?: number;

  @ApiPropertyOptional({ description: 'Maximum numeric value' })
  @IsOptional()
  @IsNumber()
  valueMax?: number;

  @ApiPropertyOptional({ description: 'Whether this parameter is required', default: true })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional({ description: 'Priority (0=normal, 1=important, 2=critical)', default: 0 })
  @IsOptional()
  @IsNumber()
  priority?: number;
}