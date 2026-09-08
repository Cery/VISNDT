import type { RfqDetailItem } from '@/lib/api/rfqs';
import { BusinessIdentityBadge, WorkflowTimeline, NextActionHint, buildRfqTimeline, RFQ_STATUS_PRESENTATION, presentStatus } from '@visndt/design-system';
import { ORG_TYPE_LABEL } from '@/lib/display-labels';
import RFQStatusBadge from './RFQStatusBadge';
import DemandParameters from '@/components/demand/DemandParameters';

interface RFQDetailProps {
  rfq: RfqDetailItem;
  responseCount: number;
}

function formatDateTime(value?: string | null) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('zh-CN');
}

export default function RFQDetail({ rfq, responseCount }: RFQDetailProps) {
  const rfqSteps = buildRfqTimeline(rfq.status, {
    createdAt: rfq.createdAt,
    publishedAt: rfq.publishedAt,
    closedAt: rfq.closedAt,
  });
  const rfqPresentation = presentStatus(rfq.status, RFQ_STATUS_PRESENTATION);
  const demandParameters =
    rfq.demand?.parameters || rfq.demand?.parameterValues || [];
  const sourceMatch = rfq.sourceMatch;
  const targetOrg = rfq.targetOrganization;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="text-xl font-bold text-slate-900">{rfq.title}</h1>
          <RFQStatusBadge status={rfq.status} />
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <BusinessIdentityBadge type="RFQ" id={rfq.id} createdAt={rfq.createdAt} />
          <span>创建时间: {new Date(rfq.createdAt).toLocaleDateString()}</span>
          <span>更新时间: {new Date(rfq.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Workflow Visualization */}
      <section className="space-y-3">
        <NextActionHint current={rfqPresentation.label} action={rfqPresentation.nextAction} />
        <WorkflowTimeline title="业务流转" steps={rfqSteps} />
      </section>

      {/* Demand Reference */}
      {rfq.demand && (
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            关联需求
          </h2>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm font-medium text-slate-900">
              {rfq.demand.title}
            </p>
          </div>
          {demandParameters.length > 0 && (
            <div className="mt-3">
              <DemandParameters parameters={demandParameters} />
            </div>
          )}
        </section>
      )}

      {/* Source Match */}
      {sourceMatch ? (
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            来源匹配
          </h2>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  匹配能力：{sourceMatch.product?.name || '—'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  匹配 ID：{sourceMatch.id.slice(0, 12)}…
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                {sourceMatch.matchStatus && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {sourceMatch.matchStatus}
                  </span>
                )}
                {sourceMatch.matchScore != null && (
                  <span>匹配得分：{Math.round(sourceMatch.matchScore)}</span>
                )}
                <span>匹配时间：{formatDateTime(sourceMatch.matchedAt)}</span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Target Organization */}
      {targetOrg ? (
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            目标能力提供方
          </h2>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm font-medium text-slate-900">
              {targetOrg.name || '未命名组织'}
            </p>
            {targetOrg.type && (
              <p className="text-xs text-slate-400 mt-1">类型：{ORG_TYPE_LABEL[targetOrg.type] ?? '未知类型'}</p>
            )}
          </div>
        </section>
      ) : null}

      {/* Description */}
      {rfq.description && (
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            描述
          </h2>
          <p className="text-sm text-slate-500 whitespace-pre-wrap leading-relaxed">
            {rfq.description}
          </p>
        </section>
      )}

      {/* Response Count */}
      <section>
        <h2 className="text-sm font-semibold text-slate-700 mb-2">
          响应
        </h2>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-slate-900">{responseCount}</p>
          <p className="text-xs text-slate-400 mt-1">
            {responseCount === 0
              ? '暂无响应'
              : `已收到 ${responseCount} 条响应`}
          </p>
        </div>
      </section>
    </div>
  );
}