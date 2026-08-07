import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { SearchParamsDto } from '../common/dto/search-params.dto';
import { BatchDeleteDto } from '../common/dto/batch-delete.dto';
import { BatchStatusDto } from '../common/dto/batch-status.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all organizations (ADMIN only)' })
  async findAll(@Query() params: SearchParamsDto) {
    const result = await this.orgsService.findAll(params);
    return ApiResponse.ok(result);
  }

  @Post('batch-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Batch delete organizations (ADMIN only)' })
  async batchDelete(@Body() dto: BatchDeleteDto) {
    return ApiResponse.ok(await this.orgsService.batchDelete(dto.ids), 'Batch delete completed');
  }

  @Patch('batch-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Batch update organization status (ADMIN only)' })
  async batchStatus(@Body() dto: BatchStatusDto) {
    return ApiResponse.ok(await this.orgsService.batchStatus(dto.ids, dto.status), 'Batch status updated');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public organization information' })
  @ApiParam({ name: 'id', description: 'Organization UUID' })
  async findOne(@Param('id') id: string) {
    const org = await this.orgsService.findOnePublic(id);
    return ApiResponse.ok(org);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new organization (ADMIN only)' })
  async create(@Body() dto: CreateOrganizationDto) {
    const org = await this.orgsService.create(dto);
    return ApiResponse.ok(org, 'Organization created');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update organization (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Organization UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    const org = await this.orgsService.update(id, dto);
    return ApiResponse.ok(org, 'Organization updated');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete organization (ADMIN only). Blocks if has users, offers, or demands.' })
  @ApiParam({ name: 'id', description: 'Organization UUID' })
  async remove(@Param('id') id: string) {
    return ApiResponse.ok(await this.orgsService.remove(id), 'Organization deleted');
  }
}