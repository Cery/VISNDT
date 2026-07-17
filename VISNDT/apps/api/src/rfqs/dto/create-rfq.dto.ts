import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRfqDto {
  @ApiProperty({ description: 'Demand ID', example: 'uuid' })
  @IsString()
  demandId: string;

  @ApiProperty({ description: 'User ID who created this RFQ', example: 'uuid' })
  @IsString()
  createdBy: string;
}