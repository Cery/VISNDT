import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
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

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID or slug (public)' })
  @ApiParam({ name: 'id', description: 'Product UUID or slug' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
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