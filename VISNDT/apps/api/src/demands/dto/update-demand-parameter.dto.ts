import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDemandParameterDto {
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

  @ApiPropertyOptional({ description: 'Whether this parameter is required' })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional({ description: 'Priority (0=normal, 1=important, 2=critical)' })
  @IsOptional()
  @IsNumber()
  priority?: number;
}