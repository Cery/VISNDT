import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ProductParametersService } from './product-parameters.service';
import { SetProductParameterDto } from './dto/set-product-parameter.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Product Parameters')
@Controller('products/:id/parameters')
export class ProductParametersController {
  constructor(private readonly service: ProductParametersService) {}

  @Get()
  @ApiOperation({ summary: 'List parameters of a product (public)' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  async findByProduct(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findByProduct(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set a parameter for a product (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  async set(@Param('id') id: string, @Body() dto: SetProductParameterDto) {
    return ApiResponse.ok(await this.service.set(id, dto), 'Product parameter set');
  }
}