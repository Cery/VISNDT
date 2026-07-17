import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { RfqsService } from './rfqs.service';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { UpdateRfqDto } from './dto/update-rfq.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('RFQs')
@Controller('rfqs')
export class RfqsController {
  constructor(private readonly service: RfqsService) {}

  @Get()
  @ApiOperation({ summary: 'List all RFQs' })
  async findAll(@Query() pagination: PaginationDto) {
    return ApiResponse.ok(await this.service.findAll(pagination));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get RFQ by ID' })
  @ApiParam({ name: 'id', description: 'RFQ UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new RFQ' })
  async create(@Body() dto: CreateRfqDto) {
    return ApiResponse.ok(await this.service.create(dto), 'RFQ created');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update RFQ' })
  @ApiParam({ name: 'id', description: 'RFQ UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateRfqDto) {
    return ApiResponse.ok(await this.service.update(id, dto), 'RFQ updated');
  }
}