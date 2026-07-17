import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RFQResponseStatus } from '@prisma/client';

export class UpdateRfqResponseDto {
  @ApiPropertyOptional({ description: 'Response status', enum: RFQResponseStatus })
  @IsOptional()
  @IsEnum(RFQResponseStatus)
  status?: RFQResponseStatus;
}