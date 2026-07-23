import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all organizations (ADMIN only)' })
  async findAll(@Query() pagination: PaginationDto) {
    const result = await this.orgsService.findAll(pagination);
    return ApiResponse.ok(result);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organization by ID (own org or ADMIN)' })
  @ApiParam({ name: 'id', description: 'Organization UUID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const org = await this.orgsService.findOne(id, user);
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
}