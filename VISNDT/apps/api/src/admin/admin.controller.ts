import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AdminService } from './admin.service';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Admin Dashboard')
@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics (ADMIN only)' })
  async getStats() {
    const stats = await this.adminService.getDashboardStats();
    return ApiResponse.ok(stats);
  }

  @Get('activities')
  @ApiOperation({ summary: 'Get recent platform activities (ADMIN only)' })
  async getActivities() {
    const activities = await this.adminService.getRecentActivities();
    return ApiResponse.ok(activities);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending items requiring attention (ADMIN only)' })
  async getPending() {
    const pending = await this.adminService.getPendingItems();
    return ApiResponse.ok(pending);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get system health summary (ADMIN only)' })
  async getStatus() {
    const status = await this.adminService.getSystemStatus();
    return ApiResponse.ok(status);
  }
}