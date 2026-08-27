'use client';

import { useMemo } from 'react';
import type { FilterParameterDefinition } from '@/services/parameter-definition.service';
import type { ParameterGroup } from '@/types/product';

/** 需求参数草稿（含持久化参数 id，edit 时用于 diff） */
export interface DemandParameterDraft {
  /** 稳定 key（新增参数为临时 id，已持久化参数为 demandParameter.id） */
  key: string;
  /** 已持久化参数的 id（edit 回显时存在） */
  id?: string;
  parameterDefinitionId: string;
  value?: string;
  valueMin?: number | null;
  valueMax?: number | null;
  required: boolean;
  priority: number;
}

interface DemandParameterEditorProps {
  definitions: FilterParameterDefinition[];
  groups: ParameterGroup[];
  value: DemandParameterDraft[];
  onChange: (next: DemandParameterDraft[]) => void;
  disabled?: boolean;
}

const PRIORITY_OPTIONS = [
  { value: 0, label: '普通' },
  { value: 1, label: '重要' },
  { value: 2, label: '关键' },
];

let tempKeySeed = 0;

export function createEmptyParameterDraft(
  def: FilterParameterDefinition,
): DemandParameterDraft {
  tempKeySeed += 1;
  return {
    key: `__new_${tempKeySeed}`,
    parameterDefinitionId: def.id,
    value: def.dataType === 'BOOLEAN' ? 'true' : '',
    valueMin: null,
    valueMax: null,
    required: Boolean(def.required),
    priority: 0,
  };
}

