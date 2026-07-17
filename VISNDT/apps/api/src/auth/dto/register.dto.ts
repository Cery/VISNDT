import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', minLength: 8, example: 'password123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ description: 'Display name', example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;
}