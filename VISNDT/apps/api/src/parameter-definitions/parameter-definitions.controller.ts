import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ParameterDefinitionsService } from './parameter-definitions.service';
import { CreateParameterDefinitionDto } from './dto/create-parameter-definition.dto';
import { UpdateParameterDefinitionDto } from './dto/update-parameter-definition.dto';
import { SearchParamsDto } from '../common/dto/search-params.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { BatchDeleteDto } from '../common/dto/batch-delete.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Parameter Definitions')
@Controller('parameter-definitions')
export class ParameterDefinitionsController {
  constructor(private readonly service: ParameterDefinitionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all parameter definitions (public)' })
  async findAll(@Query() params: SearchParamsDto) {
    return ApiResponse.ok(await this.service.findAll(params));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get parameter definition by ID (public)' })
  @ApiParam({ name: 'id', description: 'Parameter Definition UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new parameter definition (ADMIN only)' })
  async create(@Body() dto: CreateParameterDefinitionDto) {
    return ApiResponse.ok(await this.service.create(dto), 'ParameterDefinition created');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update parameter definition (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Parameter Definition UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateParameterDefinitionDto) {
    return ApiResponse.ok(await this.service.update(id, dto), 'ParameterDefinition updated');
  }

  @Post('batch-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Batch delete parameter definitions (ADMIN only). Skips definitions that have product associations.' })
  async batchDelete(@Body() dto: BatchDeleteDto) {
    return ApiResponse.ok(await this.service.batchDelete(dto), 'ParameterDefinitions batch deleted');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete parameter definition (ADMIN only). Blocks if associated with products.' })
  @ApiParam({ name: 'id', description: 'Parameter Definition UUID' })
  async remove(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.remove(id), 'ParameterDefinition deleted');
  }
}