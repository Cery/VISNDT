/**
 * @visndt/design-system · StatusPresentationContract
 * 统一「业务状态 → UI 表达」的确定性映射（label / tone / progress / nextAction）。
 *
 * 定位（M25.3）：
 *   仅做「已有业务状态」的展示层映射，不改变状态定义、不承载状态机、不改数据。
 *   语义色调复用 640 design-tokens 的 SemanticTone 与 STATUS_TONE，禁止新增颜色体系。
 */
import type { SemanticTone } from '@visndt/design-tokens';

/** 时间线节点状态 */
export type WorkflowStepState = 'completed' | 'current' | 'pending';

/** 时间线步骤定义（静态，来自业务生命周期常识，非状态机执行） */
export interface WorkflowStepDef {
  key: string;
  label: string;
  description?: string;
}

/** 带进度的单步展现节点（含当前状态标记） */
export interface PresentationStep extends WorkflowStepDef {
  state: WorkflowStepState;
  date?: string;
}

/** 统一状态展现契约：label / tone / progress / nextAction */
export interface StatusPresentation {
  label: string;
  tone: SemanticTone;
  /** 0..1，表示在所属工作流中的推进位置（仅供展示） */
  progress: number;
  /** 下一步可执行动作提示（非自动执行） */
  nextAction?: string;
}

/** 未知状态回退 */
const FALLBACK_PRESENTATION: StatusPresentation = {
  label: '未知',
  tone: 'neutral',
  progress: 0,
  nextAction: '暂无可用操作',
};

/** 按契约取某状态的展现；未知状态回退 neutral */
export function presentStatus(
  status: string | null | undefined,
  map: Record<string, StatusPresentation>,
): StatusPresentation {
  if (!status) return FALLBACK_PRESENTATION;
  return map[status.toUpperCase()] ?? { ...FALLBACK_PRESENTATION, label: status };
}

/* ============================================================
 * RFQ 状态展现
 * 既有 RFC enum：DRAFT / OPEN / RESPONDING / CLOSED / CANCELLED
 * ============================================================ */
export const RFQ_STATUS_PRESENTATION: Record<string, StatusPresentation> = {
  DRAFT: { label: '草稿', tone: 'neutral', progress: 0.1, nextAction: '发布询价单以开放供应商响应' },
  OPEN: { label: '开放中', tone: 'info', progress: 0.4, nextAction: '等待供应商提交响应' },
  RESPONDING: { label: '响应中', tone: 'info', progress: 0.6, nextAction: '审核已收到的供应商响应' },
  CLOSED: { label: '已关闭', tone: 'neutral', progress: 1, nextAction: '询价已收口' },
  CANCELLED: { label: '已取消', tone: 'error', progress: 1, nextAction: '询价已终止' },
};

/** RFQ 业务时间线（展示用静态阶段） */
export const RFQ_TIMELINE_STEPS: WorkflowStepDef[] = [
  { key: 'CREATED', label: '创建', description: '询价单已创建' },
  { key: 'OPEN', label: '开放', description: '已发布，供应商可见' },
  { key: 'RESPONDING', label: '供应商响应', description: '供应商提交报价' },
  { key: 'RESPONSE_RECEIVED', label: '已收到响应', description: '已收到供应商响应' },
  { key: 'REVIEWING', label: '审核', description: '审核供应商响应' },
  { key: 'CLOSED', label: '完成 / 关闭', description: '询价收口' },
];

/** status → 时间线「当前节点」下标 */
const RFQ_STAGE_INDEX: Record<string, number> = {
  DRAFT: 0,
  OPEN: 1,
  RESPONDING: 2,
  CLOSED: 5,
  CANCELLED: 5,
};

/**
 * 由既有 RFQ 状态 + 时间字段推导时间线节点（纯展示，不动状态）。
 * @param status      RFQ 业务状态
 * @param dates       可选的关键时间点（createdAt / publishedAt / closedAt）
 */
export function buildRfqTimeline(
  status: string | null | undefined,
  dates?: { createdAt?: string | null; publishedAt?: string | null; closedAt?: string | null },
): PresentationStep[] {
  const key = (status ?? '').toUpperCase();
  const currentIndex =
    RFQ_STAGE_INDEX[key] ?? (RFQ_TIMELINE_STEPS.length - 1);

  return RFQ_TIMELINE_STEPS.map((step, index) => {
    let state: WorkflowStepState = 'pending';
    if (index < currentIndex) state = 'completed';
    else if (index === currentIndex) state = 'current';

    let date: string | undefined;
    if (step.key === 'CREATED') date = dates?.createdAt ?? undefined;
    else if (step.key === 'OPEN') date = dates?.publishedAt ?? undefined;
    else if (step.key === 'CLOSED') date = dates?.closedAt ?? undefined;

    return { ...step, state, date };
  });
}

