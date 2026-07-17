import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OfferStatus } from '@prisma/client';

export class UpdateOfferDto {
  @ApiPropertyOptional({ description: 'Offer title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Offer description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Offer status', enum: OfferStatus })
  @IsOptional()
  @IsEnum(OfferStatus)
  status?: OfferStatus;
}