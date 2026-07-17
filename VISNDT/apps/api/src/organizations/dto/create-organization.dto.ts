import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ description: 'Organization name', example: 'ACME Corp' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Organization type', example: 'supplier' })
  @IsString()
  type: string;
}