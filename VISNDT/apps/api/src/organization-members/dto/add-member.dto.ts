import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddMemberDto {
  @ApiProperty({ description: 'User ID to add as member', example: 'uuid' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ description: 'Member role', example: 'admin' })
  @IsOptional()
  @IsString()
  role?: string;
}