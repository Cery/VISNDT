import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { ListSupplierDto } from './dto/list-supplier.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('Suppliers')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly service: SuppliersService) {}

  @Get()
  @ApiOperation({
    summary: 'List supplier organizations',
    description:
      'Returns all organizations with type="supplier". Supports optional keyword search by name.',
  })
  async findAll(@Query() query: ListSupplierDto) {
    return ApiResponse.ok(await this.service.findAll(query));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get supplier detail',
    description:
      'Returns supplier organization info including product count, offer count, and match count.',
  })
  @ApiParam({ name: 'id', description: 'Supplier organization ID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Get(':id/products')
  @ApiOperation({
    summary: 'List supplier products',
    description:
      'Returns all products offered by this supplier (via Offer model). Includes product info, category, and offer status.',
  })
  @ApiParam({ name: 'id', description: 'Supplier organization ID' })
  async findProducts(
    @Param('id') id: string,
    @Query() pagination: PaginationDto,
  ) {
    return ApiResponse.ok(await this.service.findProducts(id, pagination));
  }

  @Get(':id/matches')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List supplier demand matches (authenticated)',
    description:
      'Returns all demand matches for this supplier\'s offers. Requires JWT authentication and the current user must belong to this supplier organization.',
  })
  @ApiParam({ name: 'id', description: 'Supplier organization ID' })
  async findMatches(
    @Param('id') id: string,
    @Query() pagination: PaginationDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.findMatches(id, user?.organizationId ?? undefined, pagination),
    );
  }
}