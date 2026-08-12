'use client';

import { useState } from 'react';
import type { ProductParameterFilter } from '@/types/product';
import type { FilterParameterDefinition } from '@/services/parameter-definition.service';

interface ParameterFilterPanelProps {
  definitions: FilterParameterDefinition[];
  filters: ProductParameterFilter[];
  onChange: (filters: ProductParameterFilter[]) => void;
}

/** 每个参数筛选项的临时输入草稿（字符串态，便于受控输入） */
interface Draft {
  value: string;
  min: string;
  max: string;
}

const EMPTY_DRAFT: Draft = { value: '', min: '', max: '' };

/** 从外部 filters 构建草稿（首次挂载 / 清除时使用） */
function buildDraft(definitions: FilterParameterDefinition[], filters: ProductParameterFilter[]): Record<string, Draft> {
  const draft: Record<string, Draft> = {};
  for (const def of definitions) {
    const f = filters.find((item) => item.parameterDefinitionId === def.id);
    draft[def.id] = f
      ? {
          value: f.value ?? '',
          min: f.valueMin !== undefined ? String(f.valueMin) : '',
          max: f.valueMax !== undefined ? String(f.valueMax) : '',
        }
      : { ...EMPTY_DRAFT };
  }
  return draft;
}

/** 将草稿转换为可提交的 parameterFilters（仅保留有值的项，NUMBER 范围 valueMin<=valueMax） */
function buildFilters(
  definitions: FilterParameterDefinition[],
  draft: Record<string, Draft>,
): ProductParameterFilter[] {
  const filters: ProductParameterFilter[] = [];
  for (const def of definitions) {
    const d = draft[def.id] ?? EMPTY_DRAFT;
    if (def.dataType === 'NUMBER') {
      const valueMin = d.min !== '' ? Number(d.min) : undefined;
      const valueMax = d.max !== '' ? Number(d.max) : undefined;
      if (valueMin === undefined && valueMax === undefined) continue;
      // 避免向后端发送非法区间（否则返回 400）
      if (valueMin !== undefined && valueMax !== undefined && valueMin > valueMax) continue;
      filters.push({ parameterDefinitionId: def.id, valueMin, valueMax });
    } else if (d.value !== '') {
      filters.push({ parameterDefinitionId: def.id, value: d.value });
    }
  }
  return filters;
}

export default function ParameterFilterPanel({
  definitions,
  filters,
  onChange,
}: ParameterFilterPanelProps) {
  const [draft, setDraft] = useState<Record<string, Draft>>(() =>
    buildDraft(definitions, filters),
  );

  if (definitions.length === 0) return null;

  const handleChange = (id: string, patch: Partial<Draft>) => {
    const next = {
      ...draft,
      [id]: { ...(draft[id] ?? EMPTY_DRAFT), ...patch },
    };
    setDraft(next);
    onChange(buildFilters(definitions, next));
  };

  const handleClearAll = () => {
    const cleared = buildDraft(definitions, []);
    setDraft(cleared);
    onChange([]);
  };

  const inputClass =
    'w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">参数筛选</h3>
        <button
          type="button"
          onClick={handleClearAll}
          className="text-xs text-primary hover:underline"
        >
          清除
        </button>
      </div>

      {definitions.map((def) => {
        const d = draft[def.id] ?? EMPTY_DRAFT;
        return (
          <div key={def.id}>
            <label className="block text-sm font-medium mb-1">
              {def.name}
              {def.unit ? <span className="text-xs text-muted-foreground ml-1">({def.unit})</span> : null}
            </label>

            {def.dataType === 'NUMBER' ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={d.min}
                  onChange={(e) => handleChange(def.id, { min: e.target.value })}
                  placeholder="最小"
                  className={inputClass}
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="number"
                  value={d.max}
                  onChange={(e) => handleChange(def.id, { max: e.target.value })}
                  placeholder="最大"
                  className={inputClass}
                />
              </div>
            ) : def.dataType === 'ENUM' && def.options && def.options.length > 0 ? (
              <select
                value={d.value}
                onChange={(e) => handleChange(def.id, { value: e.target.value })}
                className={inputClass}
              >
                <option value="">全部</option>
                {def.options.map((opt) => (
                  <option key={opt.id} value={opt.value}>
                    {opt.label || opt.value}
                  </option>
                ))}
              </select>
            ) : def.dataType === 'BOOLEAN' ? (
              <select
                value={d.value}
                onChange={(e) => handleChange(def.id, { value: e.target.value })}
                className={inputClass}
              >
                <option value="">全部</option>
                <option value="true">是</option>
                <option value="false">否</option>
              </select>
            ) : (
              <input
                type="text"
                value={d.value}
                onChange={(e) => handleChange(def.id, { value: e.target.value })}
                placeholder="输入值"
                className={inputClass}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}