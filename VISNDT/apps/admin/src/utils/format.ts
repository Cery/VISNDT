/**
 * 预算范围格式化器（FB13）
 * 统一为 "XX,XXX - XX,XXX 元" 格式
 */

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
