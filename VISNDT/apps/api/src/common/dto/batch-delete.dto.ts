import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BatchDeleteDto {
  @ApiProperty({ description: 'Array of UUIDs to delete', example: ['uuid-1', 'uuid-2'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  ids: string[];
}