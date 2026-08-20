/**
 * VISNDT Admin Console Design Language v1
 *
 * 统一的工业运营中心视觉语义 Token：
 * - Brand Color（品牌色）
 * - Semantic Status（语义状态色）
 * - Chart Palette（工业图表配色）
 *
 * 目的：禁止页面内散落 #1677ff / 随机红绿蓝值，统一「成功/警告/错误/信息/中性」语义。
 */

export const VISNDT_COLORS = {
  // Brand
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  industrialBlue: '#1e40af',
  industrialCyan: '#0891b2',
  industrialSlate: '#0f172a',

  // Semantic status
  success: '#16a34a',
  warning: '#d97706',
  error: '#dc2626',
  info: '#0891b2',
  neutral: '#64748b',

  // Surfaces
  layoutBg: '#f5f7fa',
  headerBg: '#ffffff',
  siderBg: '#0f172a',
  tableHeaderBg: '#f8fafc',
} as const;

/** 语义状态色调 */
export type SemanticTone =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'primary'
  | 'cyan'
  | 'violet';

/** 语义色调 → Ant Design 预设 Tag 颜色 */
export const TONE_TO_ANTD_COLOR: Record<SemanticTone, string> = {
  success: 'green',
  warning: 'orange',
  error: 'red',
  info: 'cyan',
  neutral: 'default',
  primary: 'blue',
  cyan: 'cyan',
  violet: 'purple',
};

/** 语义色调 → 具体色值（用于图标 / 边框 / 数值强调） */
export const TONE_TO_HEX: Record<SemanticTone, string> = {
  success: VISNDT_COLORS.success,
  warning: VISNDT_COLORS.warning,
  error: VISNDT_COLORS.error,
  info: VISNDT_COLORS.info,
  neutral: VISNDT_COLORS.neutral,
  primary: VISNDT_COLORS.primary,
  cyan: VISNDT_COLORS.industrialCyan,
  violet: '#7c3aed',
};

/**
 * 工业运营图表配色（语义化、克制、可区分）
 * 替代散落的 PIE_COLORS。
 */
export const CHART_PALETTE = [
  '#2563eb', // 工业蓝
  '#0891b2', // 工业青
  '#16a34a', // 成功绿
  '#d97706', // 警告琥珀
  '#dc2626', // 错误红
  '#7c3aed', // 紫
  '#0ea5e9', // 天蓝
  '#84cc16', // 青柠
  '#f43f5e', // 玫红
  '#64748b', // 中性灰
] as const;

/**
 * 业务状态 → 语义色调 的确定性映射。
 * 覆盖 Demo 数据与真实业务状态，未知状态回退 neutral。
 */
export const STATUS_TONE: Record<string, SemanticTone> = {
  // 正向 / 已完成
  ACTIVE: 'success',
  PUBLISHED: 'success',
  ACCEPTED: 'success',
  APPROVED: 'success',
  COMPLETED: 'success',
  ENABLED: 'success',
  HEALTHY: 'success',
  CONNECTED: 'success',
  ONLINE: 'success',
  RESOLVED: 'success',

  // 进行中 / 信息
  SUBMITTED: 'info',
  PROCESSING: 'info',
  IN_PROGRESS: 'info',
  REVIEWED: 'info',
  IN_REVIEW: 'info',
  REVIEWING: 'info',
  UNDER_REVIEW: 'info',
  OPEN: 'info',

  // 待处理 / 关注
  PENDING: 'warning',
  PENDING_REVIEW: 'warning',
  UNREAD: 'warning',
  ATTENTION: 'warning',
  WARNING: 'warning',
  HARD_FAIL: 'warning',

  // 负向 / 终止
  REJECTED: 'error',
  CANCELLED: 'error',
  FAILED: 'error',
  ERROR: 'error',
  BLOCKED: 'error',
  SUSPENDED: 'error',

  // 中性 / 归档
  DRAFT: 'neutral',
  CLOSED: 'neutral',
  DISABLED: 'neutral',
  INACTIVE: 'neutral',
  ARCHIVED: 'neutral',
  EXPIRED: 'neutral',
  NEUTRAL: 'neutral',
  SYSTEM: 'primary',
};

/**
 * 将任意业务状态字符串解析为语义色调。
 * 支持大小写不敏感 + 未知状态回退。
 */
export function resolveStatusTone(status?: string | null): SemanticTone {
  if (!status) return 'neutral';
  const key = status.trim().toUpperCase();
  return STATUS_TONE[key] ?? 'neutral';
}

/**
 * 将语义色调解析为 Ant Design Tag 颜色。
 */
export function statusToneToAntdColor(status?: string | null): string {
  return TONE_TO_ANTD_COLOR[resolveStatusTone(status)];
}