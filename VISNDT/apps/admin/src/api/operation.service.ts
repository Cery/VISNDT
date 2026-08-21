import { dashboardService } from './dashboard.service';
import { productService } from './product.service';
import { contentService } from './content.service';
import { organizationService } from './organization.service';
import { demandService } from './demand.service';
import { rfqService } from './rfq.service';
import { offerService } from './offer.service';
import { inquiryService } from './inquiry.service';
import type {
  OperationCenterOverview,
  OperationStatusResult,
  ProductOperationData,
  ContentOperationData,
  SupplierOperationData,
  BusinessOperationData,
  StatusGroupItem,
} from '../types/operation-center.types';
import type { Product } from '../types/product.types';
import type { Content } from '../types/content.types';
import type { Organization } from '../types/organization.types';
import type { Demand } from '../types/demand.types';
import type { Rfq } from '../types/rfq.types';
import type { Offer } from '../types/offer.types';
import type { Inquiry } from '../types/inquiry.types';

const RECENT_SIZE = 8;

/**
 * 通用状态分组统计：
 * 针对每个目标状态并发请求 { pageSize: 1 } 获取该状态下总数，
 * 再取一页近期样本作为「recent」，用于状态分组与快捷筛选依据。
 * 仅组合现有 API，不存在运营专用端点。
 */
async function buildStatusResult<T>(
  statuses: { label: string; status: string }[],
  fetchCount: (status: string) => Promise<{ total: number }>,
  fetchRecent: () => Promise<T[]>,
): Promise<OperationStatusResult<T>> {
  const [counts, recent] = await Promise.all([
    Promise.all(
      statuses.map(async (s) => {
        const res = await fetchCount(s.status);
        return { ...s, count: res.total ?? 0 } as StatusGroupItem;
      }),
    ),
    fetchRecent(),
  ]);

  const groups = counts.filter((c) => c.count > 0 || c.status === 'DRAFT');
  const total = counts.reduce((sum, c) => sum + c.count, 0);
  const active = counts.reduce(
    (sum, c) => sum + (c.status === 'ACTIVE' || c.status === 'PUBLISHED' ? c.count : 0),
    0,
  );

  return { summary: { total, active }, groups, recent: recent as T[] };
}

const emptyResult = <T,>(): OperationStatusResult<T> => ({
  summary: { total: 0, active: 0 },
  groups: [],
  recent: [],
});

/**
 * 运营中心数据聚合服务。
 * 全部能力基于现有 API 组合（Composition），不触及后端 / 数据库 / API 契约。
 */
export const operationService = {
  /** 总览：复用 Dashboard 端点，组成运营待办队列 + 状态分组基础。 */
  async getOverview(): Promise<OperationCenterOverview> {
    const [stats, pending, matchingStats] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getPending(),
      dashboardService.getMatchingStats(),
    ]);
    return { stats, pending, matchingStats };
  },

  /** Product Operation：待审核 / 分类状态 / 完整度提示由前端依据现有字段组合。 */
  async getProductStatus(): Promise<ProductOperationData> {
    try {
      const status = await buildStatusResult<Product>(
        [
          { label: '草稿', status: 'DRAFT' },
          { label: '已上架', status: 'ACTIVE' },
          { label: '已下架', status: 'INACTIVE' },
        ],
        (status) => productService.getList({ status, page: 1, pageSize: 1 }),
        () =>
          productService
            .getList({ page: 1, pageSize: RECENT_SIZE })
            .then((r) => r.data),
      );
      return { status };
    } catch {
      return { status: emptyResult<Product>() };
    }
  },

  /** Content Operation：草稿 / 已发布 / 审核 状态分组。 */
  async getContentStatus(): Promise<ContentOperationData> {
    try {
      const status = await buildStatusResult<Content>(
        [
          { label: '草稿', status: 'DRAFT' },
          { label: '审核中', status: 'REVIEW' },
          { label: '已发布', status: 'PUBLISHED' },
          { label: '已归档', status: 'ARCHIVED' },
        ],
        (status) =>
          contentService.getList({
            status: status as Content['status'],
            page: 1,
            pageSize: 1,
          }),
        () =>
          contentService
            .getList({ page: 1, pageSize: RECENT_SIZE })
            .then((r) => r.data),
      );
      return { status };
    } catch {
      return { status: emptyResult<Content>() };
    }
  },

  /** Supplier Operation：Organization 状态 + 能力画像（成员数）提示。 */
  async getSupplierStatus(): Promise<SupplierOperationData> {
    try {
      const status = await buildStatusResult<Organization>(
        [
          { label: '正常', status: 'ACTIVE' },
          { label: '已停用', status: 'INACTIVE' },
          { label: '已暂停', status: 'SUSPENDED' },
        ],
        (status) => organizationService.getList({ status, page: 1, pageSize: 1 }),
        () =>
          organizationService
            .getList({ page: 1, pageSize: RECENT_SIZE })
            .then((r) => r.data),
      );
      return { status };
    } catch {
      return { status: emptyResult<Organization>() };
    }
  },

  /** Business Operation：需求 / 询价 / RFQ / 报价 队列 + 匹配状态。 */
  async getBusinessStatus(): Promise<BusinessOperationData> {
    const [demandStatus, rfqStatus, offerStatus, inquiryStatus, matchingStats] =
      await Promise.all([
        buildStatusResult<Demand>(
          [
            { label: '草稿', status: 'DRAFT' },
            { label: '已发布', status: 'PUBLISHED' },
            { label: '处理中', status: 'PROCESSING' },
            { label: '已关闭', status: 'CLOSED' },
          ],
          (status) =>
            demandService
              .getList({ status: status as Demand['status'], page: 1, pageSize: 1 })
              .then((r) => ({ total: r.total })),
          () =>
            demandService
              .getList({ page: 1, pageSize: RECENT_SIZE })
              .then((r) => r.data),
        ).catch(() => emptyResult<Demand>()),
        buildStatusResult<Rfq>(
          [
            { label: '草稿', status: 'DRAFT' },
            { label: '开放中', status: 'OPEN' },
            { label: '响应中', status: 'RESPONDING' },
            { label: '已关闭', status: 'CLOSED' },
          ],
          (status) => rfqService.getList(1, 1, undefined, status),
          () => rfqService.getList(1, RECENT_SIZE).then((r) => r.data),
        ).catch(() => emptyResult<Rfq>()),
        buildStatusResult<Offer>(
          [
            { label: '草稿', status: 'DRAFT' },
            { label: '已提交', status: 'SUBMITTED' },
            { label: '已上架', status: 'ACTIVE' },
            { label: '已拒绝', status: 'REJECTED' },
          ],
          (status) => offerService.getList(1, 1, undefined, status),
          () => offerService.getList(1, RECENT_SIZE).then((r) => r.data),
        ).catch(() => emptyResult<Offer>()),
        buildStatusResult<Inquiry>(
          [
            { label: '新询价', status: 'NEW' },
            { label: '处理中', status: 'PROCESSING' },
            { label: '已回复', status: 'REPLIED' },
            { label: '已关闭', status: 'CLOSED' },
          ],
          (status) => inquiryService.getList(1, 1, undefined, status),
          () => inquiryService.getList(1, RECENT_SIZE).then((r) => r.data),
        ).catch(() => emptyResult<Inquiry>()),
        dashboardService.getMatchingStats(),
      ]);

    return {
      demandStatus,
      rfqStatus,
      offerStatus,
      inquiryStatus,
      matchingStats,
    };
  },
};