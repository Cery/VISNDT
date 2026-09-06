'use client';

import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Pagination, EmptyState } from '@visndt/design-system';

export interface TableColumn<T> {
  key: string;
  title: ReactNode;
  /** 取单元格内容：优先 dataIndex，其次 render */
  dataIndex?: keyof T & string;
  render?: (record: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  /** 最小宽度（用于水平滚动时保证列稳定） */
  minWidth?: number;
  /** 移动端折叠卡片模式下仍需展示的列 */
  stackPriority?: boolean;
  className?: string;
}

export interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (record: T) => string;
  loading?: boolean;
  error?: ReactNode;
  empty?: ReactNode;
  pagination?: TablePagination;
  /**
   * 响应式策略（WP-2 §14）：horizontal = 水平滚动；stacked = 移动端卡片堆叠。
   * 具体页面在 Page Batch 中选用，本 Primitive 提供两种能力。
   */
  responsive?: 'horizontal' | 'stacked';
  hideHeader?: boolean;
  'aria-label'?: string;
}

/**
 * VISNDT 统一 Table Primitive（WP-2 §14）：
 * Header / Body / Row / Cell / Empty / Loading / Error / Pagination + Responsive Strategy。
 * 业务状态以 Status/StatusDisplay 展示，不在本组件内硬编码颜色。
 */
export function Table<T>({
  columns,
  data,
  rowKey,
  loading = false,
  error,
  empty,
  pagination,
  responsive = 'horizontal',
  hideHeader = false,
  'aria-label': ariaLabel = '数据表格',
}: TableProps<T>) {
  const showEmpty = !loading && !error && data.length === 0;
  const showError = !loading && !!error;

  if (showError) {
    return <div role="alert" className="py-10 text-center text-sm text-destructive">{error}</div>;
  }

  if (showEmpty) {
    return empty ?? <EmptyState title="暂无数据" description="当前筛选条件下没有可显示的数据" />;
  }

  if (loading) {
    return (
      <div role="status" className="flex justify-center py-12 text-muted-foreground">
        <Loader2 aria-hidden="true" className="h-6 w-6 animate-spin" />
        <span className="sr-only">加载中</span>
      </div>
    );
  }

  if (responsive === 'stacked') {
    return (
      <div className="space-y-3">
        <div className="hidden sm:block overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-max border-collapse text-sm">
            <tbody>
              {data.map((record, i) => (
                <tr key={rowKey(record)} className="border-b border-border last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2 align-top">
                      <span className="text-xs font-medium text-muted-foreground">{col.title}</span>
                      <div className="mt-0.5">{col.render ? col.render(record, i) : String(record[col.dataIndex!] ?? '')}</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile：卡片堆叠展示（替代竖排挤爆的表格） */}
        <ul className="space-y-3 sm:hidden">
          {data.map((record, i) => (
            <li key={rowKey(record)} className="rounded-md border border-border bg-card p-4">
              <ul className="space-y-2">
                {columns.map((col) => (
                  <li key={col.key} className="flex items-start justify-between gap-3 text-sm">
                    <span className="shrink-0 text-muted-foreground">{col.title}</span>
                    <span className="text-right text-foreground">
                      {col.render ? col.render(record, i) : String(record[col.dataIndex!] ?? '')}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        {pagination && <PaginationFooter pagination={pagination} />}
      </div>
    );
  }

  // 默认 horizontal scroll
  return (
    <div>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full border-collapse text-sm" aria-label={ariaLabel}>
          {!hideHeader && (
            <thead className="bg-muted">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                    className={`px-3 py-2.5 text-left font-medium text-muted-foreground ${
                      col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''
                    }`}
                  >
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {data.map((record, i) => (
              <tr key={rowKey(record)} className="border-t border-border transition-colors hover:bg-muted/50">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-3 py-2.5 ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''} ${
                      col.className ?? ''
                    }`}
                  >
                    {col.render ? col.render(record, i) : String(record[col.dataIndex!] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && <PaginationFooter pagination={pagination} />}
    </div>
  );
}

function PaginationFooter<T>({ pagination }: { pagination: NonNullable<TableProps<T>['pagination']> }) {
  const { page, pageSize, total, onChange } = pagination;
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">
        共 {total} 条 · 每页 {pageSize} 条
      </span>
      <Pagination page={page} pageSize={pageSize} total={total} onChange={onChange} size="sm" />
    </div>
  );
}