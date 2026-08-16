import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { SemanticService } from './semantic.service';
import { SemanticController } from './semantic.controller';
import { SemanticQueryService } from './semantic-query.service';
import { SemanticQueryController } from './semantic-query.controller';
import { RetrievalService } from './retrieval.service';
import { RankingService } from './ranking.service';
import { UnifiedSearchService } from './unified-search.service';
import { EmbeddingCacheService } from './embedding-cache.service';

/**
 * SemanticModule — M21.4.7 Unified Search Ranking Foundation
 *
 * Complete Semantic Intelligence Layer backend infrastructure.
 * This module is INDEPENDENT of business modules (Content, Product, Matching, etc.)
 *
 * Architecture:
 *   SemanticModule
 *     ├── UnifiedSearchService      — orchestration: Retrieval → Ranking → Unified (M21.4.7)
 *     ├── SemanticQueryService      — unified query + ranking pipeline (M21.4.4/M21.4.6)
 *     ├── RetrievalService          — pgvector similarity queries (M21.4.3/M21.4.5)
 *     ├── RankingService            — retrieval → ranked result conversion (M21.4.6)
 *     ├── EmbeddingCacheService     — query embedding in-memory cache
 *     ├── SemanticController        — health/status endpoints
 *     └── SemanticQueryController   — internal query API
 *
 * M21.4 Semantic Intelligence Layer: 3/3 P0 GAPs, 4/4 P1 GAPs — ALL RESOLVED.
 * M21.4 CLOSED.
 */
@Module({
  imports: [PrismaModule, EmbeddingModule],
  controllers: [SemanticController, SemanticQueryController],
  providers: [
    SemanticService,
    SemanticQueryService,
    RetrievalService,
    RankingService,
    UnifiedSearchService,
    EmbeddingCacheService,
  ],
  exports: [
    SemanticService,
    SemanticQueryService,
    RetrievalService,
    RankingService,
    UnifiedSearchService,
  ],
})
export class SemanticModule {}