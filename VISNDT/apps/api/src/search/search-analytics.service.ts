/**
 * DiscoveryAnalyticsService — M23.0.3 Search Analytics Foundation
 *
 * Unified Discovery Observability Layer.
 * Records search events, result contexts, and interaction events
 * using the existing conversionEvent infrastructure.
 *
 * Architecture constraints:
 *   - Analytics ≠ Automatic Optimization (observe only)
 *   - AI ≠ Search Decision Maker (FROZEN)
 *   - Non-blocking fire-and-forget event recording
 *   - Schema: extends ConversionEventType enum only
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConversionEventType, Prisma } from '@prisma/client';
import type {
  SearchEvent,
  SearchResultContext,
  DiscoveryInteractionEvent,
  DiscoveryAnalyticsContext,
  SearchResultCount,
} from './search-analytics.types';

@Injectable()
export class DiscoveryAnalyticsService {
  private readonly logger = new Logger(DiscoveryAnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Public API ─────────────────────────────────────────────

  /**
   * Record a search submission event.
   * Non-blocking: fires and forgets, errors are logged but never thrown.
   */
  recordSearch(searchEvent: SearchEvent): void {
    this.fireAndForget(async () => {
      await this.prisma.conversionEvent.create({
        data: {
          event: 'SEARCH_SUBMITTED' as ConversionEventType,
          userId: searchEvent.sessionContext?.userId ?? null,
          organizationId: searchEvent.sessionContext?.organizationId ?? null,
          sessionId: searchEvent.sessionContext?.sessionId ?? null,
          source: searchEvent.source,
          metadata: {
            searchEventId: searchEvent.id,
            query: searchEvent.query,
            entityTypes: searchEvent.entityTypes,
            resultCount: searchEvent.resultCount,
            timestamp: searchEvent.timestamp.toISOString(),
          },
        },
      });
      this.logger.debug(
        `Search recorded: "${searchEvent.query}" (${searchEvent.resultCount} results)`,
      );
    }, 'recordSearch');
  }

  /**
   * Record a result viewed event — when search results are displayed.
   */
  recordResultView(
    searchEventId: string,
    resultCounts: SearchResultCount,
    source: string = 'web',
  ): void {
    this.fireAndForget(async () => {
      await this.prisma.conversionEvent.create({
        data: {
          event: 'RESULT_VIEWED' as ConversionEventType,
          source,
          sessionId: searchEventId,
          metadata: {
            searchEventId,
            products: resultCounts.products,
            // M28.0 M661.6 — SupplierProduct dimension in unified analytics
            supplierProducts: resultCounts.supplierProducts,
            knowledge: resultCounts.knowledge,
            content: resultCounts.content,
            solutions: resultCounts.solutions,
            suppliers: resultCounts.suppliers,
            total:
              resultCounts.products +
              resultCounts.supplierProducts +
              resultCounts.knowledge +
              resultCounts.content +
              resultCounts.solutions +
              resultCounts.suppliers,
          },
        },
      });
      this.logger.debug(`Result view recorded for search ${searchEventId}`);
    }, 'recordResultView');
  }

  /**
   * Record an entity clicked event — when a user clicks a search result.
   */
  recordEntityClick(
    searchEventId: string,
    context: SearchResultContext,
  ): void {
    this.fireAndForget(async () => {
      await this.prisma.conversionEvent.create({
        data: {
          event: 'ENTITY_CLICKED' as ConversionEventType,
          entityType: context.entityType,
          entityId: context.entityId,
          source: context.resultSource,
          sessionId: searchEventId,
          metadata: {
            searchEventId,
            position: context.position,
            viewContext: (context.viewContext ?? null) as unknown as Prisma.InputJsonValue,
          } as Prisma.InputJsonValue,
        },
      });
      this.logger.debug(
        `Entity click: ${context.entityType}/${context.entityId} (search ${searchEventId})`,
      );
    }, 'recordEntityClick');
  }

  /**
   * Record a detail opened event — when a user opens a detail page from search.
   */
  recordDetailOpen(
    searchEventId: string,
    context: SearchResultContext,
  ): void {
    this.fireAndForget(async () => {
      await this.prisma.conversionEvent.create({
        data: {
          event: 'DETAIL_OPENED' as ConversionEventType,
          entityType: context.entityType,
          entityId: context.entityId,
          source: context.resultSource,
          sessionId: searchEventId,
          metadata: {
            searchEventId,
            position: context.position,
            viewContext: (context.viewContext ?? null) as unknown as Prisma.InputJsonValue,
          } as Prisma.InputJsonValue,
        },
      });
      this.logger.debug(
        `Detail opened: ${context.entityType}/${context.entityId} (search ${searchEventId})`,
      );
    }, 'recordDetailOpen');
  }

  /**
   * Build a unified analytics context from search event + results + interactions.
   */
  buildAnalyticsContext(
    search: SearchEvent,
    results: SearchResultContext[],
    interactions: DiscoveryInteractionEvent[] = [],
  ): DiscoveryAnalyticsContext {
    return { search, results, interactions };
  }

  /**
   * Extract result counts from the UnifiedDiscoveryResponse shape.
   */
  extractResultCounts(result: {
    products?: { total?: number };
    // M28.0 M661.6 — SupplierProduct dimension in unified result counts
    supplierProducts?: { total?: number };
    knowledge?: { total?: number };
    content?: { total?: number };
    solutions?: { total?: number };
    suppliers?: { total?: number };
  }): SearchResultCount {
    return {
      products: result.products?.total ?? 0,
      supplierProducts: result.supplierProducts?.total ?? 0,
      knowledge: result.knowledge?.total ?? 0,
      content: result.content?.total ?? 0,
      solutions: result.solutions?.total ?? 0,
      suppliers: result.suppliers?.total ?? 0,
    };
  }

  // ─── Internal ───────────────────────────────────────────────

  /**
   * Execute an async operation without blocking the caller.
   * Errors are logged but never propagated.
   */
  private fireAndForget(
    fn: () => Promise<void>,
    label: string,
  ): void {
    fn().catch((error: Error) => {
      this.logger.warn(
        `Analytics ${label} failed (non-blocking): ${error.message}`,
      );
    });
  }
}