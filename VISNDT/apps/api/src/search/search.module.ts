import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchContextService } from './search-context.service';
import { DiscoveryAnalyticsService } from './search-analytics.service';
import { SupplierModelFacetSearchService } from './supplier-model-facet-search.service';

@Module({
  imports: [PrismaModule],
  controllers: [SearchController],
  providers: [
    SearchService,
    SearchContextService,
    DiscoveryAnalyticsService,
    SupplierModelFacetSearchService,
  ],
})
export class SearchModule {}