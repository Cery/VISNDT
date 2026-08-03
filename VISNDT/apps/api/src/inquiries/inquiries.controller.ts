import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { QueryInquiryDto } from './dto/query-inquiry.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('Inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly service: InquiriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create product inquiry' })
  async create(@Body() dto: CreateInquiryDto) {
    return ApiResponse.ok(await this.service.create(dto), 'Inquiry submitted');
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my organization inquiries (paginated)' })
  async getMyInquiries(
    @Query() query: QueryInquiryDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const { page = 1, pageSize = 20 } = query;
    const result = await this.service.getMyInquiries(user, page, pageSize);
    return ApiResponse.ok(result);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inquiry by ID' })
  @ApiParam({ name: 'id', description: 'Inquiry UUID' })
  async getInquiryById(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const result = await this.service.getInquiryById(id, user);
    return ApiResponse.ok(result);
  }
}