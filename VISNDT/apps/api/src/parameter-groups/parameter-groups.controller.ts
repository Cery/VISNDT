import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ParameterGroupsService } from './parameter-groups.service';
import { CreateParameterGroupDto } from './dto/create-parameter-group.dto';
import { UpdateParameterGroupDto } from './dto/update-parameter-group.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Parameter Groups')
@Controller('parameter-groups')
export class ParameterGroupsController {
  constructor(private readonly service: ParameterGroupsService) {}

  @Get()
  @ApiOperation({ summary: 'List all parameter groups' })
  async findAll(@Query() pagination: PaginationDto) {
    return ApiResponse.ok(await this.service.findAll(pagination));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get parameter group by ID' })
  @ApiParam({ name: 'id', description: 'Parameter Group UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new parameter group' })
  async create(@Body() dto: CreateParameterGroupDto) {
    return ApiResponse.ok(await this.service.create(dto), 'ParameterGroup created');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update parameter group' })
  @ApiParam({ name: 'id', description: 'Parameter Group UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateParameterGroupDto) {
    return ApiResponse.ok(await this.service.update(id, dto), 'ParameterGroup updated');
  }
}