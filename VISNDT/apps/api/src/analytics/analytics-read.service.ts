import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import type {
  DashboardResponse,
  DashboardSummary,
  TrendPoint,
  TopEntity,
  StatisticsResponse,
  EventsListResponse,
  EventListItem,
} from './dto/analytics-response.dto';
import type { AnalyticsQueryDto, AnalyticsEventsQueryDto, DashboardQueryDto } from './dto/analytics-query.dto';

interface TrendRow {
  date: string;
  page_views: number;
  product_views: number;
  content_views: number;
  searches: number;
  inquiries: number;
  cta_clicks: number;
}

@Injectable()
export class AnalyticsReadService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Dashboard ────────────────────────────────────────────────

  async getDashboard(query?: DashboardQueryDto): Promise<DashboardResponse> {
    const from = query?.from ? new Date(query.from) : undefined;
    const to = query?.to ? new Date(query.to) : undefined;

    const timeWhere = this.buildTimeWhere(from, to);

    const [summary, trend, topProducts, topContent] = await Promise.all([
      this.getSummary(timeWhere),
      this.getTrend(timeWhere),
      this.getTopEntities('product', 10, timeWhere),
      this.getTopEntities('content', 10, timeWhere),
    ]);

    return { summary, trend, topProducts, topContent };
  }

  // ─── Summary ──────────────────────────────────────────────────

  private buildTimeWhere(from?: Date, to?: Date): Prisma.ConversionEventWhereInput {
    const where: Prisma.ConversionEventWhereInput = {};
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = from;
      if (to) where.createdAt.lte = to;
    }
    return where;
  }

  private async getSummary(
    timeWhere: Prisma.ConversionEventWhereInput,
  ): Promise<DashboardSummary> {
    const result = await this.prisma.conversionEvent.groupBy({
      by: ['event'],
      where: timeWhere,
      _count: { id: true },
    });

    const counts: Record<string, number> = {};
    for (const row of result) {
      counts[row.event] = row._count.id;
    }

    return {
      totalPageViews: counts.PAGE_VIEW ?? 0,
      totalProductViews: (counts.PRODUCT_VIEW ?? 0) + (counts.PRODUCT_FILTER ?? 0),
      totalContentViews: counts.CONTENT_VIEW ?? 0,
      totalSearches: counts.SEARCH ?? 0,
      totalInquiries: (counts.INQUIRY_START ?? 0) + (counts.INQUIRY_SUBMIT ?? 0),
    };
  }

  // ─── Trend (DB-level DATE_TRUNC aggregation) ──────────────────

  private async getTrend(
    timeWhere: Prisma.ConversionEventWhereInput,
  ): Promise<TrendPoint[]> {
    const from = timeWhere.createdAt && 'gte' in (timeWhere.createdAt as object)
      ? (timeWhere.createdAt as { gte?: Date }).gte
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const to = timeWhere.createdAt && 'lte' in (timeWhere.createdAt as object)
      ? (timeWhere.createdAt as { lte?: Date }).lte
      : new Date();

    const rows = await this.prisma.$queryRawUnsafe<TrendRow[]>(
      `SELECT
        to_char(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS date,
        COUNT(*) FILTER (WHERE event = 'PAGE_VIEW')::int AS page_views,
        COUNT(*) FILTER (WHERE event IN ('PRODUCT_VIEW', 'PRODUCT_FILTER'))::int AS product_views,
        COUNT(*) FILTER (WHERE event = 'CONTENT_VIEW')::int AS content_views,
        COUNT(*) FILTER (WHERE event = 'SEARCH')::int AS searches,
        COUNT(*) FILTER (WHERE event IN ('INQUIRY_START', 'INQUIRY_SUBMIT'))::int AS inquiries,
        COUNT(*) FILTER (WHERE event = 'CTA_CLICK')::int AS cta_clicks
      FROM conversion_event
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date ASC`,
      from,
      to,
    );

    return rows.map((r) => ({
      date: r.date,
      pageViews: r.page_views,
      productViews: r.product_views,
      contentViews: r.content_views,
      searches: r.searches,
      inquiries: r.inquiries,
      ctaClicks: r.cta_clicks,
    }));
  }

  // ─── Top Entities (with name resolution) ──────────────────────

  private async getTopEntities(
    entityType: string,
    limit: number,
    timeWhere: Prisma.ConversionEventWhereInput,
  ): Promise<TopEntity[]> {
    const rows = await this.prisma.conversionEvent.groupBy({
      by: ['entityId'],
      where: {
        entityType,
        entityId: { not: null },
        ...timeWhere,
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    const ids = rows.map((r) => r.entityId!).filter(Boolean);
    const nameMap = await this.resolveEntityNames(entityType, ids);

    return rows.map((r) => ({
      id: r.entityId!,
      name: nameMap.get(r.entityId!) ?? r.entityId!,
      views: r._count.id,
    }));
  }

  private async resolveEntityNames(
    entityType: string,
    ids: string[],
  ): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    if (ids.length === 0) return map;

    if (entityType === 'product') {
      const products = await this.prisma.product.findMany({
        where: { id: { in: ids } },
        select: { id: true, name: true },
      });
      for (const p of products) map.set(p.id, p.name);
    } else {
      // content: knowledge, solution, article, insight
      const contents = await this.prisma.content.findMany({
        where: { id: { in: ids } },
        select: { id: true, title: true },
      });
      for (const c of contents) map.set(c.id, c.title);
    }

    return map;
  }

  // ─── Statistics (with DATE_TRUNC support) ─────────────────────

  async getStatistics(query: AnalyticsQueryDto): Promise<StatisticsResponse> {
    const where: Prisma.ConversionEventWhereInput = {};
    if (query.event) {
      where.event = query.event as Prisma.EnumConversionEventTypeFilter['equals'];
    }
    if (query.from || query.to) {
      where.createdAt = {};
      if (query.from) where.createdAt.gte = new Date(query.from);
      if (query.to) where.createdAt.lte = new Date(query.to);
    }
    if (query.entityType) {
      where.entityType = query.entityType;
    }

    const groupBy = query.groupBy ?? 'event';

    // Use $queryRaw for date truncation; fall back to Prisma groupBy for 'event'
    if (groupBy === 'day' || groupBy === 'week' || groupBy === 'month') {
      const truncFn = groupBy === 'day' ? 'day' : groupBy === 'week' ? 'week' : 'month';
      const from = query.from ? new Date(query.from) : new Date(0);
      const to = query.to ? new Date(query.to) : new Date();

      const eventFilter = query.event
        ? `AND event = '${query.event}'`
        : '';
      const entityFilter = query.entityType
        ? `AND entity_type = '${query.entityType}'`
        : '';

      const rows = await this.prisma.$queryRawUnsafe<{ label: string; value: number }[]>(
        `SELECT
          to_char(DATE_TRUNC('${truncFn}', created_at), ${
            groupBy === 'month' ? "'YYYY-MM'" : groupBy === 'week' ? "'YYYY-\"W\"IW'" : "'YYYY-MM-DD'"
          }) AS label,
          COUNT(*)::int AS value
        FROM conversion_event
        WHERE created_at >= $1 AND created_at <= $2 ${eventFilter} ${entityFilter}
        GROUP BY DATE_TRUNC('${truncFn}', created_at)
        ORDER BY label DESC
        LIMIT $3`,
        from,
        to,
        query.limit ?? 10,
      );

      return { event: query.event ?? 'all', data: rows };
    }

    // Fallback: groupBy event
    const result = await this.prisma.conversionEvent.groupBy({
      by: ['event'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: query.limit ?? 10,
    });

    const data = result.map((r) => ({
      label: r.event,
      value: r._count.id,
    }));

    return { event: query.event ?? 'all', data };
  }

  // ─── Events List ──────────────────────────────────────────────

  async getEvents(query: AnalyticsEventsQueryDto): Promise<EventsListResponse> {
    const where: Prisma.ConversionEventWhereInput = {};

    if (query.event) {
      where.event = query.event as Prisma.EnumConversionEventTypeFilter['equals'];
    }
    if (query.from || query.to) {
      where.createdAt = {};
      if (query.from) where.createdAt.gte = new Date(query.from);
      if (query.to) where.createdAt.lte = new Date(query.to);
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    const [items, total] = await Promise.all([
      this.prisma.conversionEvent.findMany({
        where,
        select: {
          id: true,
          event: true,
          entityType: true,
          entityId: true,
          source: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.conversionEvent.count({ where }),
    ]);

    const eventItems: EventListItem[] = items.map((e) => ({
      id: e.id,
      event: e.event,
      entityType: e.entityType,
      entityId: e.entityId,
      source: e.source,
      createdAt: e.createdAt.toISOString(),
    }));

    return { items: eventItems, total, page, pageSize };
  }
}