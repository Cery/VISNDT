import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DemandMatchStatus } from '@prisma/client';

export class UpdateMatchStatusDto {
  @ApiProperty({ enum: DemandMatchStatus, description: 'Target match status' })
  @IsEnum(DemandMatchStatus)
  status: DemandMatchStatus;

  @ApiPropertyOptional({ description: 'Optional notes for the status change' })
  @IsOptional()
  @IsString()
  notes?: string;
}