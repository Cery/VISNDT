import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { RfqResponsesService } from './rfq-responses.service';
import { CreateRfqResponseDto } from './dto/create-rfq-response.dto';
import { UpdateRfqResponseDto } from './dto/update-rfq-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('RFQ Responses')
@Controller()
export class RfqResponsesController {
  constructor(private readonly service: RfqResponsesService) {}

  @Get('rfqs/:id/responses')
  @ApiOperation({ summary: 'List responses for an RFQ' })
  @ApiParam({ name: 'id', description: 'RFQ UUID' })
  async findByRfq(@Param('id') id: string, @Query() pagination: PaginationDto) {
    return ApiResponse.ok(await this.service.findByRfq(id, pagination));
  }

  @Post('rfqs/:id/responses')
  @ApiOperation({ summary: 'Create a response for an RFQ' })
  @ApiParam({ name: 'id', description: 'RFQ UUID' })
  async create(@Param('id') id: string, @Body() dto: CreateRfqResponseDto) {
    return ApiResponse.ok(await this.service.create(id, dto), 'Response created');
  }

  @Get('rfq-responses/:id')
  @ApiOperation({ summary: 'Get RFQ response by ID' })
  @ApiParam({ name: 'id', description: 'Response UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Patch('rfq-responses/:id')
  @ApiOperation({ summary: 'Update RFQ response' })
  @ApiParam({ name: 'id', description: 'Response UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateRfqResponseDto) {
    return ApiResponse.ok(await this.service.update(id, dto), 'Response updated');
  }
}