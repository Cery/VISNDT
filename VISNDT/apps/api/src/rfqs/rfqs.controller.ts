import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { RfqsService } from './rfqs.service';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { UpdateRfqDto } from './dto/update-rfq.dto';
import { SearchParamsDto } from '../common/dto/search-params.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { BatchDeleteDto } from '../common/dto/batch-delete.dto';
import { BatchStatusDto } from '../common/dto/batch-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('RFQs')
@Controller('rfqs')
export class RfqsController {
  constructor(private readonly service: RfqsService) {}

  @Get()
  @ApiOperation({ summary: 'List all RFQs' })
  async findAll(@Query() params: SearchParamsDto) {
    return ApiResponse.ok(await this.service.findAll(params));
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get RFQs for current supplier organization (paginated)' })
  async findMine(
    @CurrentUser() user: AuthRequest['user'],
    @Query() pagination: PaginationDto,
  ) {
    if (!user.organizationId) {
      return ApiResponse.ok({ data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 });
    }
    const { page = 1, pageSize = 20 } = pagination;
    return ApiResponse.ok(await this.service.findMine(user.organizationId, page, pageSize));
  }

  @Post('batch-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Batch delete RFQs (ADMIN only)' })
  @ApiBody({ type: BatchDeleteDto })
  async batchDelete(@Body() dto: BatchDeleteDto) {
    return ApiResponse.ok(await this.service.batchDelete(dto.ids), 'Batch delete completed');
  }

  @Patch('batch-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Batch update RFQ status (ADMIN only)' })
  @ApiBody({ type: BatchStatusDto })
  async batchStatus(@Body() dto: BatchStatusDto) {
    return ApiResponse.ok(await this.service.batchStatus(dto.ids, dto.status), 'Batch status updated');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get RFQ by ID' })
  @ApiParam({ name: 'id', description: 'RFQ UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new RFQ (authenticated)' })
  async create(
    @Body() dto: CreateRfqDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.create(dto, user), 'RFQ created');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update RFQ (authenticated, org-scoped)' })
  @ApiParam({ name: 'id', description: 'RFQ UUID' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRfqDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.update(id, dto, user), 'RFQ updated');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete RFQ (ADMIN only). Blocks if has responses.' })
  @ApiParam({ name: 'id', description: 'RFQ UUID' })
  async remove(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.remove(id), 'RFQ deleted');
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish RFQ (DRAFT → OPEN)' })
  @ApiParam({ name: 'id', description: 'RFQ UUID' })
  async publish(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.publish(id, user), 'RFQ published');
  }

  @Post(':id/close')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Close RFQ (OPEN → CLOSED)' })
  @ApiParam({ name: 'id', description: 'RFQ UUID' })
  async close(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.close(id, user), 'RFQ closed');
  }
}