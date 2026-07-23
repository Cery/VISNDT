import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkflowEntityType, WorkflowAction } from '@prisma/client';

export class CreateWorkflowEventDto {
  @ApiProperty({ description: 'Entity type', enum: WorkflowEntityType })
  @IsEnum(WorkflowEntityType)
  entityType: WorkflowEntityType;

  @ApiProperty({ description: 'Entity ID', example: 'uuid' })
  @IsString()
  entityId: string;

  @ApiProperty({ description: 'Workflow action', enum: WorkflowAction })
  @IsEnum(WorkflowAction)
  action: WorkflowAction;

  @ApiPropertyOptional({ description: 'Additional metadata JSON' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}