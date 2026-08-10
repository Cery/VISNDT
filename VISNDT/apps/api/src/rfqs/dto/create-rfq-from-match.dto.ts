import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRfqFromMatchDto {
  @ApiProperty({ description: 'Accepted DemandMatch ID', example: 'uuid' })
  @IsString()
  matchId: string;
}
