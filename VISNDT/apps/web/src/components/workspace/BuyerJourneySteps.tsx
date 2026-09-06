'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getBuyerWorkspaceOverview } from '@/services/workspace.service';
import UiIcon from '@/lib/ui-icon';
import type { UiIconName } from '@/lib/ui-icon';

interface JourneyStep {
  key: 'demand' | 'match' | 'rfq' | 'decision';
  label: string;
  mono: string;
  href: string;
  icon: UiIconName;
  description: string;
}

const STEPS: JourneyStep[] = [
  {
    key: 'demand',
    label: '需求',
    mono: 'DEMAND',
    href: '/workspace/demands',
    icon: 'list',
    description: '我的采购需求',
  },
  {
    key: 'match',
    label: '匹配',
    mono: 'MATCH',
    href: '/workspace/matches',
    icon: 'link',
    description: '能力匹配结果',
  },
  {
    key: 'rfq',
    label: '询价',
    mono: 'RFQ',
    href: '/workspace/rfqs',
    icon: 'file',
    description: '询价请求进度',
  },
  {
    key: 'decision',
    label: '决策',
    mono: 'DECISION',
    href: '/workspace/rfqs',
    icon: 'check',
    description: '响应与报价决策',
  },
];

interface BuyerJourneyStepsProps {
  /** 当前所处旅程步骤（无则不高亮任何步骤） */
  currentStep?: JourneyStep['key'];
}

function formatCount(value: number | undefined): string {
  if (value == null) {
    return '—';
  }
  return String(value);
}

/**
 * WP-3B Buyer Workspace — Procurement Journey IA.
 *
 * 将 Buyer Workspace 组织为可理解的采购旅程：Demand → Match → RFQ → Decision。
 * 各步骤计数全部来自真实 API（getBuyerWorkspaceOverview），不伪造业务数据；
 * 不做 Statistics-only Dashboard，而是回答「我正在做什么 / 下一步去哪里」。
 */
export default function BuyerJourneySteps({ currentStep }: BuyerJourneyStepsProps) {
  const overviewQuery = useQuery({
    queryKey: ['workspace', 'buyer', 'overview'],
    queryFn: getBuyerWorkspaceOverview,
  });

  const isLoading = overviewQuery.isLoading;
  const overview = overviewQuery.data;

  const counts: Record<JourneyStep['key'], number | undefined> = {
    demand: overview?.demandSummary.total,
    match: overview?.matchSummary.total,
    rfq: overview?.rfqSummary.total,
    decision: overview?.responseSummary.pendingCount,
  };

  return (
    <section aria-labelledby="buyer-journey-title" className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-1 h-5 bg-primary rounded-full" aria-hidden="true" />
        <h2 id="buyer-journey-title" className="text-lg font-semibold text-foreground">
          采购旅程
        </h2>
        <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-slate-400">
          DEMAND → MATCH → RFQ → DECISION
        </span>
      </div>

      <ol className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {STEPS.map((step, index) => {
          const count = isLoading ? undefined : counts[step.key];
          const active = currentStep === step.key;
          return (
            <li key={step.key} className="min-w-0">
              <Link
                href={step.href}
                aria-current={active ? 'step' : undefined}
                className={`group flex h-full flex-col rounded-xl border bg-white p-4 transition-all ${
                  active
                    ? 'border-primary/50 shadow-industrial-sm'
                    : 'border-slate-200/80 shadow-industrial-sm hover:border-primary/30 hover:shadow-industrial-md'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        active ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <UiIcon name={step.icon} size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {step.label}
                      </span>
                      <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 truncate">
                        {step.mono}
                      </span>
                    </span>
                  </div>
                  <span
                    className={`shrink-0 text-xl font-extrabold tabular-nums ${
                      active ? 'text-primary' : 'text-slate-800'
                    }`}
                  >
                    {formatCount(count)}
                  </span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{step.description}</p>
              </Link>
            </li>
          );
        })}
      </ol>

      {overviewQuery.isError && (
        <p className="text-xs text-slate-400">
          旅程计数加载失败，请刷新重试；下方入口仍可正常使用。
        </p>
      )}
    </section>
  );
}
