import type { DemandDetailItem } from '@/lib/api/demands';
import { BusinessIdentityBadge, WorkflowTimeline, NextActionHint, buildDemandTimeline, DEMAND_STATUS_PRESENTATION, presentStatus } from '@visndt/design-system';
import DemandStatusBadge from './DemandStatusBadge';
import DemandParameters from './DemandParameters';

interface DemandDetailProps {
  demand: DemandDetailItem;
  matchesCount: number;
}

function formatDate(value?: string | null) {
  if (!value) return '未填写';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '未填写';
  return d.toLocaleDateString('zh-CN');
}

/** 联系人敏感字段：后端对未公开联系方式的 phone/email 返回 '***'，此处诚实呈现。 */
function formatContactValue(value?: string | null) {
  if (!value) return '未填写';
  if (value === '***') return '未公开';
  return value;
}

export default function DemandDetail({ demand, matchesCount }: DemandDetailProps) {
  const demandSteps = buildDemandTimeline(demand.status, {
    createdAt: demand.createdAt,
  });
  const presentation = presentStatus(demand.status, DEMAND_STATUS_PRESENTATION);

  const basicInfo: Array<{ label: string; value: string }> = [
    { label: '需求分类', value: demand.category?.name || '未分类' },
    { label: '预算范围', value: demand.budgetRange || '未填写' },
    {
      label: '需求数量',
      value:
        demand.quantity != null
          ? `${demand.quantity}${demand.quantityUnit ? ` ${demand.quantityUnit}` : ''}`
          : '未填写',
    },
    { label: '预计交付', value: formatDate(demand.expectedDeliveryDate) },
    { label: '联系人', value: demand.contactName || '未填写' },
    { label: '联系电话', value: formatContactValue(demand.contactPhone) },
    { label: '联系邮箱', value: formatContactValue(demand.contactEmail) },
    {
      label: '联系方式可见性',
      value: demand.contactVisible ? '公开' : '不公开',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="text-xl font-bold text-slate-900">{demand.title}</h1>
          <DemandStatusBadge status={demand.status} />
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <BusinessIdentityBadge type="DEMAND" id={demand.id} createdAt={demand.createdAt} />
          {demand.category && (
            <span className="bg-slate-100 px-2 py-0.5 rounded-full">
              {demand.category.name}
            </span>
          )}
          <span>创建时间: {new Date(demand.createdAt).toLocaleDateString()}</span>
          <span>更新时间: {new Date(demand.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Workflow Visualization */}
      <section className="space-y-3">
        <NextActionHint current={presentation.label} action={presentation.nextAction} />
        <WorkflowTimeline title="业务流转" steps={demandSteps} />
      </section>

      {/* Basic Information */}
      <section>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          基础信息
        </h2>
        <div className="rounded-lg border border-slate-200 bg-white">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100">
            {basicInfo.map((item) => (
              <div key={item.label} className="bg-white px-4 py-3">
                <dt className="text-xs text-slate-400">{item.label}</dt>
                <dd className="mt-1 text-sm text-slate-800 break-words">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Description */}
      {demand.description && (
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            描述
          </h2>
          <p className="text-sm text-slate-500 whitespace-pre-wrap leading-relaxed">
            {demand.description}
          </p>
        </section>
      )}

      {/* Parameters */}
      <section>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          技术参数
        </h2>
        <DemandParameters
          parameters={demand.parameters || demand.parameterValues}
        />
      </section>

      {/* Match Count */}
      <section>
        <h2 className="text-sm font-semibold text-slate-700 mb-2">
          产品匹配
        </h2>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-slate-900">{matchesCount}</p>
          <p className="text-xs text-slate-400 mt-1">
            此需求匹配到的产品
          </p>
        </div>
      </section>
    </div>
  );
}