import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { KnowledgeService } from './knowledge.service';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Knowledge')
@Controller('knowledge')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class KnowledgeController {
  constructor(private readonly service: KnowledgeService) {}

  // ============================================
  // KnowledgeDomain Endpoints
  // ============================================

  @Get('domains')
  @ApiOperation({ summary: 'List all knowledge domains (ADMIN)' })
  async findAllDomains() {
    return ApiResponse.ok(await this.service.findAllDomains());
  }

  @Get('domains/:id')
  @ApiOperation({ summary: 'Get knowledge domain by ID (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Domain UUID' })
  async findDomainById(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findDomainById(id));
  }

  @Post('domains')
  @ApiOperation({ summary: 'Create knowledge domain (ADMIN)' })
  async createDomain(@Body() body: { name: string; slug: string; description?: string; parentId?: string; sortOrder?: number }) {
    return ApiResponse.ok(await this.service.createDomain(body), '知识领域已创建');
  }

  @Patch('domains/:id')
  @ApiOperation({ summary: 'Update knowledge domain (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Domain UUID' })
  async updateDomain(
    @Param('id') id: string,
    @Body() body: { name?: string; slug?: string; description?: string; parentId?: string | null; sortOrder?: number },
  ) {
    return ApiResponse.ok(await this.service.updateDomain(id, body), '知识领域已更新');
  }

  @Delete('domains/:id')
  @ApiOperation({ summary: 'Delete knowledge domain (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Domain UUID' })
  async deleteDomain(@Param('id') id: string) {
    await this.service.deleteDomain(id);
    return ApiResponse.ok(null, '知识领域已删除');
  }

  // ============================================
  // KnowledgeCategory Endpoints
  // ============================================

  @Get('categories')
  @ApiOperation({ summary: 'List all knowledge categories (ADMIN), optionally filtered by domain' })
  @ApiQuery({ name: 'domainId', required: false, description: 'Filter by domain UUID' })
  async findAllCategories(@Query('domainId') domainId?: string) {
    return ApiResponse.ok(await this.service.findAllCategories(domainId));
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get knowledge category by ID (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  async findCategoryById(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findCategoryById(id));
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create knowledge category (ADMIN)' })
  async createCategory(@Body() body: { domainId: string; name: string; slug: string; description?: string; sortOrder?: number }) {
    return ApiResponse.ok(await this.service.createCategory(body), '知识分类已创建');
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update knowledge category (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { name?: string; slug?: string; description?: string; domainId?: string; sortOrder?: number },
  ) {
    return ApiResponse.ok(await this.service.updateCategory(id, body), '知识分类已更新');
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete knowledge category (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  async deleteCategory(@Param('id') id: string) {
    await this.service.deleteCategory(id);
    return ApiResponse.ok(null, '知识分类已删除');
  }

  // ============================================
  // KnowledgeEntry Endpoints
  // ============================================

  @Get('entries')
  @ApiOperation({ summary: 'List all knowledge entries (ADMIN)' })
  @ApiQuery({ name: 'domainId', required: false, description: 'Filter by domain UUID' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category UUID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by title/summary' })
  async findAllEntries(
    @Query('domainId') domainId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return ApiResponse.ok(await this.service.findAllEntries({
      domainId,
      categoryId,
      status: status as any,
      search,
    }));
  }

  @Get('entries/:id')
  @ApiOperation({ summary: 'Get knowledge entry by ID (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Entry UUID' })
  async findEntryById(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findEntryById(id));
  }

  @Post('entries')
  @ApiOperation({ summary: 'Create knowledge entry (ADMIN)' })
  async createEntry(@Body() body: {
    domainId: string;
    categoryId: string;
    title: string;
    slug: string;
    summary?: string;
    structuredBody: any;
    authorId: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
  }) {
    return ApiResponse.ok(await this.service.createEntry(body), '知识条目已创建');
  }

  @Patch('entries/:id')
  @ApiOperation({ summary: 'Update knowledge entry (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Entry UUID' })
  async updateEntry(
    @Param('id') id: string,
    @Body() body: {
      domainId?: string;
      categoryId?: string;
      title?: string;
      slug?: string;
      summary?: string;
      structuredBody?: any;
      status?: string;
      seoTitle?: string;
      seoDescription?: string;
      seoKeywords?: string;
    },
  ) {
    return ApiResponse.ok(await this.service.updateEntry(id, {
      ...body,
      status: body.status as any,
    }), '知识条目已更新');
  }

  @Delete('entries/:id')
  @ApiOperation({ summary: 'Delete knowledge entry (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Entry UUID' })
  async deleteEntry(@Param('id') id: string) {
    await this.service.deleteEntry(id);
    return ApiResponse.ok(null, '知识条目已删除');
  }

  // ============================================
  // KnowledgeContentRef Endpoints
  // ============================================

  @Get('content-refs')
  @ApiOperation({ summary: 'List all content refs (ADMIN), optionally filtered by knowledge entry' })
  @ApiQuery({ name: 'knowledgeId', required: false, description: 'Filter by knowledge entry UUID' })
  async findAllContentRefs(@Query('knowledgeId') knowledgeId?: string) {
    return ApiResponse.ok(await this.service.findAllContentRefs(knowledgeId));
  }

  @Post('content-refs')
  @ApiOperation({ summary: 'Create content reference (ADMIN)' })
  async createContentRef(@Body() body: {
    knowledgeId: string;
    contentId: string;
    referenceType?: string;
    sortOrder?: number;
  }) {
    return ApiResponse.ok(await this.service.createContentRef({
      ...body,
      referenceType: body.referenceType as any,
    }), '内容引用已创建');
  }

  @Patch('content-refs/:id')
  @ApiOperation({ summary: 'Update content reference (ADMIN)' })
  @ApiParam({ name: 'id', description: 'ContentRef UUID' })
  async updateContentRef(
    @Param('id') id: string,
    @Body() body: { referenceType?: string; sortOrder?: number },
  ) {
    return ApiResponse.ok(await this.service.updateContentRef(id, {
      referenceType: body.referenceType as any,
      sortOrder: body.sortOrder,
    }), '内容引用已更新');
  }

  @Delete('content-refs/:id')
  @ApiOperation({ summary: 'Delete content reference (ADMIN)' })
  @ApiParam({ name: 'id', description: 'ContentRef UUID' })
  async deleteContentRef(@Param('id') id: string) {
    await this.service.deleteContentRef(id);
    return ApiResponse.ok(null, '内容引用已删除');
  }

  // ============================================
  // KnowledgeRelation Endpoints
  // ============================================

  @Get('relations')
  @ApiOperation({ summary: 'List all knowledge relations (ADMIN), optionally filtered by knowledge entry' })
  @ApiQuery({ name: 'knowledgeId', required: false, description: 'Filter by knowledge entry UUID' })
  async findAllRelations(@Query('knowledgeId') knowledgeId?: string) {
    return ApiResponse.ok(await this.service.findAllRelations(knowledgeId));
  }

  @Post('relations')
  @ApiOperation({ summary: 'Create knowledge relation (ADMIN)' })
  async createRelation(@Body() body: {
    sourceId: string;
    targetId: string;
    relationType: string;
    description?: string;
  }) {
    return ApiResponse.ok(await this.service.createRelation({
      ...body,
      relationType: body.relationType as any,
    }), '知识关联已创建');
  }

  @Delete('relations/:id')
  @ApiOperation({ summary: 'Delete knowledge relation (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Relation UUID' })
  async deleteRelation(@Param('id') id: string) {
    await this.service.deleteRelation(id);
    return ApiResponse.ok(null, '知识关联已删除');
  }
}