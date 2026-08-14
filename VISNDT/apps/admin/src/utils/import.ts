/**
 * Frontend CSV Import Utility
 * Parses CSV files and returns structured data.
 * Zero backend dependency — pure frontend operation.
 */

export interface ImportResult<T = Record<string, string>> {
  headers: string[];
  rows: T[];
  totalRows: number;
  parseErrors: string[];
}

/**
 * Parse a CSV file and return structured data.
 * Supports BOM, quoted fields, and multi-line fields.
 */
export function parseCsvFile(file: File): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = (e.target?.result as string) || '';
        const result = parseCsvText(text);
        resolve(result);
      } catch (err) {
        reject(new Error(`CSV 解析失败: ${err instanceof Error ? err.message : '未知错误'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsText(file, 'UTF-8');
  });
}

function parseCsvText(text: string): ImportResult {
  const parseErrors: string[] = [];

  // Remove BOM if present
  const cleanText = text.replace(/^\uFEFF/, '');

  // Split into lines, handling quoted multi-line fields
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    }

    if (char === '\n' && !inQuotes) {
      lines.push(currentLine.trimEnd());
      currentLine = '';
    } else if (char === '\r' && !inQuotes) {
      // Skip \r in \r\n
      if (cleanText[i + 1] === '\n') {
        i++;
      }
      lines.push(currentLine.trimEnd());
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine.trimEnd());
  }

  if (lines.length === 0) {
    parseErrors.push('文件为空');
    return { headers: [], rows: [], totalRows: 0, parseErrors };
  }

  // Parse header
  const headers = parseCsvLine(lines[0]);

  // Parse data rows
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    if (values.length === 0) continue;

    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || '';
    });
    rows.push(row);

    // Check column count mismatch
    if (values.length !== headers.length && values.length > 0) {
      parseErrors.push(`第 ${i + 1} 行列数不匹配 (期望 ${headers.length}, 实际 ${values.length})`);
    }
  }

  return {
    headers,
    rows,
    totalRows: rows.length,
    parseErrors,
  };
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  return values;
}