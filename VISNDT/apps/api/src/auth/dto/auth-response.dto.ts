import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiPropertyOptional({ description: 'Display name', example: 'John Doe' })
  name?: string | null;

  @ApiPropertyOptional({ description: 'Organization ID', example: '550e8400-e29b-41d4-a716-446655440001' })
  organizationId?: string | null;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'User profile', type: AuthUserDto })
  user: AuthUserDto;
}