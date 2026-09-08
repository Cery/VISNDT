import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { BatchDeleteDto } from '../common/dto/batch-delete.dto';
import { BatchStatusDto } from '../common/dto/batch-status.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Search products (public). Supports keyword, categoryId, status, parameterFilters (exact match or numeric range), sortBy, sortOrder, page, pageSize' })
  async findAll(@Query() query: SearchProductDto) {
    // 843 WP-8 Publication Boundary（Category A）：
    //   公开产品面 = Lifecycle-aware —— 仅暴露 ACTIVE（上架）平台产品。
    //   强制覆盖客户端传入的任何 status，确保 DRAFT(草稿)/INACTIVE(已下架) 绝不进入公开列表。
    //   不改 API 响应契约；返回字段形状不变，仅限定记录集合。
    query.status = 'ACTIVE';
    return ApiResponse.ok(await this.service.findAll(query));
  }

  @Post('batch-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Batch delete products (ADMIN only)' })
  async batchDelete(@Body() dto: BatchDeleteDto) {
    return ApiResponse.ok(await this.service.batchDelete(dto.ids), 'Batch delete completed');
  }

  @Patch('batch-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Batch update product status (ADMIN only)' })
  async batchStatus(@Body() dto: BatchStatusDto) {
    return ApiResponse.ok(await this.service.batchStatus(dto.ids, dto.status), 'Batch status updated');
  }

  @Get(':id/related-knowledge')
  @ApiOperation({ summary: 'Get related published knowledge for a product (public). Resolved via ProductCategory → ProductCategoryKnowledgeMapping → KnowledgeCategory → KnowledgeEntry' })
  @ApiParam({ name: 'id', description: 'Product UUID or slug' })
  async findRelatedKnowledge(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findRelatedKnowledge(id));
  }

  @Get(':id/related-products')
  @ApiOperation({ summary: 'Get related active products for a product (public). Resolved via same ProductCategory, excluding the current product' })
  @ApiParam({ name: 'id', description: 'Product UUID or slug' })
  async findRelatedProducts(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findRelatedProducts(id));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID or slug (public)' })
  @ApiParam({ name: 'id', description: 'Product UUID or slug' })
  async findOne(@Param('id') id: string) {
    // 843 WP-8 Publication Boundary（Category A）：
    //   公开产品详情 = Lifecycle-aware —— 仅暴露 ACTIVE（上架）平台产品；
    //   DRAFT(草稿)/INACTIVE(已下架) 在公开面视为不存在（404），不泄露未发布对象。
    //   不改 API 响应契约；服务端内部 findOne 使用（更新前校验等）不受影响。
    const product = await this.service.findOne(id);
    if (product.status !== 'ACTIVE') {
      throw new NotFoundException(`产品 ${id} 未找到`);
    }
    return ApiResponse.ok(product);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (ADMIN only)' })
  async create(@Body() dto: CreateProductDto, @CurrentUser() user: { id: string }) {
    return ApiResponse.ok(await this.service.create(dto, user.id), 'Product created');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return ApiResponse.ok(await this.service.update(id, dto), 'Product updated');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (ADMIN only). Cascades: media, parameter values, parameter associations. Blocks if has offers or demand matches. Use ?force=true to force cascade delete.' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  async remove(@Param('id') id: string, @Query('force') force?: string) {
    const forceBool = force === 'true';
    return ApiResponse.ok(await this.service.remove(id, forceBool), 'Product deleted');
  }
}