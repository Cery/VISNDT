import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AdminAuditLogService } from './admin-audit-log.service';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Admin Audit Log')
@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminAuditLogController {
  constructor(private readonly adminAuditLogService: AdminAuditLogService) {}

  @Get()
  @ApiOperation({ summary: 'List audit logs (ADMIN only)' })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('entityType') entityType?: string,
    @Query('action') action?: string,
    @Query('operatorId') operatorId?: string,
  ) {
    const result = await this.adminAuditLogService.list({
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      entityType,
      action,
      operatorId,
    });
    return ApiResponse.ok(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get audit log detail (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'AuditLog UUID' })
  async getById(@Param('id') id: string) {
    const result = await this.adminAuditLogService.getById(id);
    return ApiResponse.ok(result);
  }
}