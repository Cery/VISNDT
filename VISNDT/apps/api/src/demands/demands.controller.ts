import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { DemandsService } from './demands.service';
import { CreateDemandDto } from './dto/create-demand.dto';
import { UpdateDemandDto } from './dto/update-demand.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Demands')
@Controller('demands')
export class DemandsController {
  constructor(private readonly service: DemandsService) {}

  @Get()
  @ApiOperation({ summary: 'List all demands' })
  async findAll(@Query() pagination: PaginationDto) {
    return ApiResponse.ok(await this.service.findAll(pagination));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get demand by ID' })
  @ApiParam({ name: 'id', description: 'Demand UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new demand' })
  async create(@Body() dto: CreateDemandDto) {
    return ApiResponse.ok(await this.service.create(dto), 'Demand created');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update demand' })
  @ApiParam({ name: 'id', description: 'Demand UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateDemandDto) {
    return ApiResponse.ok(await this.service.update(id, dto), 'Demand updated');
  }
}