import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AuthOrganizationDto {
  @ApiProperty({ description: 'Organization ID', example: '550e8400-e29b-41d4-a716-446655440001' })
  id: string;

  @ApiProperty({ description: 'Organization name', example: 'Acme Industrial' })
  name: string;

  @ApiProperty({ description: 'Organization type', example: 'SUPPLIER' })
  type: string;
}

class AuthOrganizationMemberDto {
  @ApiProperty({ description: 'Organization member role', example: 'ADMIN' })
  role: string;
}

export class AuthUserDto {
  @ApiProperty({ description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiPropertyOptional({ description: 'Display name', example: 'John Doe' })
  name?: string | null;

  @ApiPropertyOptional({ description: 'Organization ID', example: '550e8400-e29b-41d4-a716-446655440001' })
  organizationId?: string | null;

  @ApiProperty({
    description: 'Organization summary',
    type: AuthOrganizationDto,
    nullable: true,
  })
  organization: AuthOrganizationDto | null;

  @ApiProperty({
    description: 'Organization membership summary',
    type: AuthOrganizationMemberDto,
    nullable: true,
  })
  organizationMember: AuthOrganizationMemberDto | null;

  @ApiProperty({
    description: 'Derived workspace role',
    enum: ['SUPPLIER', 'BUYER'],
    nullable: true,
  })
  workspaceRole: 'SUPPLIER' | 'BUYER' | null;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'User profile', type: AuthUserDto })
  user: AuthUserDto;
}
