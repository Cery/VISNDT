/**
 * @visndt/design-system · MediaStatusPresentationContract (M25.4)
 * 统一「既有媒体资源(FileAsset) → 治理展示」的确定性映射。
 *
 * 定位：
 *   仅基于既有 FileAsset 字段派生「治理展示状态」，不新增数据模型、不改 Schema、
 *   不触发删除/迁移、不承载存储治理执行。UI Governance State，非 Database Enum。
 *
 * 约束：
 *   语义色调复用 640 design-tokens 的 SemanticTone；时间线复用 642 WorkflowTimeline 契约。
 *   Existing FileAsset → Presentation Adapter → Media Governance UI
 */
import type { SemanticTone } from '@visndt/design-tokens';
import type { PresentationStep, WorkflowStepState } from '../workflow/status-presentation';

/** 治理展示状态（UI Governance State，非数据库枚举） */
export type MediaGovernanceState = 'active' | 'unused' | 'incomplete' | 'legacy';

/** 媒体状态展现契约：label / tone / description / governanceHint */
export interface MediaStatusPresentation {
  label: string;
  tone: SemanticTone;
  description: string;
  governanceHint: string;
}

export const MEDIA_GOVERNANCE_PRESENTATION: Record<MediaGovernanceState, MediaStatusPresentation> = {
  active: {
    label: '正常引用',
    tone: 'success',
    description: '已被产品/内容实体引用，可正常展示',
    governanceHint: '无需处理',
  },
  unused: {
    label: '未引用',
    tone: 'warning',
    description: '当前未被任何产品/内容引用',
    governanceHint: '建议确认无引用后清理或补挂引用',
  },
  incomplete: {
    label: '缺少信息',
    tone: 'info',
    description: '文件元信息不完整（名称 / MIME / 大小）',
    governanceHint: '建议补充文件信息以提升可管理性',
  },
  legacy: {
    label: '历史资源',
    tone: 'neutral',
    description: '已归档或逻辑删除',
    governanceHint: '仅归档可见，可评估归档迁移或清理',
  },
};

/** 治理状态可输入的既有字段子集 */
export interface MediaGovernanceInput {
  status?: string | null;
  deletedAt?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
  productRefCount?: number;
  contentRefCount?: number;
}

/** 由既有 FileAsset 字段确定性推导治理展示状态（纯展示，不写库） */
export function deriveMediaGovernanceState(input: MediaGovernanceInput): MediaGovernanceState {
  const status = (input.status ?? '').trim().toUpperCase();
  if (status === 'ARCHIVED' || input.deletedAt) return 'legacy';
  const hasMetadata = Boolean(input.fileName && input.mimeType && (input.fileSize ?? 0) > 0);
  const refs = (input.productRefCount ?? 0) + (input.contentRefCount ?? 0);
  if (!hasMetadata) return 'incomplete';
  if (refs === 0) return 'unused';
  return 'active';
}

/* ============================================================
 * Media Lifecycle（Presentation State）
 * Created → Referenced → Displayed → Maintained → Archived Candidate
 * 仅表示展示推进位置，不是数据库状态机。
 * ============================================================ */
export type MediaLifecycleStage =
  | 'created'
  | 'referenced'
  | 'displayed'
  | 'maintained'
  | 'archived_candidate';

export interface MediaLifecycleStepDef {
  key: MediaLifecycleStage;
  label: string;
  description?: string;
}

export const MEDIA_LIFECYCLE_STEPS: MediaLifecycleStepDef[] = [
  { key: 'created', label: '已创建', description: '文件已上传并落库' },
  { key: 'referenced', label: '已引用', description: '被产品/内容实体关联引用' },
  { key: 'displayed', label: '已展示', description: '在对应页面可见' },
  { key: 'maintained', label: '维护中', description: '元信息与状态持续维护' },
  { key: 'archived_candidate', label: '待归档', description: '失去引用或进入历史状态' },
];

/** 治理展示状态 → 生命周期当前节点位（0 起） */
export const MEDIA_LIFECYCLE_STAGE_INDEX: Record<MediaGovernanceState, number> = {
  legacy: 4,
  active: 2,
  unused: 0,
  incomplete: 0,
};

/**
 * 由既有字段确定性构建媒体生命周期时间线。
 * 仅 createdAt 可稳定取得，故仅「已创建」节点挂日期；其余为展示推进位。
 */
export function buildMediaLifecycle(
  input: MediaGovernanceInput & { createdAt?: string | null },
): PresentationStep[] {
  const state = deriveMediaGovernanceState(input);
  const currentIndex = MEDIA_LIFECYCLE_STAGE_INDEX[state];
  return MEDIA_LIFECYCLE_STEPS.map((step, index) => {
    let s: WorkflowStepState = 'pending';
    if (index < currentIndex) s = 'completed';
    else if (index === currentIndex) s = 'current';
    const date = index === 0 && input.createdAt ? input.createdAt : undefined;
    return { ...step, state: s, date };
  });
}