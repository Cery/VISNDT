import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { DiscoveryAnalyticsService } from './search-analytics.service';

@Module({
  imports: [PrismaModule],
  controllers: [SearchController],
  providers: [SearchService, DiscoveryAnalyticsService],
})
export class SearchModule {}