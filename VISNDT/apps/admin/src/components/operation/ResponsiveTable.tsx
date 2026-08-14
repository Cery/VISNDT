import { Table } from 'antd';
import type { TableProps } from 'antd';
import type { ColumnType } from 'antd/es/table';

export default function ResponsiveTable<T extends object = any>({
  columns,
  scroll,
  ...restProps
}: TableProps<T>) {
  const resolvedScroll = scroll ?? { x: 'max-content' };

  const resolvedColumns = columns?.map((col, index) => {
    const typedCol = col as ColumnType<T> & { fixed?: string };
    const isLast = index === columns.length - 1;
    if (isLast && typedCol.key === 'actions' && !typedCol.fixed) {
      return { ...typedCol, fixed: 'right' as const };
    }
    return typedCol;
  });

  return (
    <Table<T>
      columns={resolvedColumns}
      scroll={resolvedScroll}
      {...restProps}
    />
  );
}