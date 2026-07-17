import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List all products' })
  async findAll(@Query() pagination: PaginationDto) {
    return ApiResponse.ok(await this.service.findAll(pagination));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  async create(@Body() dto: CreateProductDto) {
    return ApiResponse.ok(await this.service.create(dto), 'Product created');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return ApiResponse.ok(await this.service.update(id, dto), 'Product updated');
  }
}