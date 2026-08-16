import { IsArray, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConversionEventType } from '@prisma/client';

export class AnalyticsEventDto {
  @IsEnum(ConversionEventType)
  event: ConversionEventType;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsUUID()
  entityId?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class CreateAnalyticsEventsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnalyticsEventDto)
  events: AnalyticsEventDto[];
}