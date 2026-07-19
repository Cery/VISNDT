import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRfqDto {
  @ApiProperty({ description: 'Demand ID', example: 'uuid' })
  @IsString()
  demandId: string;
}