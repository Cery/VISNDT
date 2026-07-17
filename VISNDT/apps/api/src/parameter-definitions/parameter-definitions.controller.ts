import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ParameterDefinitionsService } from './parameter-definitions.service';
import { CreateParameterDefinitionDto } from './dto/create-parameter-definition.dto';
import { UpdateParameterDefinitionDto } from './dto/update-parameter-definition.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Parameter Definitions')
@Controller('parameter-definitions')
export class ParameterDefinitionsController {
  constructor(private readonly service: ParameterDefinitionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all parameter definitions' })
  async findAll(@Query() pagination: PaginationDto) {
    return ApiResponse.ok(await this.service.findAll(pagination));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get parameter definition by ID' })
  @ApiParam({ name: 'id', description: 'Parameter Definition UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new parameter definition' })
  async create(@Body() dto: CreateParameterDefinitionDto) {
    return ApiResponse.ok(await this.service.create(dto), 'ParameterDefinition created');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update parameter definition' })
  @ApiParam({ name: 'id', description: 'Parameter Definition UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateParameterDefinitionDto) {
    return ApiResponse.ok(await this.service.update(id, dto), 'ParameterDefinition updated');
  }
}