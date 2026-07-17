import { IsEmail, IsOptional, IsString, IsEnum, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User email address', example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Password hash', minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6)
  passwordHash?: string;

  @ApiPropertyOptional({ description: 'User status', enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ description: 'Organization ID' })
  @IsOptional()
  @IsString()
  organizationId?: string;
}