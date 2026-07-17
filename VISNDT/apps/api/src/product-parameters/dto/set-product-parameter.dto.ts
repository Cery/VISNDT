import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetProductParameterDto {
  @ApiProperty({ description: 'Parameter definition ID', example: 'uuid' })
  @IsString()
  parameterDefinitionId: string;

  @ApiProperty({ description: 'Parameter value', example: '100' })
  @IsString()
  value: string;
}