import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all organizations' })
  async findAll(@Query() pagination: PaginationDto) {
    const result = await this.orgsService.findAll(pagination);
    return ApiResponse.ok(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiParam({ name: 'id', description: 'Organization UUID' })
  async findOne(@Param('id') id: string) {
    const org = await this.orgsService.findOne(id);
    return ApiResponse.ok(org);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  async create(@Body() dto: CreateOrganizationDto) {
    const org = await this.orgsService.create(dto);
    return ApiResponse.ok(org, 'Organization created');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization' })
  @ApiParam({ name: 'id', description: 'Organization UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    const org = await this.orgsService.update(id, dto);
    return ApiResponse.ok(org, 'Organization updated');
  }
}