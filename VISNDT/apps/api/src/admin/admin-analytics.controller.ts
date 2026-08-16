import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AdminAnalyticsService } from './admin-analytics.service';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Admin Business Analytics')
@Controller('admin/analytics/business')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminAnalyticsController {
  constructor(private readonly analyticsService: AdminAnalyticsService) {}

  @Get('funnel')
  @ApiOperation({ summary: 'Get demand funnel and business pipeline overview (ADMIN only)' })
  async getFunnel() {
    const data = await this.analyticsService.getBusinessFunnel();
    return ApiResponse.ok(data);
  }

  @Get('lifecycle')
  @ApiOperation({ summary: 'Get RFQ lifecycle and response distribution (ADMIN only)' })
  async getLifecycle() {
    const data = await this.analyticsService.getBusinessLifecycle();
    return ApiResponse.ok(data);
  }

  @Get('conversion')
  @ApiOperation({ summary: 'Get full business conversion metrics (ADMIN only)' })
  async getConversion() {
    const data = await this.analyticsService.getBusinessConversion();
    return ApiResponse.ok(data);
  }

  @Get('matching')
  @ApiOperation({ summary: 'Get matching business metrics and score distribution (ADMIN only)' })
  async getMatching() {
    const data = await this.analyticsService.getBusinessMatching();
    return ApiResponse.ok(data);
  }
}