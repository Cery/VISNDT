import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { RfqResponsesService } from './rfq-responses.service';
import { CreateRfqResponseDto } from './dto/create-rfq-response.dto';
import { UpdateRfqResponseDto } from './dto/update-rfq-response.dto';
import { DecideRfqResponseDto } from './dto/decide-rfq-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('RFQ Responses')
@Controller()
export class RfqResponsesController {
  constructor(private readonly service: RfqResponsesService) {}

  @Get('rfqs/:id/responses')
  @ApiOperation({ summary: 'List responses for an RFQ' })
  @ApiParam({ name: 'id', description: 'RFQ UUID' })
  async findByRfq(@Param('id') id: string, @Query() pagination: PaginationDto) {
    return ApiResponse.ok(await this.service.findByRfq(id, pagination));
  }

  @Post('rfqs/:id/responses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a response for an RFQ (authenticated)' })
  @ApiParam({ name: 'id', description: 'RFQ UUID' })
  async create(
    @Param('id') id: string,
    @Body() dto: CreateRfqResponseDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.create(id, dto, user), 'Response created');
  }

  @Get('rfq-responses/mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current organization RFQ responses (paginated)' })
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

  @Get('rfq-responses/:id')
  @ApiOperation({ summary: 'Get RFQ response by ID' })
  @ApiParam({ name: 'id', description: 'Response UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
  }

  @Post('rfq-responses/:id/view')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark RFQ response as viewed (buyer decision flow)' })
  @ApiParam({ name: 'id', description: 'Response UUID' })
  async view(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.view(id, user), 'Response viewed');
  }

  @Post('rfq-responses/:id/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept RFQ response (buyer decision flow)' })
  @ApiParam({ name: 'id', description: 'Response UUID' })
  @ApiBody({ type: DecideRfqResponseDto, required: false })
  async accept(
    @Param('id') id: string,
    @Body() dto: DecideRfqResponseDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.accept(id, dto, user), 'Response accepted');
  }

  @Post('rfq-responses/:id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject RFQ response (buyer decision flow)' })
  @ApiParam({ name: 'id', description: 'Response UUID' })
  @ApiBody({ type: DecideRfqResponseDto, required: false })
  async reject(
    @Param('id') id: string,
    @Body() dto: DecideRfqResponseDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.reject(id, dto, user), 'Response rejected');
  }

  @Patch('rfq-responses/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update RFQ response (authenticated)' })
  @ApiParam({ name: 'id', description: 'Response UUID' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRfqResponseDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.update(id, dto, user), 'Response updated');
  }
}
