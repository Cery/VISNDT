import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password hash', minLength: 6, example: 'hashed_password' })
  @IsString()
  @MinLength(6)
  passwordHash: string;

  @ApiPropertyOptional({ description: 'Organization ID to join', example: 'uuid' })
  @IsOptional()
  @IsString()
  organizationId?: string;
}