export default function DemandParameterEditor({
  definitions,
  groups,
  value,
  onChange,
  disabled,
}: DemandParameterEditorProps) {
  const defById = useMemo(() => {
    const map = new Map<string, FilterParameterDefinition>();
    for (const d of definitions) map.set(d.id, d);
    return map;
  }, [definitions]);

  const groupById = useMemo(() => {
    const map = new Map<string, ParameterGroup>();
    for (const g of groups) map.set(g.id, g);
    return map;
  }, [groups]);

  const groupOrder = useMemo(() => {
    return [
      ...groups.map((g) => ({ id: g.id, name: g.name, defs: [] as FilterParameterDefinition[] })),
      { id: '__ungrouped', name: '未分组', defs: [] as FilterParameterDefinition[] },
    ];
  }, [groups]);

  // 按组归类可用定义（仅未被添加的参数）
  const selectableByGroup = useMemo(() => {
    const selectedIds = new Set(value.map((v) => v.parameterDefinitionId));
    const buckets = new Map<string, FilterParameterDefinition[]>();
    for (const d of definitions) {
      if (selectedIds.has(d.id)) continue;
      const key = d.parameterGroupId || '__ungrouped';
      const list = buckets.get(key) ?? [];
      list.push(d);
      buckets.set(key, list);
    }
    return buckets;
  }, [definitions, value]);

  const updateDraft = (key: string, patch: Partial<DemandParameterDraft>) => {
    onChange(
      value.map((d) => (d.key === key ? { ...d, ...patch } : d)),
    );
  };

  const removeDraft = (key: string) => {
    onChange(value.filter((d) => d.key !== key));
  };

  const addDraft = (definitionId: string) => {
    const def = defById.get(definitionId);
    if (!def) return;
    onChange([...value, createEmptyParameterDraft(def)]);
  };

  const renderValueInput = (draft: DemandParameterDraft) => {
    const def = defById.get(draft.parameterDefinitionId);
    if (!def) return null;

    if (def.dataType === 'NUMBER') {
      const unitSuffix = def.unit ? (
        <span className="shrink-0 self-center text-sm text-slate-400">
          {def.unit}
        </span>
      ) : null;
      return (
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-0 flex-1 basis-28">
            <label
              htmlFor={`param-${draft.key}-value`}
              className="block text-xs font-medium text-slate-500 mb-1"
            >
              单值（可选）
            </label>
            <input
              id={`param-${draft.key}-value`}
              type="number"
              value={draft.value ?? ''}
              disabled={disabled}
              onChange={(e) => updateDraft(draft.key, { value: e.target.value })}
              placeholder="精确值"
              className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>
          <div className="min-w-0 basis-24">
            <label
              htmlFor={`param-${draft.key}-min`}
              className="block text-xs font-medium text-slate-500 mb-1"
            >
              最小值
            </label>
            <input
              id={`param-${draft.key}-min`}
              type="number"
              value={draft.valueMin ?? ''}
              disabled={disabled}
              onChange={(e) =>
                updateDraft(draft.key, {
                  valueMin: e.target.value === '' ? null : Number(e.target.value),
                })
              }
              placeholder="不限"
              className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>
          <div className="min-w-0 basis-24">
            <label
              htmlFor={`param-${draft.key}-max`}
              className="block text-xs font-medium text-slate-500 mb-1"
            >
              最大值
            </label>
            <input
              id={`param-${draft.key}-max`}
              type="number"
              value={draft.valueMax ?? ''}
              disabled={disabled}
              onChange={(e) =>
                updateDraft(draft.key, {
                  valueMax: e.target.value === '' ? null : Number(e.target.value),
                })
              }
              placeholder="不限"
              className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>
          {unitSuffix}
        </div>
      );
    }

    if (def.dataType === 'ENUM') {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <select
            id={`param-${draft.key}-value`}
            value={draft.value ?? ''}
            disabled={disabled}
            onChange={(e) => updateDraft(draft.key, { value: e.target.value })}
            className="min-w-0 flex-1 basis-40 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
          >
            <option value="">请选择</option>
            {(def.options ?? []).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {def.unit ? (
            <span className="shrink-0 text-sm text-slate-400">{def.unit}</span>
          ) : null}
        </div>
      );
    }

    if (def.dataType === 'BOOLEAN') {
      return (
        <select
          id={`param-${draft.key}-value`}
          value={draft.value ?? 'true'}
          disabled={disabled}
          onChange={(e) => updateDraft(draft.key, { value: e.target.value })}
          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
        >
          <option value="true">是</option>
          <option value="false">否</option>
        </select>
      );
    }

    // STRING
    return (
      <input
        id={`param-${draft.key}-value`}
        type="text"
        value={draft.value ?? ''}
        disabled={disabled}
        onChange={(e) => updateDraft(draft.key, { value: e.target.value })}
        placeholder="请输入要求值"
        className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
      />
    );
  };

  return (
    <div className="space-y-4">
      {/* 已添加参数列表 */}
      {value.length === 0 ? (
        <p className="text-sm text-slate-400 italic">
          尚未添加技术参数。可从下方选择参数定义添加。
        </p>
      ) : (
        <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {value.map((draft) => {
            const def = defById.get(draft.parameterDefinitionId);
            const groupName = def?.parameterGroupId
              ? groupById.get(def.parameterGroupId)?.name
              : null;
            return (
              <div
                key={draft.key}
                className="bg-white px-4 py-3 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 break-words">
                      {def?.name ?? '未知参数'}
                    </p>
                    {groupName ? (
                      <p className="text-xs text-slate-400">{groupName}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDraft(draft.key)}
                    disabled={disabled}
                    aria-label={`移除参数 ${def?.name ?? ''}`}
                    className="shrink-0 rounded-md border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    移除
                  </button>
                </div>

                {renderValueInput(draft)}

                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={draft.required}
                      disabled={disabled}
                      onChange={(e) =>
                        updateDraft(draft.key, { required: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                    />
                    必填
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    重要度
                    <select
                      value={draft.priority}
                      disabled={disabled}
                      onChange={(e) =>
                        updateDraft(draft.key, { priority: Number(e.target.value) })
                      }
                      className="rounded-md border border-slate-300 px-2 py-1 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100"
                    >
                      {PRIORITY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 添加参数 */}
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-700 mb-3">添加技术参数</p>
        {groupOrder.map((g) => {
          const defs = selectableByGroup.get(g.id) ?? [];
          if (defs.length === 0) return null;
          return (
            <div key={g.id} className="mb-3">
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                {g.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {defs.map((def) => (
                  <button
                    key={def.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => addDraft(def.id)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {def.name}
                    {def.required ? (
                      <span className="ml-1 text-rose-500">*</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        {groupOrder.every(
          (g) => (selectableByGroup.get(g.id) ?? []).length === 0,
        ) ? (
          <p className="text-sm text-slate-400 italic">
            已添加全部可用参数定义。
          </p>
        ) : null}
      </div>
    </div>
  );
}
