import type {
  DashboardStats,
  DashboardPending,
} from './dashboard.types';
import type { MatchingStats } from './match.types';
import type { Product } from './product.types';
import type { Content } from './content.types';
import type { Organization } from './organization.types';
import type { Demand } from './demand.types';
import type { Rfq } from './rfq.types';
import type { Offer } from './offer.types';
import type { Inquiry } from './inquiry.types';

/** 运营中心状态分组项 */
export interface StatusGroupItem {
  key: string;
  label: string;
  status: string;
  count: number;
}

/** 运营待办队列项 */
export interface OperationQueueItem {
  id: string;
  title: string;
  status: string;
  domain: 'product' | 'content' | 'supplier' | 'business';
  target: string;
  updatedAt: string;
}

/** 运营中心总览视图模型 */
export interface OperationCenterOverview {
  stats: DashboardStats;
  pending: DashboardPending;
  matchingStats: MatchingStats;
}

/** 各运营域状态分组结果 */
export interface OperationStatusResult<TItem> {
  summary: {
    total: number;
    active: number;
  };
  groups: StatusGroupItem[];
  recent: TItem[];
}

/** Product Operation 视图数据 */
export interface ProductOperationData {
  status: OperationStatusResult<Product>;
}

/** Content Operation 视图数据 */
export interface ContentOperationData {
  status: OperationStatusResult<Content>;
}

/** Supplier Operation 视图数据 */
export interface SupplierOperationData {
  status: OperationStatusResult<Organization>;
}

/** Business Operation 视图数据 */
export interface BusinessOperationData {
  demandStatus: OperationStatusResult<Demand>;
  rfqStatus: OperationStatusResult<Rfq>;
  offerStatus: OperationStatusResult<Offer>;
  inquiryStatus: OperationStatusResult<Inquiry>;
  matchingStats: MatchingStats;
}