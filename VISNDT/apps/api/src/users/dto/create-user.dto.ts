import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', minLength: 6, example: 'password123' })
  @IsString()
  @MinLength(6)
  passwordHash: string;

  @ApiPropertyOptional({ description: 'User display name', example: '张三' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Organization ID to join', example: 'uuid' })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @ApiPropertyOptional({ description: 'Role in organization', example: 'MEMBER' })
  @IsOptional()
  @IsString()
  role?: string;
}