'use client';

import type { ReactNode } from 'react';

interface WorkspaceSectionHeaderProps {
  /** 页面/章节 H1 标题 */
  title: string;
  /** 上下文 mono 眉标（如 MATCHING / RFQ / DEMAND） */
  eyebrow: string;
  /** 副标题说明 */
  description: string;
  /** 右侧主操作插槽（如 创建按钮） */
  actions?: ReactNode;
}

/**
 * WP-3B Buyer Workspace — 统一章节页头。
 *
 * 提供一致的 Buyer 工作区页面身份（H1 + mono 眉标 + 说明 + 主操作），
 * 修复各列表/创建页此前以 H2 作为页面标题所导致的标题层级断层。
 * 仅表现层，不改变数据与权限语义。
 */
export default function WorkspaceSectionHeader({
  title,
  eyebrow,
  description,
  actions,
}: WorkspaceSectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="inline-block font-mono text-[11px] uppercase tracking-widest text-industrial-cyan">
          {eyebrow}
        </span>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}