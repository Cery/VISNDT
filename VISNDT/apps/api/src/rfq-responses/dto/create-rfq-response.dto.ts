import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRfqResponseDto {
  @ApiPropertyOptional({ description: 'Linked Offer ID', example: 'uuid' })
  @IsOptional()
  @IsString()
  offerId?: string;

  @ApiPropertyOptional({ description: 'Response message', example: 'We are interested' })
  @IsOptional()
  @IsString()
  message?: string;
}