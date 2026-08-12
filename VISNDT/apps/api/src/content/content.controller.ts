import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { WorkflowEventsService } from '../workflow-events/workflow-events.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { QueryContentDto } from './dto/query-content.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(
    private readonly service: ContentService,
    private readonly workflowEventsService: WorkflowEventsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List content (ADMIN). Supports type & status filter, pagination' })
  async findAll(@Query() query: QueryContentDto) {
    return ApiResponse.ok(await this.service.findAll(query));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create content draft (ADMIN)' })
  async create(@Body() dto: CreateContentDto, @CurrentUser() user: { id: string }) {
    return ApiResponse.ok(await this.service.create(dto, user.id), '内容已创建');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update content (ADMIN, draft/review only)' })
  @ApiParam({ name: 'id', description: 'Content UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateContentDto, @CurrentUser() user: { id: string }) {
    return ApiResponse.ok(await this.service.update(id, dto, user.id), '内容已更新');
  }

  @Get('public')
  @ApiOperation({ summary: 'List published content (public). Supports type filter & pagination' })
  async findAllPublic(@Query() query: QueryContentDto) {
    return ApiResponse.ok(await this.service.findAllPublic(query));
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Get published content by slug (public)' })
  @ApiParam({ name: 'slug', description: 'Content slug' })
  async findOnePublic(@Param('slug') slug: string) {
    return ApiResponse.ok(await this.service.findPublishedBySlug(slug));
  }

  @Get('by-slug/:slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get content by slug (ADMIN)' })
  @ApiParam({ name: 'slug', description: 'Content slug' })
  async findBySlug(@Param('slug') slug: string) {
    return ApiResponse.ok(await this.service.findBySlug(slug));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get content by ID (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Content UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit content for review (DRAFT → REVIEW, ADMIN)' })
  async submit(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return ApiResponse.ok(await this.service.submit(id, user), '已提交审核');
  }

  @Post(':id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve review (REVIEW → PUBLISHED, ADMIN)' })
  async review(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return ApiResponse.ok(await this.service.review(id, user), '审核通过');
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish content (REVIEW → PUBLISHED, ADMIN)' })
  async publish(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return ApiResponse.ok(await this.service.publish(id, user), '已发布');
  }

  @Post(':id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archive content (PUBLISHED → ARCHIVED, ADMIN)' })
  async archive(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return ApiResponse.ok(await this.service.archive(id, user), '已归档');
  }

  @Get(':id/approval-timeline')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get content approval timeline (ADMIN, from WorkflowEvent)' })
  @ApiParam({ name: 'id', description: 'Content UUID' })
  async approvalTimeline(@Param('id') id: string) {
    return ApiResponse.ok(await this.workflowEventsService.findContentTimeline(id));
  }
}