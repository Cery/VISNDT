import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Product Categories')
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private readonly service: ProductCategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all product categories' })
  async findAll(@Query() pagination: PaginationDto) {
    return ApiResponse.ok(await this.service.findAll(pagination));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product category by ID' })
  @ApiParam({ name: 'id', description: 'Product Category UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product category' })
  async create(@Body() dto: CreateProductCategoryDto) {
    return ApiResponse.ok(await this.service.create(dto), 'ProductCategory created');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product category' })
  @ApiParam({ name: 'id', description: 'Product Category UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductCategoryDto) {
    return ApiResponse.ok(await this.service.update(id, dto), 'ProductCategory updated');
  }
}