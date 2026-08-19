export { SearchModule } from './search.module';
export { SearchService } from './search.service';
export type { UnifiedDiscoveryResponse } from './search.service';
export { SearchContextService } from './search-context.service';
export type {
  SearchContextResponse,
  RelevantCategoryContext,
  ParameterFacet,
  FacetValue,
} from './search-context.types';
export { DiscoveryAnalyticsService } from './search-analytics.service';
export type {
  SearchEvent,
  SearchEventContext,
  SearchResultContext,
  DiscoveryInteractionEvent,
  DiscoveryInteractionEventType,
  DiscoveryAnalyticsContext,
  SearchResultCount,
  SearchSource,
} from './search-analytics.types';