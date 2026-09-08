'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getParameterGroups } from '@/lib/api/parameter-groups';
import { getParameterDefinitions } from '@/lib/api/parameter-definitions';
import type {
  MySupplierProduct,
  MySupplierProductParameterValue,
  MyParameterOverrideItem,
} from '@/lib/api/supplier-self-service';
import { setMySupplierProductParameters } from '@/lib/api/supplier-self-service';

/**
 * WP-5A — Parameter Write (R2) for an OWN SupplierProduct.
 *
 * Mental model (strict):
 *   Platform Product
 *       ↓ Parameter Definition (authority)
 *       ↓ SupplierProduct-specific Override (this editor)
 *
 * Parameter Definition authority is untouched. This editor writes overrides only.
 * Edit → Save → API success → Reload → Same value (never fake success).
 * Missing values surface as "Not provided / —" — never auto-filled engineering data.
 */

const inputClass =
  'w-full min-h-11 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 focus:border-slate-500 focus:outline-none';

function formatValue(pv: MySupplierProductParameterValue): string {
  if (pv.value !== null && pv.value !== undefined && String(pv.value).trim() !== '') return String(pv.value);
  if (pv.valueNumber !== null && pv.valueNumber !== undefined) return String(pv.valueNumber);
  return '';
}

export default function SupplierModelParameterEditor({
  model,
  editable = false,
  onReload,
}: {
  model: MySupplierProduct;
  editable: boolean;
  onReload: () => Promise<void>;
}) {
  const defsQuery = useQuery({
    queryKey: ['parameter-definitions'],
    queryFn: () => getParameterDefinitions(1, 100),
    staleTime: 60_000,
  });
  const groupsQuery = useQuery({
    queryKey: ['parameter-groups'],
    queryFn: () => getParameterGroups(1, 100),
    staleTime: 60_000,
  });

  const existing = model.parameterValues ?? [];

  // Build the full definition list (platform authority), initialized to current overrides.
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notify, setNotify] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);

  const defs = defsQuery.data?.data ?? [];
  const groups = groupsQuery.data?.data ?? [];

  useEffect(() => {
    const init: Record<string, string> = {};
    for (const pv of existing) {
      if (pv.parameterDefinitionId) init[pv.parameterDefinitionId] = formatValue(pv);
    }
    setDrafts(init);
    setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.id, JSON.stringify(existing.map((e) => e.id))]);

  const groupNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of groups) if (g?.id) map.set(g.id, g.name);
    return map;
  }, [groups]);

  const defsById = useMemo(() => {
    const map = new Map<string, typeof defs[number]>();
    for (const d of defs) if (d?.id) map.set(d.id, d);
    return map;
  }, [defs]);

  // Only show definitions relevant to this model's capability binding.
  const relevantDefs = useMemo(() => {
    const list = defs.filter((d) => d && d.id);
    // Prefer defs that already have overrides, then any platform defs.
    const overrideIds = new Set(existing.map((e) => e.parameterDefinitionId));
    return list.sort((a, b) => {
      const aa = overrideIds.has(a.id) ? 0 : 1;
      const bb = overrideIds.has(b.id) ? 0 : 1;
      return aa - bb;
    });
  }, [defs, existing]);

  const set = (defId: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [defId]: value }));
    setDirty(true);
    setNotify(null);
  };

  const hasOverrides = Object.keys(drafts).length > 0 || (existing.length ?? 0) > 0;

  const save = async () => {
    if (!editable) return;
    setSaving(true);
    setNotify(null);
    try {
      const items: MyParameterOverrideItem[] = [];
      for (const d of relevantDefs) {
        const raw = (drafts[d.id] ?? '').trim();
        if (!raw) continue; // skip missing → not written as an override
        const item: MyParameterOverrideItem = { parameterDefinitionId: d.id, value: raw };
        if (d.dataType === 'NUMBER') {
          const parsed = Number(raw);
          if (!Number.isNaN(parsed)) item.valueNumber = parsed;
        }
        items.push(item);
      }
      await setMySupplierProductParameters(model.id, items);
      setNotify({ tone: 'ok', text: '参数覆盖已保存并经 API 持久化。' });
      setDirty(false);
      await onReload();
    } catch (err) {
      setNotify({ tone: 'err', text: err instanceof Error ? err.message : '保存失败，请稍后重试。' });
    } finally {
      setSaving(false);
    }
  };

  const defsLoading = defsQuery.isLoading || groupsQuery.isLoading;

  return (
    <section aria-labelledby="param-editor-heading" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="param-editor-heading" className="text-base font-semibold text-slate-900">型号技术参数</h2>
          <p className="mt-1 text-xs text-slate-500">
            型号级（SupplierProduct-specific）覆盖。能力锚点（Platform Product）为参数定义权威；此处仅写入本型号的覆盖值，缺失值显示「—」。
            {editable ? ' 编辑后点击「保存参数」。' : ' 当前状态不可编辑。'}
          </p>
        </div>
        {editable && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void save()}
              disabled={!dirty || saving}
              className="inline-flex min-h-11 items-center rounded-md bg-slate-900 px-4 text-xs font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? '保存中…' : dirty ? '保存参数' : '已保存'}
            </button>
          </div>
        )}
      </div>

      {notify && (
        <div className={`mt-3 rounded-md border px-3 py-2 text-sm ${notify.tone === 'ok' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
          {notify.text}
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-100">
        {defsLoading ? (
          <div className="px-4 py-8 text-center text-sm text-slate-400">参数定义加载中…</div>
        ) : relevantDefs.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-400">暂无参数定义可覆盖。</div>
        ) : (
          <div role="table" aria-label="型号技术参数覆盖">
            {relevantDefs.map((d, idx) => {
              const def = defsById.get(d.id) ?? d;
              const value = (drafts[d.id] ?? '').trim();
              const isMissing = value === '';
              return (
                <div
                  key={d.id}
                  role="row"
                  className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm ${idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}`}
                >
                  <span role="cell" className="min-w-0 flex-1 text-slate-600">
                    {def?.name || def?.code || '参数'}
                    {def?.unit ? <span className="ml-1 text-xs text-slate-400">（{def.unit}）</span> : null}
                    {hasOverrides && !isMissing ? (
                      <span className="ml-1.5 rounded bg-slate-100 px-1 py-0.5 text-[10px] font-medium text-slate-500">覆盖</span>
                    ) : isMissing ? (
                      <span className="ml-1.5 text-[11px] text-slate-300">—</span>
                    ) : null}
                  </span>
                  {editable ? (
                    <input
                      role="cell"
                      type={def?.dataType === 'NUMBER' ? 'number' : 'text'}
                      value={drafts[d.id] ?? ''}
                      onChange={(e) => set(d.id, e.target.value)}
                      placeholder="Not provided"
                      aria-label={`${def?.name || def?.code || '参数'} 覆盖值`}
                      className={`${inputClass} w-full sm:w-64`}
                    />
                  ) : (
                    <span role="cell" className={`font-mono ${isMissing ? 'text-slate-400' : 'text-slate-900'}`}>
                      {isMissing ? '—' : `${value}${def?.unit ? ` ${def.unit}` : ''}`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="mt-2 text-[11px] text-slate-400">
        空白值将按「Not provided / —」展示，不会自动填充工程数据。参数定义本身由平台能力（Platform Product）权威管理，此处不可修改。
      </p>
    </section>
  );
}