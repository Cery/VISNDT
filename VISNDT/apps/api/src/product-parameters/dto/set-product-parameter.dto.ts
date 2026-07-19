import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SetProductParameterDto {
  @ApiProperty({ description: 'Parameter definition ID', example: 'uuid' })
  @IsString()
  parameterDefinitionId: string;

  @ApiProperty({ description: 'Parameter value (string representation)', example: '2.8mm' })
  @IsString()
  value: string;

  @ApiPropertyOptional({ description: 'Numeric value for range queries', example: 2.8 })
  @IsOptional()
  @IsNumber()
  valueNumber?: number;
}