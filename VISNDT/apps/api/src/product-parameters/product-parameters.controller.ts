import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ProductParametersService } from './product-parameters.service';
import { SetProductParameterDto } from './dto/set-product-parameter.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Product Parameters')
@Controller('products/:id/parameters')
export class ProductParametersController {
  constructor(private readonly service: ProductParametersService) {}

  @Get()
  @ApiOperation({ summary: 'List parameters of a product' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  async findByProduct(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findByProduct(id));
  }

  @Post()
  @ApiOperation({ summary: 'Set a parameter for a product' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  async set(@Param('id') id: string, @Body() dto: SetProductParameterDto) {
    return ApiResponse.ok(await this.service.set(id, dto), 'Product parameter set');
  }
}