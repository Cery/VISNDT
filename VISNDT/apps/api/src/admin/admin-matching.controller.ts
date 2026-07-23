import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AdminMatchingService } from './admin-matching.service';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Admin Matching')
@Controller('admin/matching')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminMatchingController {
  constructor(private readonly adminMatchingService: AdminMatchingService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get matching engine statistics (ADMIN only)' })
  async getStats() {
    const stats = await this.adminMatchingService.getMatchingStats();
    return ApiResponse.ok(stats);
  }
}