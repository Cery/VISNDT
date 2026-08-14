import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ContentTagService } from './content-tag.service';
import { CreateContentTagDto } from './dto/create-content-tag.dto';
import { UpdateContentTagDto } from './dto/update-content-tag.dto';
import { AssignContentTagDto } from './dto/assign-content-tag.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Content Tags')
@Controller('content')
export class ContentTagController {
  constructor(private readonly service: ContentTagService) {}

  // ── Public endpoints ──────────────────────────────────────────

  @Get('tags')
  @ApiOperation({ summary: 'List all tags (public)' })
  async findAll() {
    return ApiResponse.ok(await this.service.findAll());
  }

  @Get('tags/:slug')
  @ApiOperation({ summary: 'Get tag by slug (public)' })
  @ApiParam({ name: 'slug', description: 'Tag slug' })
  async findBySlug(@Param('slug') slug: string) {
    return ApiResponse.ok(await this.service.findBySlug(slug));
  }

  // ── Admin: Tag CRUD ───────────────────────────────────────────

  @Post('tags')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a tag (ADMIN only)' })
  async create(@Body() dto: CreateContentTagDto) {
    return ApiResponse.ok(await this.service.create(dto), '标签已创建');
  }

  @Patch('tags/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a tag (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Tag UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateContentTagDto) {
    return ApiResponse.ok(await this.service.update(id, dto), '标签已更新');
  }

  @Delete('tags/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a tag (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Tag UUID' })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return ApiResponse.ok(null, '标签已删除');
  }

  // ── Admin: Content–Tag relations ──────────────────────────────

  @Post(':id/tags')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign a tag to a content (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Content UUID' })
  async assignTag(
    @Param('id') contentId: string,
    @Body() dto: AssignContentTagDto,
  ) {
    return ApiResponse.ok(
      await this.service.assignTag(contentId, dto.tagId),
      '标签已关联',
    );
  }

  @Delete(':id/tags/:tagId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a tag from a content (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Content UUID' })
  @ApiParam({ name: 'tagId', description: 'Tag UUID' })
  async removeTag(
    @Param('id') contentId: string,
    @Param('tagId') tagId: string,
  ) {
    await this.service.removeTag(contentId, tagId);
    return ApiResponse.ok(null, '标签已取消关联');
  }

  @Get(':id/tags')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tags for a content (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Content UUID' })
  async getContentTags(@Param('id') contentId: string) {
    return ApiResponse.ok(await this.service.getContentTags(contentId));
  }
}