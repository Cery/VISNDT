import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly service: InquiriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create product inquiry' })
  async create(@Body() dto: CreateInquiryDto) {
    return ApiResponse.ok(await this.service.create(dto), 'Inquiry submitted');
  }
}