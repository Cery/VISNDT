'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import EmptyState from '@/components/common/EmptyState';
import { getParameterGroups } from '@/lib/api/parameter-groups';
import type {
  MySupplierProductMedia,
  MySupplierProductParameterValue,
} from '@/lib/api/supplier-self-service';

/**
 * WP-4 SupplierProduct Media + Parameter presentation.
 *
 * Read-only productization of an OWN SupplierProduct's:
 *   - Media      （型号级媒体：图片 / 规格书等；以 isPrimary + displayOrder 展示，数据缺真实文件时展示元数据卡片，绝不渲染断开图片）
 *   - Parameters （型号级技术参数覆盖；按 Parameter Group 分组，展示名称 / 值 / 单位，缺失值显示 “—”）
 *
 * 数据链路（只读，复用现有 API）：
 *   GET /supplier-products/my/:id  → media[] + parameterValues[].parameterDefinition
 *   GET /parameter-groups          → 分组名（平台参数权威的展示辅助）
 *
 * 不伪造能力：
 *   - 不渲染不存在的缩略图 / 断图（现有 media 行可能无 fileAsset，因此按元数据卡展示）。
 *   - 不重算评分、不伪造工程值；缺失值一律 “Not Provided / —”。
 *   - 不含采购 / 报价 / 库存 / 商城等商用语义。
 */

const MEDIA_TYPE_LABEL: Record<string, string> = {
  IMAGE: '图片',
  SPEC_SHEET: '规格书',
  VIDEO: '视频',
  DOCUMENT: '文档',
};

function mediaTypeLabel(mediaType?: string): string {
  return MEDIA_TYPE_LABEL[mediaType ?? ''] ?? mediaType ?? '媒体';
}

function formatValue(pv: MySupplierProductParameterValue): string {
  const raw = pv.value;
  if (raw !== null && raw !== undefined && String(raw).trim() !== '') return String(raw);
  if (pv.valueNumber !== null && pv.valueNumber !== undefined) return String(pv.valueNumber);
  return '—';
}

/** 主媒体优先，其余按 displayOrder。仅排序，不增删不伪造。 */
function orderMedia(media: MySupplierProductMedia[]): MySupplierProductMedia[] {
  return [...media].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
  });
}

