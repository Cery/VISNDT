import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRfqResponseDto {
  @ApiProperty({ description: 'Organization ID', example: 'uuid' })
  @IsString()
  organizationId: string;

  @ApiPropertyOptional({ description: 'Linked Offer ID', example: 'uuid' })
  @IsOptional()
  @IsString()
  offerId?: string;

  @ApiPropertyOptional({ description: 'Response message', example: 'We are interested' })
  @IsOptional()
  @IsString()
  message?: string;
}