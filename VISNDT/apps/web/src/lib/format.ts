/**
 * 统一参数值 + 单位格式化器
 *
 * 解决问题：值与单位之间缺少空格（如 "0.02mm mm" 或 "1-10MHz MHz"）
 * 目标格式：值与单位之间有且仅有一个空格（如 "0.02 mm" 或 "1 - 10 MHz"）
 */

/**
 * 从值字符串中去除尾部重复的单位（如 "0.02mm" + unit "mm" → "0.02"）
 */
function stripTrailingUnit(value: string, unit: string): string {
  const trimmed = value.trim();
  const unitTrimmed = unit.trim();
  if (!unitTrimmed) return trimmed;
  // Case-insensitive suffix match
  if (trimmed.toLowerCase().endsWith(unitTrimmed.toLowerCase())) {
    return trimmed.slice(0, -unitTrimmed.length).trim();
  }
  return trimmed;
}

export interface ParameterValueInput {
  /** 单值 */
  value?: string | number | null;
  /** 范围最小值 */
  valueMin?: number | string | null;
  /** 范围最大值 */
  valueMax?: number | string | null;
  /** 单位 */
  unit?: string | null;
}

/**
 * 格式化参数值为可读字符串，确保值与单位之间有且仅有一个空格。
 *
 * 优先级：
 * 1. value（单值）+ unit
 * 2. valueMin/valueMax（范围）+ unit
 * 3. 无值时返回 '-'
 *
 * @example
 * formatParameterValue({ value: '0.02', unit: 'mm' })     // '0.02 mm'
 * formatParameterValue({ value: '0.02mm', unit: 'mm' })  // '0.02 mm'（去重尾部单位）
 * formatParameterValue({ valueMin: 1, valueMax: 10, unit: 'MHz' }) // '1 - 10 MHz'
 * formatParameterValue({ value: '100', unit: null })     // '100'
 * formatParameterValue({})                                  // '-'
 */
export function formatParameterValue(input: ParameterValueInput): string {
  const { value, valueMin, valueMax, unit } = input;
  const unitStr = unit?.trim() || '';

  // Case 1: range (valueMin/valueMax)
  if ((valueMin !== undefined && valueMin !== null && valueMin !== '') ||
      (valueMax !== undefined && valueMax !== null && valueMax !== '')) {
    const min = valueMin !== undefined && valueMin !== null && valueMin !== '' ? String(valueMin) : '';
    const max = valueMax !== undefined && valueMax !== null && valueMax !== '' ? String(valueMax) : '';
    let rangeStr: string;
    if (min && max) {
      rangeStr = `${min} - ${max}`;
    } else if (min) {
      rangeStr = `≥ ${min}`;
    } else {
      rangeStr = `≤ ${max}`;
    }
    return unitStr ? `${rangeStr} ${unitStr}` : rangeStr;
  }

  // Case 2: single value
  if (value !== undefined && value !== null && value !== '') {
    const valueStr = String(value).trim();
    if (!unitStr) return valueStr;
    // Strip trailing unit to avoid duplication (e.g. "0.02mm" + "mm" → "0.02 mm")
    const cleanValue = stripTrailingUnit(valueStr, unitStr);
    return `${cleanValue} ${unitStr}`;
  }

  return '-';
}

/**
 * 格式化单个值 + 单位（简写形式）
 * @example formatValueWithUnit('0.02', 'mm')   // '0.02 mm'
 * @example formatValueWithUnit(100, null)       // '100'
 */
export function formatValueWithUnit(value: string | number | null | undefined, unit?: string | null): string {
  return formatParameterValue({ value, unit });
}

// ============================================
// 预算范围格式化器（FB13）
// 统一为 "XX,XXX - XX,XXX 元" 格式
// ============================================

function formatYuan(n: number): string {
  return Math.round(n).toLocaleString('zh-CN');
}

/**
 * 格式化预算范围为统一格式 "XX,XXX - XX,XXX 元"。
 *
 * 支持的输入格式：
 * - "10000-50000"       → "10,000 - 50,000 元"
 * - "15-25万"            → "150,000 - 250,000 元"
 * - "3-5万"              → "30,000 - 50,000 元"
 * - "10000"              → "10,000 元"
 * - "15万"               → "150,000 元"
 * - 其他文本             → 原样返回
 */
export function formatBudgetRange(range: string | null | undefined): string {
  if (!range || !range.trim()) return '-';
  const trimmed = range.trim();

  // 范围 + 万: "15-25万" / "3~5万" / "3至5万"
  const wanRange = trimmed.match(/^(\d+(?:\.\d+)?)\s*[-~至到]\s*(\d+(?:\.\d+)?)\s*万$/);
  if (wanRange) {
    return `${formatYuan(Number(wanRange[1]) * 10000)} - ${formatYuan(Number(wanRange[2]) * 10000)} 元`;
  }

  // 纯数字范围: "10000-50000"
  const numRange = trimmed.match(/^(\d+(?:\.\d+)?)\s*[-~至到]\s*(\d+(?:\.\d+)?)$/);
  if (numRange) {
    return `${formatYuan(Number(numRange[1]))} - ${formatYuan(Number(numRange[2]))} 元`;
  }

  // 单值 + 万: "15万"
  const singleWan = trimmed.match(/^(\d+(?:\.\d+)?)\s*万$/);
  if (singleWan) {
    return `${formatYuan(Number(singleWan[1]) * 10000)} 元`;
  }

  // 纯数字单值: "10000"
  const singleNum = trimmed.match(/^(\d+(?:\.\d+)?)$/);
  if (singleNum) {
    return `${formatYuan(Number(singleNum[1]))} 元`;
  }

  // 其他文本原样返回
  return trimmed;
}
