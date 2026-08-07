import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AdminInquiryService } from './admin-inquiry.service';
import { ApiResponse } from '../common/dto/api-response.dto';
import { BatchDeleteDto } from '../common/dto/batch-delete.dto';
import { BatchStatusDto } from '../common/dto/batch-status.dto';

@ApiTags('Admin Inquiries')
@Controller('admin/inquiries')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminInquiryController {
  constructor(private readonly adminInquiryService: AdminInquiryService) {}

  @Get()
  @ApiOperation({ summary: 'List all inquiries (ADMIN only). Supports keyword and status search' })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('keyword') keyword?: string,
    @Query('status') status?: string,
  ) {
    const p = Math.max(1, parseInt(page || '1', 10) || 1);
    const ps = Math.min(100, Math.max(1, parseInt(pageSize || '20', 10) || 20));
    const result = await this.adminInquiryService.list(p, ps, keyword, status);
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete inquiry (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Inquiry UUID' })
  async remove(@Param('id') id: string) {
    const result = await this.adminInquiryService.remove(id);
    return ApiResponse.ok(result, 'Inquiry deleted');
  }

  @Post('batch-delete')
  @ApiOperation({ summary: 'Batch delete inquiries (ADMIN only)' })
  async batchDelete(@Body() dto: BatchDeleteDto) {
    const result = await this.adminInquiryService.batchDelete(dto);
    return ApiResponse.ok(result, 'Inquiries batch deleted');
  }

  @Patch('batch/status')
  @ApiOperation({ summary: 'Batch update inquiry status (ADMIN only)' })
  async batchStatus(@Body() dto: BatchStatusDto) {
    const result = await this.adminInquiryService.batchStatus(dto);
    return ApiResponse.ok(result, 'Inquiries status batch updated');
  }
}