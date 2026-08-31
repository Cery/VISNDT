import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EvaluationState } from '@prisma/client';

export class UpdateEvaluationDto {
  @ApiPropertyOptional({
    description: 'Evaluation state for this target',
    enum: EvaluationState,
    example: EvaluationState.CONTACTED,
  })
  @IsEnum(EvaluationState)
  state?: EvaluationState;

  @ApiPropertyOptional({ description: 'Buyer private note for this evaluation' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  note?: string;
}