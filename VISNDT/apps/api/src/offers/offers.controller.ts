import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { SearchParamsDto } from '../common/dto/search-params.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { BatchDeleteDto } from '../common/dto/batch-delete.dto';
import { BatchStatusDto } from '../common/dto/batch-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('Offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly service: OffersService) {}

  @Get()
  @ApiOperation({ summary: 'List all offers' })
  async findAll(@Query() params: SearchParamsDto) {
    return ApiResponse.ok(await this.service.findAll(params));
  }

  @Post('batch-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Batch delete offers (ADMIN only)' })
  @ApiBody({ type: BatchDeleteDto })
  async batchDelete(@Body() dto: BatchDeleteDto) {
    return ApiResponse.ok(await this.service.batchDelete(dto.ids), 'Batch delete completed');
  }

  @Patch('batch-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Batch update offer status (ADMIN only)' })
  @ApiBody({ type: BatchStatusDto })
  async batchStatus(@Body() dto: BatchStatusDto) {
    return ApiResponse.ok(await this.service.batchStatus(dto.ids, dto.status), 'Batch status updated');
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get offer by ID (owner org or ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Offer UUID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.findOne(id, user));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new offer (authenticated)' })
  async create(
    @Body() dto: CreateOfferDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.create(dto, user), 'Offer created');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update offer (authenticated, org-scoped)' })
  @ApiParam({ name: 'id', description: 'Offer UUID' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOfferDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.update(id, dto, user), 'Offer updated');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete offer (ADMIN only). Blocks if has inquiries or demand matches.' })
  @ApiParam({ name: 'id', description: 'Offer UUID' })
  async remove(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.remove(id), 'Offer deleted');
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit offer (DRAFT → SUBMITTED)' })
  @ApiParam({ name: 'id', description: 'Offer UUID' })
  async submit(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.submit(id, user), 'Offer submitted');
  }

  @Post(':id/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept offer (SUBMITTED → ACCEPTED)' })
  @ApiParam({ name: 'id', description: 'Offer UUID' })
  async accept(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.accept(id, user), 'Offer accepted');
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject offer (SUBMITTED → REJECTED)' })
  @ApiParam({ name: 'id', description: 'Offer UUID' })
  async reject(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.reject(id, user), 'Offer rejected');
  }

  @Post(':id/withdraw')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Withdraw offer (SUBMITTED → WITHDRAWN)' })
  @ApiParam({ name: 'id', description: 'Offer UUID' })
  async withdraw(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    return ApiResponse.ok(await this.service.withdraw(id, user), 'Offer withdrawn');
  }
}