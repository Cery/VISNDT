import type { CSSProperties } from 'react';
import { colors, radius, spacing, typography } from '@visndt/design-tokens';
import Card from '../Card';
import BusinessIdentityBadge from '../BusinessIdentityBadge';
import MediaGovernanceBadge from './MediaGovernanceBadge';
import MediaLifecycleTimeline from './MediaLifecycleTimeline';
import type { MediaGovernanceInput } from './media-presentation';
import { deriveMediaGovernanceState, MEDIA_GOVERNANCE_PRESENTATION } from './media-presentation';

export interface MediaFileCardProps extends MediaGovernanceInput {
  /** FileAsset 数据库 UUID（用于派生 Asset 业务编号） */
  assetId: string;
  /** 创建时间（业务编号 YYYYMMDD 段 + 生命周期展示） */
  createdAt?: string | null;
  /** 更新时间 */
  updatedAt?: string | null;
  /** 关联实体类型展示名 */
  entityLabel?: string | null;
  /** 上传者展示名 */
  uploaderName?: string | null;
  /** 所属组织名 */
  organizationName?: string | null;
  /** 是否展示生命周期时间线 */
  showLifecycle?: boolean;
  /** 是否展示治理提示 */
  showHint?: boolean;
  className?: string;
  style?: CSSProperties;
}

function formatFileSize(size?: number | null): string {
  if (!size || size <= 0) return '—';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(date?: string | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString();
}

const ROW_LABEL_S: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 600,
  color: colors.neutral['400'],
  marginBottom: 2,
};
const ROW_VALUE_S: React.CSSProperties = {
  fontSize: 12.5,
  color: colors.neutral['700'],
  wordBreak: 'break-all',
};

/** 单行「标签 + 值」 */
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={ROW_LABEL_S}>{label}</div>
      <div style={ROW_VALUE_S}>{value}</div>
    </div>
  );
}

/**
 * 媒体资产治理卡：Asset Identity + File Info + Usage Reference + Governance + Lifecycle + Hint。
 * 只做治理可视化，不触发删除/迁移/状态修改。
 */
export default function MediaFileCard({
  assetId,
  status,
  deletedAt,
  fileName,
  mimeType,
  fileSize,
  productRefCount = 0,
  contentRefCount = 0,
  entityLabel,
  uploaderName,
  organizationName,
  createdAt,
  updatedAt,
  showLifecycle = true,
  showHint = true,
  className,
  style,
}: MediaFileCardProps) {
  const governanceInput: MediaGovernanceInput = {
    status,
    deletedAt,
    fileName,
    mimeType,
    fileSize,
    productRefCount,
    contentRefCount,
  };
  const state = deriveMediaGovernanceState(governanceInput);
  const refs = productRefCount + contentRefCount;

  return (
    <Card
      title="媒体资产治理"
      extra={<BusinessIdentityBadge type="ASSET" id={assetId} createdAt={createdAt ?? undefined} />}
      className={className}
      style={style}
      accent="success"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], flexWrap: 'wrap' }}>
        <MediaGovernanceBadge state={state} />
        <span style={{ fontSize: 12.5, color: colors.neutral['500'] }}>
          {MEDIA_GOVERNANCE_PRESENTATION[state].description}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: spacing[4],
          paddingTop: spacing[2],
        }}
      >
        <Field label="文件名称" value={fileName || '—'} />
        <Field label="MIME 类型" value={mimeType || '—'} />
        <Field label="文件大小" value={formatFileSize(fileSize)} />
        <Field
          label="引用情况"
          value={
            refs === 0 ? (
              <span style={{ color: colors.status.warning }}>未引用</span>
            ) : (
              `${productRefCount} 产品 / ${contentRefCount} 内容`
            )
          }
        />
        <Field label="所属实体" value={entityLabel || '—'} />
        <Field label="所属组织" value={organizationName || '未分配'} />
        <Field label="上传者" value={uploaderName || '—'} />
        <Field label="创建时间" value={formatDate(createdAt)} />
        <Field label="更新时间" value={formatDate(updatedAt)} />
      </div>

      {showLifecycle && (
        <div style={{ paddingTop: spacing[2] }}>
          <MediaLifecycleTimeline input={{ ...governanceInput, createdAt }} />
        </div>
      )}

      {showHint && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: spacing[2],
            fontSize: 12.5,
            color: colors.neutral['600'],
            background: colors.neutral['50'],
            border: `1px solid ${colors.neutral['200']}`,
            borderRadius: radius.md,
            padding: `${spacing[2]}px ${spacing[3]}px`,
          }}
        >
          <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>治理提示</span>
          <span style={{ fontWeight: 400 }}>{MEDIA_GOVERNANCE_PRESENTATION[state].governanceHint}</span>
        </div>
      )}
    </Card>
  );
}