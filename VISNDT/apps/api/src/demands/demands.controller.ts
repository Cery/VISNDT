import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { DemandsService } from './demands.service';
import { CreateDemandDto } from './dto/create-demand.dto';
import { UpdateDemandDto } from './dto/update-demand.dto';
import { CreateDemandParameterDto } from './dto/create-demand-parameter.dto';
import { UpdateDemandParameterDto } from './dto/update-demand-parameter.dto';
import { SearchDemandDto } from './dto/search-demand.dto';
import { QueryMatchDto } from './dto/query-match.dto';
import { UpdateMatchStatusDto } from './dto/update-match-status.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

export class CloseDemandDto {
  @ApiPropertyOptional({ description: 'Reason for closing the demand' })
  @IsOptional()
  @IsString()
  reason?: string;
}

@ApiTags('Demands')
@Controller('demands')
export class DemandsController {
  constructor(private readonly service: DemandsService) {}

  // ==========================================
  // Demand CRUD
  // ==========================================

  @Get()
  @ApiOperation({ summary: 'Search demands (public). Supports keyword, status, sort, page, pageSize' })
  async findAll(@Query() query: SearchDemandDto) {
    return ApiResponse.ok(await this.service.findAll(query));
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my organization demands (authenticated)' })
  async findMy(
    @Query() pagination: PaginationDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.findMy(pagination, user));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get demand by ID (public, contact info protected)' })
  @ApiParam({ name: 'id', description: 'Demand UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new demand (authenticated)' })
  async create(
    @Body() dto: CreateDemandDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.create(dto, user), 'Demand created');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update demand (owner or org-scoped, authenticated)' })
  @ApiParam({ name: 'id', description: 'Demand UUID' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDemandDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.update(id, dto, user),
      'Demand updated',
    );
  }

  // ==========================================
  // Demand Lifecycle
  // ==========================================

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a demand (DRAFT → PUBLISHED)' })
  @ApiParam({ name: 'id', description: 'Demand UUID' })
  async publish(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.publish(id, user),
      'Demand published',
    );
  }

  @Post(':id/close')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Close a demand (PUBLISHED/PROCESSING → CLOSED)' })
  @ApiParam({ name: 'id', description: 'Demand UUID' })
  async close(
    @Param('id') id: string,
    @Body() dto: CloseDemandDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.close(id, dto.reason, user),
      'Demand closed',
    );
  }

  @Post(':id/rematch')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Re-match a demand (delete old matches, re-run matching)' })
  @ApiParam({ name: 'id', description: 'Demand UUID' })
  async rematch(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.rematch(id, user),
      'Rematch completed',
    );
  }

  // ==========================================
  // DemandParameter CRUD
  // ==========================================

  @Post(':id/parameters')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a parameter to a demand' })
  @ApiParam({ name: 'id', description: 'Demand UUID' })
  async addParameter(
    @Param('id') id: string,
    @Body() dto: CreateDemandParameterDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.addParameter(id, dto, user),
      'Parameter added',
    );
  }

  @Get(':id/parameters')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List parameters of a demand' })
  @ApiParam({ name: 'id', description: 'Demand UUID' })
  async getParameters(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.getParameters(id, user));
  }

  @Patch(':id/parameters/:paramId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a demand parameter' })
  @ApiParam({ name: 'id', description: 'Demand UUID' })
  @ApiParam({ name: 'paramId', description: 'DemandParameter UUID' })
  async updateParameter(
    @Param('id') id: string,
    @Param('paramId') paramId: string,
    @Body() dto: UpdateDemandParameterDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.updateParameter(id, paramId, dto, user),
      'Parameter updated',
    );
  }

  @Delete(':id/parameters/:paramId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a demand parameter' })
  @ApiParam({ name: 'id', description: 'Demand UUID' })
  @ApiParam({ name: 'paramId', description: 'DemandParameter UUID' })
  async deleteParameter(
    @Param('id') id: string,
    @Param('paramId') paramId: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.deleteParameter(id, paramId, user),
      'Parameter deleted',
    );
  }

  // ==========================================
  // DemandMatch Queries
  // ==========================================

  @Get(':id/matches')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List matches for a demand (org-scoped)' })
  @ApiParam({ name: 'id', description: 'Demand UUID' })
  async getMatches(
    @Param('id') id: string,
    @Query() query: QueryMatchDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.getDemandMatches(id, query, user));
  }

  @Get(':id/matches/:matchId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get match detail (org-scoped)' })
  @ApiParam({ name: 'id', description: 'Demand UUID' })
  @ApiParam({ name: 'matchId', description: 'DemandMatch UUID' })
  async getMatchDetail(
    @Param('id') id: string,
    @Param('matchId') matchId: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.getDemandMatchDetail(id, matchId, user),
    );
  }

  @Patch(':id/matches/:matchId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update match status (org-scoped). PENDING→MATCHED, MATCHED→REVIEWED, REVIEWED→ACCEPTED/REJECTED' })
  @ApiParam({ name: 'id', description: 'Demand UUID' })
  @ApiParam({ name: 'matchId', description: 'DemandMatch UUID' })
  async updateMatchStatus(
    @Param('id') id: string,
    @Param('matchId') matchId: string,
    @Body() dto: UpdateMatchStatusDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(
      await this.service.updateMatchStatus(id, matchId, dto, user),
      'Match status updated',
    );
  }
}