export default function SupplierModelMediaParameters({
  media = [],
  parameterValues = [],
  loading = false,
}: {
  media?: MySupplierProductMedia[] | null;
  parameterValues?: MySupplierProductParameterValue[] | null;
  loading?: boolean;
}) {
  const groupsQuery = useQuery({
    queryKey: ['parameter-groups'],
    queryFn: () => getParameterGroups(1, 100),
    staleTime: 60_000,
  });

  const groupNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of groupsQuery.data?.data ?? []) {
      if (g?.id) map.set(g.id, g.name);
    }
    return map;
  }, [groupsQuery.data]);

  const orderedMedia = useMemo(() => orderMedia(media ?? []), [media]);
  const hasMedia = orderedMedia.length > 0;

  // 参数按 Parameter Group 分组（保留参数定义顺序）。
  const groups = useMemo(() => {
    const list = (parameterValues ?? []).filter((pv) => pv && pv.parameterDefinitionId);
    const byGroup = new Map<string, MySupplierProductParameterValue[]>();
    const groupOrder: string[] = [];
    for (const pv of list) {
      const gid = pv.parameterDefinition?.parameterGroupId ?? 'default';
      if (!byGroup.has(gid)) {
        byGroup.set(gid, []);
        groupOrder.push(gid);
      }
      byGroup.get(gid)!.push(pv);
    }
    return groupOrder.map((gid) => ({
      id: gid,
      name: gid === 'default' ? '规格' : groupNameById.get(gid) ?? '规格',
      values: byGroup.get(gid)!,
    }));
  }, [parameterValues, groupNameById]);

  const hasParameters = groups.length > 0;

  return (
    <>
      {/* ============ Media ============ */}
      <section aria-labelledby="wp4-media-heading" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 id="wp4-media-heading" className="text-base font-semibold text-slate-900">型号媒体</h2>
        <p className="mt-1 text-xs text-slate-500">
          该型号已配置的媒体（图面 / 规格书等）。顺序以系统保存的主媒体与排序为准，不做前端临时排序。
        </p>

        <div className="mt-4">
          {loading ? (
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">媒体加载中…</div>
          ) : !hasMedia ? (
            <EmptyState
              icon="package"
              message="该型号暂未配置媒体"
              description="返回「我的产品」完善型号信息；媒体由供应商组织在授权流程中维护。"
            />
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="型号媒体列表">
              {orderedMedia.map((m) => {
                const typeLabel = mediaTypeLabel(m.mediaType);
                // 现有媒体行可能未绑定真实文件（无 fileAsset / 无 URL）。按元数据卡展示，绝不渲染断开图片。
                const hasUsableFile = Boolean(m.fileAssetId);
                return (
                  <li
                    key={m.id}
                    className="flex flex-col rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    {hasUsableFile ? (
                      <div className="flex h-32 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-400">
                        （媒体文件预览）
                      </div>
                    ) : (
                      <div
                        className="flex h-32 items-center justify-center rounded-md bg-slate-100"
                        role="img"
                        aria-label={(m.altText || m.title) || '型号媒体'}
                      >
                        <svg
                          width="34"
                          height="34"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-8 w-8 text-slate-300"
                          aria-hidden="true"
                        >
                          {m.mediaType === 'SPEC_SHEET' ? (
                            <>
                              <path d="M6 2h9l4 4v16H6z" />
                              <path d="M15 2v4h4" />
                              <path d="M9 13h6M9 17h4" />
                            </>
                          ) : (
                            <>
                              <rect x="3" y="4" width="18" height="16" rx="2" />
                              <circle cx="9" cy="10" r="1.6" />
                              <path d="M21 15l-4.5-4.5L6 20" />
                            </>
                          )}
                        </svg>
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-md bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white">
                        {typeLabel}
                      </span>
                      {m.isPrimary ? (
                        <span className="rounded-md border border-primary/30 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          主媒体
                        </span>
                      ) : null}
                    </div>
                    {m.title ? <p className="mt-1.5 text-sm font-medium text-slate-700">{m.title}</p> : null}
                    {m.altText ? <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">{m.altText}</p> : null}
                    <p className="mt-1 text-[11px] text-slate-400">
                      顺序 {m.displayOrder ?? 0}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ============ Parameters ============ */}
      <section aria-labelledby="wp4-params-heading" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 id="wp4-params-heading" className="text-base font-semibold text-slate-900">型号技术参数</h2>
        <p className="mt-1 text-xs text-slate-500">
          型号级（SupplierProduct-specific）规格覆盖。能力锚点（Platform Product）为参数定义权威；本表仅展示当前型号已填写的覆盖值，未覆盖的平台参数按平台能力定义为准。
        </p>

        <div className="mt-4">
          {loading ? (
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">参数加载中…</div>
          ) : !hasParameters ? (
            <EmptyState
              icon="document"
              message="该型号尚未填写型号级参数覆盖"
              description="平台能力已定义的技术参数将按能力默认呈现；本型号未填写覆盖项显示为 —。"
            />
          ) : (
            <div className="space-y-5">
              {groups.map((group) => (
                <div key={group.id}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {group.name}
                  </h3>
                  <div className="overflow-hidden rounded-lg border border-slate-100">
                    {group.values.map((pv, idx) => {
                      const def = pv.parameterDefinition;
                      const label = def?.name || def?.code || '参数';
                      const unit = def?.unit ? ` ${def.unit}` : '';
                      const value = formatValue(pv);
                      const isMissing = value === '—';
                      return (
                        <div
                          key={pv.id ?? `${pv.parameterDefinitionId}-${idx}`}
                          className={`flex flex-wrap items-start justify-between gap-2 px-4 py-2.5 text-sm ${
                            idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'
                          }`}
                        >
                          <span className="text-slate-600">{label}</span>
                          <span
                            className={`font-mono ${isMissing ? 'text-slate-400' : 'text-slate-900'}`}
                          >
                            {value}
                            {isMissing ? '' : unit}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}