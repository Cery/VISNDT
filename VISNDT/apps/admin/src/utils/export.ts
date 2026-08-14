/**
 * Frontend CSV Export Utility
 * Converts structured data to CSV and triggers browser download.
 * Zero backend dependency — pure frontend operation.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ExportColumn<T = Record<string, any>> {
  key: string;
  title: string;
  render?: (item: T) => string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ExportOptions<T = Record<string, any>> {
  fileName: string;
  columns: ExportColumn<T>[];
  data: T[];
}

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToCsv<T extends Record<string, any>>(options: ExportOptions<T>): void {
  const { fileName, columns, data } = options;

  // Build CSV header
  const header = columns.map((col) => escapeCsvField(col.title)).join(',');

  // Build CSV rows
  const rows = data.map((item) =>
    columns
      .map((col) => {
        const value = col.render ? col.render(item) : String(item[col.key] ?? '');
        return escapeCsvField(value);
      })
      .join(','),
  );

  // Add BOM for Excel UTF-8 compatibility
  const BOM = '\uFEFF';
  const csv = BOM + [header, ...rows].join('\n');

  // Trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert exported data to a flat record array for CSV export.
 * Handles nested objects by flattening with the column render function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function flattenForExport<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn<T>[],
): Record<string, string>[] {
  return data.map((item) => {
    const row: Record<string, string> = {};
    columns.forEach((col) => {
      row[col.key] = col.render ? col.render(item) : String(item[col.key] ?? '');
    });
    return row;
  });
}