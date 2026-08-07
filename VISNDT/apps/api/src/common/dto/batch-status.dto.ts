import { IsArray, IsUUID, IsString, ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BatchStatusDto {
  @ApiProperty({ description: 'Array of UUIDs to update', example: ['uuid-1', 'uuid-2'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  ids: string[];

  @ApiProperty({ description: 'Target status value', example: 'ACTIVE' })
  @IsString()
  @IsNotEmpty()
  status: string;
}