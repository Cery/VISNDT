import { IsArray, IsUUID, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CleanupOrphansDto {
  @ApiProperty({
    description: 'Array of FileAsset UUIDs to delete (max 100)',
    type: [String],
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ],
  })
  @IsArray({ message: 'ids must be an array' })
  @ArrayMinSize(1, { message: 'At least 1 ID is required' })
  @ArrayMaxSize(100, { message: 'Maximum 100 IDs allowed per request' })
  @IsUUID('4', { each: true, message: 'Each ID must be a valid UUID v4' })
  ids: string[];
}