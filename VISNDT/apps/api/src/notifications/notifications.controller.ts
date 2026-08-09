import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { QueryNotificationsDto } from './dto/query-notifications.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { BatchDeleteDto } from '../common/dto/batch-delete.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List notifications (paginated, filterable)' })
  async findAll(
    @Query() query: QueryNotificationsDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const result = await this.notificationsService.findAll(query, user);
    return ApiResponse.ok(result);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  async getUnreadCount(@CurrentUser() user: AuthRequest['user']) {
    const result = await this.notificationsService.getUnreadCount(user);
    return ApiResponse.ok(result);
  }

  @Post('batch-delete')
  @ApiOperation({ summary: 'Batch delete notifications' })
  async batchDelete(
    @Body() dto: BatchDeleteDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const result = await this.notificationsService.batchDelete(dto.ids, user);
    return ApiResponse.ok(result, 'Notifications deleted');
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@CurrentUser() user: AuthRequest['user']) {
    const result = await this.notificationsService.markAllAsRead(user);
    return ApiResponse.ok(result, 'All notifications marked as read');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiParam({ name: 'id', description: 'Notification UUID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const result = await this.notificationsService.findOne(id, user);
    return ApiResponse.ok(result);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({ name: 'id', description: 'Notification UUID' })
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const result = await this.notificationsService.markAsRead(id, user);
    return ApiResponse.ok(result, 'Notification marked as read');
  }
}
