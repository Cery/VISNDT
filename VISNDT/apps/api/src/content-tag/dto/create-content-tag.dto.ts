import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentTagType } from '@prisma/client';

export class CreateContentTagDto {
  @ApiProperty({ description: 'Tag name', example: '智能制造' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'URL-friendly slug', example: 'smart-manufacturing' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Tag type', enum: ContentTagType, example: 'INDUSTRY' })
  @IsEnum(ContentTagType)
  type: ContentTagType;

  @ApiPropertyOptional({ description: 'Tag description', example: '工业 4.0 与智能制造相关' })
  @IsOptional()
  @IsString()
  description?: string;
}