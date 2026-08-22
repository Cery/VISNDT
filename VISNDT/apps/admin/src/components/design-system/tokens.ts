/**
 * VISNDT Admin Console Design Language v1（对齐 @visndt/design-tokens 单一事实源）
 *
 * 自 M25.1 起，品牌色 / 语义状态 / 图表配色全部委托给
 * `@visndt/design-tokens`（Shared Single Source），消灭双端 Token 割裂（G4）。
 * 本文件仅保留 Admin 侧兼容导出与 AntD 映射。
 */

import {
  colors,
  STATUS_TONE,
  TONE_TO_ANTD_COLOR,
  TONE_TO_HEX,
  CHART_PALETTE,
  resolveStatusTone,
  type SemanticTone,
} from '@visndt/design-tokens';

export const VISNDT_COLORS = {
  // Brand
  primary: colors.primary,
  primaryDark: colors.primaryDark,
  industrialBlue: colors.industrialBlue,
  industrialCyan: colors.industrialCyan,
  industrialSlate: colors.neutral['900'],

  // Semantic status
  success: colors.status.success,
  warning: colors.status.warning,
  error: colors.status.error,
  info: colors.status.info,
  neutral: colors.neutral['500'],

  // Surfaces
  layoutBg: colors.surfaces.layoutBg,
  headerBg: colors.surfaces.headerBg,
  siderBg: colors.surfaces.siderBg,
  tableHeaderBg: colors.surfaces.tableHeaderBg,
} as const;

/**
 * 将语义色调解析为 Ant Design 预设 Tag 颜色（兼容导出）。
 */
export function statusToneToAntdColor(status?: string | null): string {
  return TONE_TO_ANTD_COLOR[resolveStatusTone(status)];
}

// 以下均来自共享包：保持导出名称不变，Admin 现有引用零改动。
export {
  STATUS_TONE,
  TONE_TO_ANTD_COLOR,
  TONE_TO_HEX,
  CHART_PALETTE,
  resolveStatusTone,
  type SemanticTone,
};