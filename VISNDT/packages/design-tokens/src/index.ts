/**
 * @visndt/design-tokens
 * VISNDT cross-platform Design Token Foundation v1.0
 *
 * 唯一事实源（Single Source of Truth）：
 * - Web（Tailwind CSS 变量 / 原子组件）
 * - Admin（AntD 主题 / StatusTag）
 *
 * 目标：消灭 G1~G6 双端视觉语言割裂。
 * 约定：primary 统一为 #2563eb；状态语义统一经 STATUS_TONE 确定性映射。
 */

/* ============================================================
 * Color（色彩）
 * ============================================================ */
export const colors = {
  /** 品牌主色（统一双端） */
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  /** 工业辅助色 */
  industrialBlue: '#1e40af',
  industrialCyan: '#0ea5e9',
  industrialViolet: '#7c3aed',
  industrialSky: '#0ea5e9',
  industrialLime: '#84cc16',
  industrialRose: '#f43f5e',

  /** 中性色阶 */
  neutral: {
    '0': '#ffffff',
    '50': '#f8fafc',
    '100': '#f1f5f9',
    '200': '#e2e8f0',
    '300': '#cbd5e1',
    '400': '#94a3b8',
    '500': '#64748b',
    '600': '#475569',
    '700': '#334155',
    '800': '#1e293b',
    '900': '#0f172a',
    '950': '#020617',
  },

  /** 语义状态色（与 STATUS_TONE 保持一致，对齐 docs/design-system/VISNDT_COLOR_SYSTEM.md 冻结值） */
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9',
    neutral: '#64748b',
    primary: '#2563eb',
    cyan: '#0ea5e9',
    violet: '#7c3aed',
  },

  /** 表面色 */
  surfaces: {
    layoutBg: '#f5f7fa',
    headerBg: '#ffffff',
    siderBg: '#0f172a',
    tableHeaderBg: '#f8fafc',
    cardBg: '#ffffff',
    secondaryBg: '#f1f5f9',
    elevatedBg: '#ffffff',
    overlay: 'rgba(15, 23, 42, 0.5)',
  },

  /** 交互状态色（WP-2 Interaction Semantics，对接 726 §4.5 / a11y） */
  interaction: {
    /** 交互态按下/强调 */
    hover: '#204fd6',
    active: '#1e40af',
    /** 禁用前景（WCAG 4.5:1 内已降对比度，属有意的 disabled 视觉降级） */
    disabledFg: '#94a3b8',
    disabledBg: '#f1f5f9',
    disabledBorder: '#e2e8f0',
  } as const,
} as const;

/* ============================================================
 * Surface Hierarchy（表层级语义，对接 726 §7 Surface Contract）
 * 全部复用既有色值 + rgba overlay（功能遮挡，非品牌色），不新增第二套色板。
 * surface-0 PageBg → surface-1 Primary → surface-2 Secondary → elevated → overlay
 * ============================================================ */
export const surfaceHierarchy = {
  'surface-0': colors.surfaces.layoutBg,
  'surface-1': colors.surfaces.cardBg,
  'surface-2': colors.surfaces.secondaryBg,
  elevated: colors.surfaces.elevatedBg,
  overlay: colors.surfaces.overlay,
} as const;

export type SurfaceLevel = keyof typeof surfaceHierarchy;

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

/* ============================================================
 * Typography（字体排印）
 * ============================================================ */
