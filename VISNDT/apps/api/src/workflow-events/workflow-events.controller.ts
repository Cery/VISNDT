import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowEventsService } from './workflow-events.service';
import { CreateWorkflowEventDto } from './dto/create-workflow-event.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('Workflow Events')
@Controller('workflow-events')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkflowEventsController {
  constructor(private readonly service: WorkflowEventsService) {}

  @Get()
  @ApiOperation({ summary: 'List workflow events' })
  async findAll(@Query() pagination: PaginationDto) {
    return ApiResponse.ok(await this.service.findAll(pagination));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow event by ID' })
  @ApiParam({ name: 'id', description: 'Event UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Post()
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a workflow event (authenticated)' })
  async create(
    @Body() dto: CreateWorkflowEventDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.create(dto, user), 'Event created');
  }
}