/* ============================================================
 * Demand 状态展现
 * 既有 Demand enum：DRAFT / PUBLISHED / SUBMITTED / PROCESSING / CLOSED / CANCELLED
 * ============================================================ */
export const DEMAND_STATUS_PRESENTATION: Record<string, StatusPresentation> = {
  DRAFT: { label: '草稿', tone: 'neutral', progress: 0.1, nextAction: '完善并发布需求' },
  PUBLISHED: { label: '已发布', tone: 'success', progress: 0.4, nextAction: '等待匹配到能力供给' },
  SUBMITTED: { label: '已提交', tone: 'info', progress: 0.5, nextAction: '进入采购处理流程' },
  PROCESSING: { label: '处理中', tone: 'info', progress: 0.7, nextAction: '跟进询价与匹配结果' },
  CLOSED: { label: '已关闭', tone: 'neutral', progress: 1, nextAction: '需求已收口' },
  CANCELLED: { label: '已取消', tone: 'error', progress: 1, nextAction: '需求已终止' },
};

export const DEMAND_TIMELINE_STEPS: WorkflowStepDef[] = [
  { key: 'CREATED', label: '创建需求', description: '需求已创建' },
  { key: 'PUBLISHED', label: '发布', description: '需求已发布' },
  { key: 'PROCESSING', label: '采购处理', description: '匹配 / 询价 / 响应' },
  { key: 'CLOSED', label: '完成 / 关闭', description: '需求收口' },
];

const DEMAND_STAGE_INDEX: Record<string, number> = {
  DRAFT: 0,
  PUBLISHED: 1,
  SUBMITTED: 2,
  PROCESSING: 2,
  CLOSED: 3,
  CANCELLED: 3,
};

export function buildDemandTimeline(
  status: string | null | undefined,
  dates?: { createdAt?: string | null; publishedAt?: string | null; closedAt?: string | null },
): PresentationStep[] {
  const key = (status ?? '').toUpperCase();
  const currentIndex = DEMAND_STAGE_INDEX[key] ?? (DEMAND_TIMELINE_STEPS.length - 1);
  return DEMAND_TIMELINE_STEPS.map((step, index) => {
    let state: WorkflowStepState = 'pending';
    if (index < currentIndex) state = 'completed';
    else if (index === currentIndex) state = 'current';
    let date: string | undefined;
    if (step.key === 'CREATED') date = dates?.createdAt ?? undefined;
    else if (step.key === 'PUBLISHED') date = dates?.publishedAt ?? undefined;
    else if (step.key === 'CLOSED') date = dates?.closedAt ?? undefined;
    return { ...step, state, date };
  });
}

/* ============================================================
 * Match 状态展现
 * 既有：PENDING / MATCHED / REVIEWED / ACCEPTED / REJECTED / EXPIRED
 * ============================================================ */
export const MATCH_STATUS_PRESENTATION: Record<string, StatusPresentation> = {
  PENDING: { label: '待处理', tone: 'warning', progress: 0.2, nextAction: '等待匹配结果' },
  MATCHED: { label: '已匹配', tone: 'info', progress: 0.5, nextAction: '进入供需审核环节' },
  REVIEWED: { label: '已审核', tone: 'info', progress: 0.7, nextAction: '决定接受或拒绝匹配' },
  ACCEPTED: { label: '已接受', tone: 'success', progress: 1, nextAction: '匹配已接受' },
  REJECTED: { label: '已拒绝', tone: 'error', progress: 1, nextAction: '匹配已拒绝' },
  EXPIRED: { label: '已过期', tone: 'neutral', progress: 1, nextAction: '匹配已失效' },
};

/* ============================================================
 * RFQ Response 状态展现
 * 既有 RFC Response enum：SUBMITTED / VIEWED / ACCEPTED / REJECTED
 * ============================================================ */
export const RFQ_RESPONSE_STATUS_PRESENTATION: Record<string, StatusPresentation> = {
  SUBMITTED: { label: '已提交', tone: 'info', progress: 0.3, nextAction: '等待采购方查看' },
  VIEWED: { label: '已查看', tone: 'info', progress: 0.6, nextAction: '等待采购方决策' },
  ACCEPTED: { label: '已接受', tone: 'success', progress: 1, nextAction: '响应已接受' },
  REJECTED: { label: '已拒绝', tone: 'error', progress: 1, nextAction: '响应已拒绝' },
};