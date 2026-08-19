import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { randomUUID } from 'crypto';
import { SearchService } from './search.service';
import { SearchContextService } from './search-context.service';
import { DiscoveryAnalyticsService } from './search-analytics.service';
import { UnifiedSearchDto } from './dto/unified-search.dto';
import { SearchContextDto } from './dto/search-context.dto';
import type { SearchEvent } from './search-analytics.types';

/**
 * Unified Discovery API — M22.4.1
 *
 * Single public endpoint: GET /search?q={keyword}
 *
 * Architecture: 580_ADR-001/002/003
 *   - Unified Industrial Discovery Layer
 *   - Single-page unified discovery
 *   - KnowledgeEntry replaces Content(KNOWLEDGE) in search
 *
 * M23.0.3 Analytics Foundation:
 *   - Non-blocking analytics hook records search events
 *   - Does NOT modify response contract
 *   - Analytics ≠ Automatic Optimization
 */
@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly contextService: SearchContextService,
    private readonly analytics: DiscoveryAnalyticsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Unified Industrial Discovery',
    description: 'Search across Products, Knowledge, Content, Solutions, and Suppliers in a single unified endpoint.',
  })
  @ApiResponse({ status: 200, description: 'Unified discovery results across all entity types' })
  async search(@Query() dto: UnifiedSearchDto, @Req() req?: Request) {
    const result = await this.searchService.search(dto.q, dto.page, dto.pageSize, dto.category, dto.filters);

    // ─── M23.0.3 Analytics: non-blocking search event recording ───
    this.recordSearchAnalytics(dto.q, result, req);

    return result;
  }

  /**
   * M24.1.3 — Search Context API
   *
   * Query-Level Search Context, pagination-independent.
   * Based on full matching candidate population.
   *
   * Architecture: ADR-M24-009
   *   Search Context ≠ Search Result Page
   */
  @Get('context')
  @ApiOperation({
    summary: 'Search Context',
    description: 'Get query-level search context including relevant categories, parameter facets, and available values. Pagination-independent.',
  })
  @ApiResponse({ status: 200, description: 'Search context with categories and parameter facets' })
  async getContext(@Query() dto: SearchContextDto) {
    return this.contextService.getContext(dto.q);
  }

  // ─── Analytics Hook ──────────────────────────────────────────

  /**
   * Fire-and-forget analytics recording.
   * Does NOT modify the response or block the request.
   */
  private recordSearchAnalytics(
    query: string,
    result: Awaited<ReturnType<SearchService['search']>>,
    req?: Request,
  ): void {
    try {
      const searchEventId = randomUUID();
      const source = this.detectSource(req);
      const entityTypes = ['product', 'knowledge', 'content', 'solution', 'supplier'];
      const resultCounts = this.analytics.extractResultCounts(result);
      const totalCount =
        resultCounts.products +
        resultCounts.knowledge +
        resultCounts.content +
        resultCounts.solutions +
        resultCounts.suppliers;

      const searchEvent: SearchEvent = {
        id: searchEventId,
        query,
        source,
        timestamp: new Date(),
        entityTypes,
        resultCount: totalCount,
        sessionContext: {
          sessionId: this.extractSessionId(req),
        },
      };

      // Record search submission
      this.analytics.recordSearch(searchEvent);

      // Record result view
      this.analytics.recordResultView(searchEventId, resultCounts, source);
    } catch {
      // Silently ignore analytics errors — never affect the search response
    }
  }

  /**
   * Detect the source of the search request.
   */
  private detectSource(req?: Request): 'web' | 'admin' | 'api' | 'public' {
    if (!req) return 'public';
    const referer = (req.headers?.referer ?? '') as string;
    if (referer.includes('/admin')) return 'admin';
    if (referer.includes('/workspace')) return 'web';
    return 'public';
  }

  /**
   * Extract session identifier from request if available.
   */
  private extractSessionId(req?: Request): string | undefined {
    if (!req) return undefined;
    const header = (req.headers?.['x-session-id'] ?? req.headers?.['x-session-id'.toLowerCase()]) as string | undefined;
    return header ?? undefined;
  }
}