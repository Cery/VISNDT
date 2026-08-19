import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AdminProductCategoryKnowledgeMappingService } from './admin-product-category-knowledge-mapping.service';
import { CreateProductCategoryKnowledgeMappingDto, UpdateProductCategoryKnowledgeMappingDto, UpdateMappingStatusDto } from './dto/product-category-knowledge-mapping.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Admin ProductCategoryKnowledgeMapping')
@Controller('admin/product-category-knowledge-mappings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminProductCategoryKnowledgeMappingController {
  constructor(
    private readonly service: AdminProductCategoryKnowledgeMappingService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all product-category-knowledge mappings (ADMIN)' })
  async findAll() {
    return ApiResponse.ok(await this.service.findAll());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get mapping by ID (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Mapping UUID' })
  async findById(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findById(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create product-category-knowledge mapping (ADMIN)' })
  async create(@Body() dto: CreateProductCategoryKnowledgeMappingDto) {
    return ApiResponse.ok(await this.service.create(dto), '产品分类-知识分类映射已创建');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update mapping sortOrder or isActive (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Mapping UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductCategoryKnowledgeMappingDto) {
    return ApiResponse.ok(await this.service.update(id, dto), '映射已更新');
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Enable/disable mapping (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Mapping UUID' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateMappingStatusDto) {
    return ApiResponse.ok(
      await this.service.updateStatus(id, dto.isActive),
      dto.isActive ? '映射已启用' : '映射已停用',
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete mapping (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Mapping UUID' })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return ApiResponse.ok(null, '映射已删除');
  }
}