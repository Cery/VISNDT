import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EvaluationState, EvaluationTargetType } from '@prisma/client';

export class CreateEvaluationDto {
  @ApiProperty({
    description: 'Evaluation target type: PRODUCT (platform capability) or SUPPLIER_PRODUCT (published supplier model)',
    enum: EvaluationTargetType,
    example: 'PRODUCT',
  })
  @IsEnum(EvaluationTargetType)
  @IsNotEmpty()
  targetType: EvaluationTargetType;

  @ApiProperty({ description: 'ID of the evaluated Product or SupplierProduct (must exist)' })
  @IsUUID('loose')
  @IsNotEmpty()
  targetId: string;

  @ApiPropertyOptional({
    description: 'Evaluation state for this target',
    enum: EvaluationState,
    example: EvaluationState.SHORTLISTED,
    default: EvaluationState.INTERESTED,
  })
  @IsEnum(EvaluationState)
  @IsOptional()
  state?: EvaluationState;

  @ApiPropertyOptional({ description: 'Buyer private note for this evaluation' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  note?: string;
}