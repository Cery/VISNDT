import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { WorkflowEventsService } from './workflow-events.service';
import { CreateWorkflowEventDto } from './dto/create-workflow-event.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Workflow Events')
@Controller('workflow-events')
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
  @ApiOperation({ summary: 'Create a workflow event' })
  async create(@Body() dto: CreateWorkflowEventDto) {
    return ApiResponse.ok(await this.service.create(dto), 'Event created');
  }
}