import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AdminAuditIntelligenceService } from './admin-audit-intelligence.service';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Admin Audit Intelligence')
@Controller('admin/audit-intelligence')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminAuditIntelligenceController {
  constructor(private readonly auditIntelligenceService: AdminAuditIntelligenceService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get audit intelligence overview with trend, entity distribution, actor activity, and risk indicators (ADMIN only)' })
  async getOverview(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 7;
    const validDays = Math.min(90, Math.max(1, daysNum || 7));
    const data = await this.auditIntelligenceService.getOverview(validDays);
    return ApiResponse.ok(data);
  }
}