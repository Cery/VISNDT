import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ParameterGroupsService } from './parameter-groups.service';
import { CreateParameterGroupDto } from './dto/create-parameter-group.dto';
import { UpdateParameterGroupDto } from './dto/update-parameter-group.dto';
import { SearchParamsDto } from '../common/dto/search-params.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { BatchDeleteDto } from '../common/dto/batch-delete.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Parameter Groups')
@Controller('parameter-groups')
export class ParameterGroupsController {
  constructor(private readonly service: ParameterGroupsService) {}

  @Get()
  @ApiOperation({ summary: 'List all parameter groups (public)' })
  async findAll(@Query() params: SearchParamsDto) {
    return ApiResponse.ok(await this.service.findAll(params));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get parameter group by ID (public)' })
  @ApiParam({ name: 'id', description: 'Parameter Group UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new parameter group (ADMIN only)' })
  async create(@Body() dto: CreateParameterGroupDto) {
    return ApiResponse.ok(await this.service.create(dto), 'ParameterGroup created');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update parameter group (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Parameter Group UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateParameterGroupDto) {
    return ApiResponse.ok(await this.service.update(id, dto), 'ParameterGroup updated');
  }

  @Post('batch-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Batch delete parameter groups (ADMIN only). Skips groups that have definitions.' })
  async batchDelete(@Body() dto: BatchDeleteDto) {
    return ApiResponse.ok(await this.service.batchDelete(dto), 'ParameterGroups batch deleted');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete parameter group (ADMIN only). Blocks if has parameter definitions.' })
  @ApiParam({ name: 'id', description: 'Parameter Group UUID' })
  async remove(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.remove(id), 'ParameterGroup deleted');
  }
}