import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthRequest } from './interfaces/auth-request.interface';

@ApiTags('Auth')
@Controller('auth')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post('invitations')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create user invitation (Admin only)' })
  @SwaggerResponse({ status: 201, description: 'Invitation created' })
  @SwaggerResponse({ status: 403, description: 'Forbidden' })
  @SwaggerResponse({ status: 429, description: 'Too many requests' })
  async createInvitation(
    @Body() dto: CreateInvitationDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const result = await this.invitationService.createInvitation(
      user.organizationId!,
      user.id,
      dto,
    );
    return ApiResponse.ok(result, 'Invitation created');
  }
}