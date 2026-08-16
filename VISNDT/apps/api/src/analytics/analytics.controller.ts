import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsEventsDto } from './dto/create-analytics-events.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  @HttpCode(HttpStatus.OK)
  async createEvents(@Body() dto: CreateAnalyticsEventsDto) {
    return this.analyticsService.createMany(dto.events);
  }
}