import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AnalyticsReadService } from './analytics-read.service';
import { AnalyticsQueryDto, AnalyticsEventsQueryDto, DashboardQueryDto } from './dto/analytics-query.dto';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AnalyticsReadController {
  constructor(private readonly analyticsReadService: AnalyticsReadService) {}

  @Get('dashboard')
  async getDashboard(@Query() query: DashboardQueryDto) {
    return this.analyticsReadService.getDashboard(query);
  }

  @Get('statistics')
  async getStatistics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsReadService.getStatistics(query);
  }

  @Get('events')
  async getEvents(@Query() query: AnalyticsEventsQueryDto) {
    return this.analyticsReadService.getEvents(query);
  }
}