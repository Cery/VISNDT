import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ParameterDefinitionsService } from './parameter-definitions.service';
import { CreateParameterDefinitionDto } from './dto/create-parameter-definition.dto';
import { UpdateParameterDefinitionDto } from './dto/update-parameter-definition.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
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
  async findAll(@Query() pagination: PaginationDto) {
    return ApiResponse.ok(await this.service.findAll(pagination));
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
}