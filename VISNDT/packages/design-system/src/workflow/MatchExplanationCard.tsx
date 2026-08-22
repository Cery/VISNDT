import type { CSSProperties } from 'react';
import { radius, spacing, typography } from '@visndt/design-tokens';
import { SOFTER_TONE_STYLE, type Tone } from '../shared';
import type { SemanticTone } from '@visndt/design-tokens';
import BusinessIdentityBadge from '../BusinessIdentityBadge';
import StatusDisplay from '../StatusDisplay';
import type { BusinessEntityType } from '@visndt/identity-contract';
import type { StatusPresentation } from './status-presentation';

/** SemanticTone → design-system Tone（指示灯色，cyan/violet 收敛到 nearest Tone） */
function toTone(tone: SemanticTone): Tone {
  switch (tone) {
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'error': return 'error';
    case 'info':
    case 'cyan': return 'info';
    case 'primary':
    case 'violet': return 'primary';
    default: return 'neutral';
  }
}

/** 匹配解释因子 */
export interface MatchFactor {
  label: string;
  matched: boolean;
  note?: string;
}

export interface MatchExplanationCardProps {
  /** 匹配结果 ID */
  matchId: string;
  /** 关联业务对象身份（展示 Business Identity，用于定位匹配上下文） */
  referent?: { type: BusinessEntityType; id: string; createdAt?: string | Date } | null;
  /** 匹配评分（0..1，纯展示置信度） */
  score?: number | null;
  /** 匹配业务状态 */
  status?: string | null;
  /** 状态展现契约（缺省用 status 原始字符串） */
  statusPresentation?: StatusPresentation;
  /** 解释因子列表 */
  factors?: MatchFactor[];
  title?: string;
  className?: string;
  style?: CSSProperties;
}

function toneByScore(score?: number | null) {
  if (score == null) return 'neutral';
  if (score >= 0.7) return 'success';
  if (score >= 0.4) return 'info';
  return 'warning';
}

/**
 * 「匹配结果解释」卡片：仅解释已有匹配结果（匹配依据 / 置信度 / 关联身份）。
 * 明确：不重算评分 / 不改算法 / 不做 AI 决策。因子由展示方按确定性匹配信息提供。
 */
export default function MatchExplanationCard({
  matchId,
  referent,
  score,
  status,
  statusPresentation,
  factors = [],
  title = '匹配结果解释',
  className,
  style,
}: MatchExplanationCardProps) {
  const confidencePct = score != null ? Math.round(score * 100) : null;
  const tone = toneByScore(score);
  const st = statusPresentation ?? (status ? { label: status, tone: toneByScore(null), progress: 0 } as StatusPresentation : null);

  return (
    <div
      className={className}
      style={{
        background: '#fff',
        border: `1px solid ${SOFTER_TONE_STYLE.neutral.border}`,
        borderRadius: radius.lg,
        padding: spacing[6],
        ...style,
      }}
    >
      {/* 标题 + 身份 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: spacing[2],
          marginBottom: spacing[4],
        }}
      >
        <span style={{ fontSize: typography.fontSize.sm, fontWeight: 600, color: '#0f172a' }}>
          {title}
        </span>
        {referent && (
          <BusinessIdentityBadge type={referent.type} id={referent.id} createdAt={referent.createdAt} variant="tag" />
        )}
      </div>

      {/* 匹配身份 + 状态 + 置信度 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing[3], marginBottom: spacing[4], paddingBottom: spacing[3], borderBottom: `1px solid ${SOFTER_TONE_STYLE.neutral.border}` }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>匹配 ID</div>
          <code style={{ fontSize: 12, fontFamily: typography.fontFamily.mono, color: '#475569' }}>
            {matchId.slice(0, 16)}…
          </code>
        </div>
        {st && (
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>状态</div>
            <StatusDisplay status={st.label} tone={toTone(st.tone)} />
          </div>
        )}
        <div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>置信度</div>
          <span style={{ fontSize: typography.fontSize.lg, fontWeight: 700, color: SOFTER_TONE_STYLE[tone].fg }}>
            {confidencePct != null ? `${confidencePct}%` : '—'}
          </span>
        </div>
      </div>

      {/* 匹配因子 */}
      {factors.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: spacing[2] }}>匹配依据</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
            {factors.map((f, i) => {
              const fg = f.matched ? SOFTER_TONE_STYLE.success.fg : SOFTER_TONE_STYLE.error.fg;
              return (
                <div key={`${f.label}-${i}`} style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[2] }}>
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: f.matched ? SOFTER_TONE_STYLE.success.bg : SOFTER_TONE_STYLE.error.bg,
                      color: fg,
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {f.matched ? '✓' : '×'}
                  </span>
                  <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{f.label}</span>
                  {f.note && <span style={{ fontSize: 12, color: '#94a3b8' }}>· {f.note}</span>}
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: spacing[3], marginBottom: 0 }}>
            依据为确定性匹配结果，仅作说明，不重算评分、不依赖 AI 决策。
          </p>
        </div>
      )}
    </div>
  );
}