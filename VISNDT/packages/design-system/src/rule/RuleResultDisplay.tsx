/**
 * RuleResultDisplay —— L0 规则评估结果展示（Operational Transparency，非自动化）。
 *
 * 复用 640 StatusDisplay / 641 BusinessIdentityBadge，不新增颜色/状态/组件体系。
 * 职责：把一条 `RuleResult` 确定性映射为可读的治理提示。
 * 纯展示：不重算、不写库、不触发任何业务动作。
 */
import type { CSSProperties, ReactNode } from 'react';
import { colors, spacing, typography } from '@visndt/design-tokens';
import StatusDisplay from '../StatusDisplay';

export interface RuleResultDisplayData {
  ruleId: string;
  passed: boolean;
  severity: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
}

export interface RuleResultDisplayProps {
  result: RuleResultDisplayData;
  /** 结果说明（缺省用 result.message） */
  hint?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** 严重级别 → 语义色调（复用 640） */
function toneOf(severity: RuleResultDisplayData['severity'], passed: boolean) {
  if (passed) return 'success' as const;
  if (severity === 'ERROR') return 'error' as const;
  if (severity === 'WARNING') return 'warning' as const;
  return 'info' as const;
}

const SEVERITY_LABEL: Record<RuleResultDisplayData['severity'], string> = {
  INFO: '提示',
  WARNING: '需关注',
  ERROR: '需处理',
};

/** 规则结果展示：Badge + 规则名 + 说明 + 提示 */
export default function RuleResultDisplay({
  result,
  hint,
  className,
  style,
}: RuleResultDisplayProps) {
  const tone = toneOf(result.severity, result.passed);
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[1] * 1.5,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], flexWrap: 'wrap' }}>
        <StatusDisplay
          tone={tone}
          label={result.passed ? '已通过' : SEVERITY_LABEL[result.severity]}
          variant="tag"
        />
        <span style={{ fontSize: 12.5, color: colors.neutral['700'], fontWeight: 600 }}>
          {result.ruleId}
        </span>
      </div>
      <span
        style={{
          fontSize: 12.5,
          color: colors.neutral['600'],
          fontFamily: typography.fontFamily.sans,
          lineHeight: '20px',
        }}
      >
        {hint ?? result.message}
      </span>
    </div>
  );
}