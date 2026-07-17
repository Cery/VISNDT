import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RFQStatus } from '@prisma/client';

export class UpdateRfqDto {
  @ApiPropertyOptional({ description: 'RFQ status', enum: RFQStatus })
  @IsOptional()
  @IsEnum(RFQStatus)
  status?: RFQStatus;
}