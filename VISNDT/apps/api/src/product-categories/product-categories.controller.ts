import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { SearchParamsDto } from '../common/dto/search-params.dto';
import { BatchDeleteDto } from '../common/dto/batch-delete.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Product Categories')
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private readonly service: ProductCategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all product categories (public)' })
  async findAll(@Query() params: SearchParamsDto) {
    return ApiResponse.ok(await this.service.findAll(params));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product category by ID (public)' })
  @ApiParam({ name: 'id', description: 'Product Category UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product category (ADMIN only)' })
  async create(@Body() dto: CreateProductCategoryDto) {
    return ApiResponse.ok(await this.service.create(dto), 'ProductCategory created');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product category (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Product Category UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductCategoryDto) {
    return ApiResponse.ok(await this.service.update(id, dto), 'ProductCategory updated');
  }

  @Post('batch-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Batch delete product categories (ADMIN only). Blocks if any has products or child categories.' })
  async batchDelete(@Body() dto: BatchDeleteDto) {
    return ApiResponse.ok(await this.service.batchDelete(dto.ids), 'Batch delete completed');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product category (ADMIN only). Blocks if has products or child categories.' })
  @ApiParam({ name: 'id', description: 'Product Category UUID' })
  async remove(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.remove(id), 'ProductCategory deleted');
  }
}