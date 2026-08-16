import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsReadController } from './analytics-read.controller';
import { AnalyticsReadService } from './analytics-read.service';

@Module({
  controllers: [AnalyticsController, AnalyticsReadController],
  providers: [AnalyticsService, AnalyticsReadService],
})
export class AnalyticsModule {}