import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';

/**
 * AI Request DTO — M21.7.1 AI Gateway Foundation
 *
 * Placeholder DTO for future AI capability requests.
 * Currently used for audit context only.
 */

export enum AIRequestStatus {
  RECEIVED = 'RECEIVED',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
  FORWARDED = 'FORWARDED',
}

export class AIRequestDto {
  @ApiProperty({
    description: 'AI capability being requested',
    example: 'SEARCH',
  })
  @IsString()
  capability: string;

  @ApiPropertyOptional({
    description: 'Optional request metadata',
    example: { query: 'product search', entityType: 'PRODUCT' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class AIRequestContextDto {
  @ApiProperty({ description: 'AI capability', example: 'SEARCH' })
  @IsString()
  capability: string;

  @ApiProperty({ description: 'Request timestamp', example: '2026-08-16T10:00:00.000Z' })
  @IsString()
  timestamp: string;

  @ApiProperty({ description: 'Requester ID', example: 'uuid' })
  @IsString()
  requesterId: string;

  @ApiProperty({ description: 'Request status', enum: AIRequestStatus })
  @IsEnum(AIRequestStatus)
  status: AIRequestStatus;

  @ApiPropertyOptional({ description: 'Optional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}