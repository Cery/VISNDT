import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvitationDto {
  @ApiProperty({ description: 'Invitee email', example: 'newuser@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Role for the invited user', default: 'MEMBER', example: 'MEMBER' })
  @IsOptional()
  @IsString()
  role?: string;
}