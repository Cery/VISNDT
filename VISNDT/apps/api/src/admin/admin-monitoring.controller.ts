import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AdminMonitoringService } from './admin-monitoring.service';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Admin Monitoring')
@Controller('admin/monitoring')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminMonitoringController {
  constructor(private readonly monitoringService: AdminMonitoringService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get unified monitoring overview (ADMIN only)' })
  async getOverview() {
    const data = await this.monitoringService.getOverview();
    return ApiResponse.ok(data);
  }
}