import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly service: OffersService) {}

  @Get()
  @ApiOperation({ summary: 'List all offers' })
  async findAll(@Query() pagination: PaginationDto) {
    return ApiResponse.ok(await this.service.findAll(pagination));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get offer by ID' })
  @ApiParam({ name: 'id', description: 'Offer UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new offer' })
  async create(@Body() dto: CreateOfferDto) {
    return ApiResponse.ok(await this.service.create(dto), 'Offer created');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update offer' })
  @ApiParam({ name: 'id', description: 'Offer UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateOfferDto) {
    return ApiResponse.ok(await this.service.update(id, dto), 'Offer updated');
  }
}