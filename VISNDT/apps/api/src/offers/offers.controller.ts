import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('Offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly service: OffersService) {}

  @Get()
  @ApiOperation({ summary: 'List all offers' })
  async findAll(@Query() pagination: PaginationDto) {
    return ApiResponse.ok(await this.service.findAll(pagination));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get offer by ID' })
  @ApiParam({ name: 'id', description: 'Offer UUID' })
  async findOne(@Param('id') id: string) {
    return ApiResponse.ok(await this.service.findOne(id));
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