export const typography = {
  fontFamily: {
    sans: "'Inter', system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    mono: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

/* ============================================================
 * Spacing（间距）
 * ============================================================ */
export const spacing: Record<number, number> = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

/* ============================================================
 * Layout Container（布局容器，对接 726 §8.1 Container 基础规则）
 * content 默认内容 / wide Hero 视觉场 / reading 内容与知识正文阅读宽度
 * ============================================================ */
export const container = {
  width: {
    content: 1280,
    wide: 1480,
    reading: { min: 760, max: 820 },
  },
} as const;

/* ============================================================
 * Responsive Padding（响应式留白，对接 726 §4.5 / §2.2C）
 * mobile 375 / tablet 768 / desktop 1024·1440
 * ============================================================ */
export const responsivePadding = {
  mobile: 16,
  tablet: 24,
  desktop: 32,
} as const;

/* ============================================================
 * Radius（圆角）
 * ============================================================ */
export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

/* ============================================================
 * Shadow（阴影）
 * ============================================================ */
export const shadow = {
  sm: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  md: '0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)',
  lg: '0 8px 24px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)',
} as const;

/* ============================================================
 * Border（边框）
 * ============================================================ */
export const border = {
  width: {
    default: 1,
    emphasis: 2,
  },
  color: {
    default: '#e2e8f0',
    strong: '#cbd5e1',
  },
  /**
   * Focus ring（可访问性焦点环，对接 726 §18 / TG-02）。
   * 复用既有 primary 作为 focus-visible ring，不新增颜色。
   */
  focus: '#2563eb',
} as const;

/* ============================================================
 * Motion（动效）
 * ============================================================ */
export const motion = {
  duration: {
    fast: 120,
    base: 200,
    slow: 320,
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    enter: 'cubic-bezier(0, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;

/* ============================================================
 * Status Tone 确定性映射
 * 覆盖 Demo 数据与真实业务状态，未知状态回退 neutral。
 * ============================================================ */
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
  SHIPPED: 'success',
  DELIVERED: 'success',

  // 进行中 / 信息
  SUBMITTED: 'info',
  PROCESSING: 'info',
  IN_PROGRESS: 'info',
  REVIEWED: 'info',
  IN_REVIEW: 'info',
  REVIEWING: 'info',
  UNDER_REVIEW: 'info',
  OPEN: 'info',
  DRAFTING: 'info',

  // 待处理 / 关注
  PENDING: 'warning',
  PENDING_REVIEW: 'warning',
  UNREAD: 'warning',
  ATTENTION: 'warning',
  WARNING: 'warning',
  HARD_FAIL: 'warning',
  DUE: 'warning',

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

/** 语义色调 → 具体色值 */
export const TONE_TO_HEX: Record<SemanticTone, string> = {
  success: colors.status.success,
  warning: colors.status.warning,
  error: colors.status.error,
  info: colors.status.info,
  neutral: colors.status.neutral,
  primary: colors.status.primary,
  cyan: colors.status.cyan,
  violet: colors.status.violet,
};

/** 语义色调 → Ant Design Tag 预设色 */
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

/**
 * 将任意业务状态字符串解析为语义色调（大小写不敏感 + 未知回退）。
 */
export function resolveStatusTone(status?: string | null): SemanticTone {
  if (!status) return 'neutral';
  const key = status.trim().toUpperCase();
  return STATUS_TONE[key] ?? 'neutral';
}

/** 将语义色调解析为具体色值（用于图标 / 边框 / 数值强调） */
export function toneToHex(status?: string | null): string {
  return TONE_TO_HEX[resolveStatusTone(status)];
}

/* ============================================================
 * 工业运营图表配色
 * ============================================================ */
export const CHART_PALETTE: readonly string[] = [
  '#2563eb', // 工业蓝
  '#0ea5e9', // 工业青（Secondary）
  '#10b981', // 成功绿（Success）
  '#f59e0b', // 警告琥珀（Warning/Accent）
  '#ef4444', // 错误红（Error）
  '#7c3aed', // 紫
  '#0ea5e9', // 天蓝
  '#84cc16', // 青柠
  '#f43f5e', // 玫红
  '#64748b', // 中性灰
];

/**
 * 将 Design Token 转换为 CSS 自定义属性（供 Web/Admin 注入 :root / :where(.vds)）。
 * 返回形如 { '--vds-primary': '#2563eb', ... } 的对象。
 */
export function toCssVariables(prefix = 'vds'): Record<string, string> {
  const vars: Record<string, string> = {
    [`--${prefix}-primary`]: colors.primary,
    [`--${prefix}-primary-dark`]: colors.primaryDark,
    [`--${prefix}-cyan`]: colors.industrialCyan,
    [`--${prefix}-violet`]: colors.industrialViolet,
    [`--${prefix}-neutral-500`]: colors.neutral['500'],
    [`--${prefix}-radius-sm`]: `${radius.sm}px`,
    [`--${prefix}-radius-md`]: `${radius.md}px`,
    [`--${prefix}-radius-lg`]: `${radius.lg}px`,
    [`--${prefix}-shadow-sm`]: shadow.sm,
    [`--${prefix}-shadow-md`]: shadow.md,
    [`--${prefix}-shadow-lg`]: shadow.lg,
    [`--${prefix}-status-success`]: colors.status.success,
    [`--${prefix}-status-warning`]: colors.status.warning,
    [`--${prefix}-status-error`]: colors.status.error,
    [`--${prefix}-status-info`]: colors.status.info,
    // Surface hierarchy（726 §7）
    [`--${prefix}-surface-0`]: surfaceHierarchy['surface-0'],
    [`--${prefix}-surface-1`]: surfaceHierarchy['surface-1'],
    [`--${prefix}-surface-2`]: surfaceHierarchy['surface-2'],
    [`--${prefix}-surface-elevated`]: surfaceHierarchy.elevated,
    [`--${prefix}-surface-overlay`]: surfaceHierarchy.overlay,
    // Layout container（726 §8.1 / TG-03）
    [`--${prefix}-container-content`]: `${container.width.content}px`,
    [`--${prefix}-container-wide`]: `${container.width.wide}px`,
    [`--${prefix}-container-reading-min`]: `${container.width.reading.min}px`,
    [`--${prefix}-container-reading-max`]: `${container.width.reading.max}px`,
    // Focus ring（TG-02）
    [`--${prefix}-border-focus`]: border.focus,
    // Interaction states（WP-2 §7 / §25）
    [`--${prefix}-interaction-hover`]: colors.interaction.hover,
    [`--${prefix}-interaction-active`]: colors.interaction.active,
    [`--${prefix}-interaction-disabled-fg`]: colors.interaction.disabledFg,
    [`--${prefix}-interaction-disabled-bg`]: colors.interaction.disabledBg,
    [`--${prefix}-interaction-disabled-border`]: colors.interaction.disabledBorder,
  };
  return vars;
}

/** 语义色调 → Material / 通用 CSS 状态色（用于无需 JS 的纯 CSS 场景） */
export function toneToCssVar(status?: string | null): string {
  return `var(--vds-status-${resolveStatusTone(status)})`;
}

const designTokens = {
  colors,
  typography,
  spacing,
  radius,
  shadow,
  border,
  motion,
  surfaceHierarchy,
  container,
  responsivePadding,
  STATUS_TONE,
  TONE_TO_HEX,
  TONE_TO_ANTD_COLOR,
  CHART_PALETTE,
  resolveStatusTone,
  toneToHex,
  toCssVariables,
};

export default designTokens;