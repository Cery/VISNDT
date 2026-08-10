import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DecideRfqResponseDto {
  @ApiPropertyOptional({
    description: 'Buyer decision note',
    example: 'Commercial terms align with the approved demand scope.',
  })
  @IsOptional()
  @IsString()
  decisionNote?: string;
}
