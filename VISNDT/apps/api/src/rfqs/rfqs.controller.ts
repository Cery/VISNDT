import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { RfqsService } from './rfqs.service';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { UpdateRfqDto } from './dto/update-rfq.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('RFQs')
@Controller('rfqs')
export class RfqsController {
  constructor(private readonly service: RfqsService) {}

  @Get()
  @ApiOperation({ summary: 'List all RFQs' })
  async findAll(@Query() pagination: PaginationDto) {
    return ApiResponse.ok(await this.service.findAll(pagination));
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get RFQs for current supplier organization' })
  async findMine(@CurrentUser() user: AuthRequest['user']) {
    if (!user.organizationId) {
      return ApiResponse.ok({ data: [], total: 0 });
    }
    return ApiResponse.ok(await this.service.findMine(user.organizationId));
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