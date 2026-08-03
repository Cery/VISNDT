import { Controller, Get, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AdminInquiryService } from './admin-inquiry.service';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Admin Inquiries')
@Controller('admin/inquiries')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminInquiryController {
  constructor(private readonly adminInquiryService: AdminInquiryService) {}

  @Get()
  @ApiOperation({ summary: 'List all inquiries (ADMIN only)' })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const p = Math.max(1, parseInt(page || '1', 10) || 1);
    const ps = Math.min(100, Math.max(1, parseInt(pageSize || '20', 10) || 20));
    const result = await this.adminInquiryService.list(p, ps);
    return ApiResponse.ok(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inquiry detail (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Inquiry UUID' })
  async getById(@Param('id') id: string) {
    const result = await this.adminInquiryService.getById(id);
    return ApiResponse.ok(result);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update inquiry status (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Inquiry UUID' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    const result = await this.adminInquiryService.updateStatus(
      id,
      status as any,
    );
    return ApiResponse.ok(result, 'Inquiry status updated');
  }
}