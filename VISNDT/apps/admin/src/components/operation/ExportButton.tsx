import { Button, Dropdown, message } from 'antd';
import { DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { exportToCsv } from '../../utils/export';
import type { ExportColumn } from '../../utils/export';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ExportButtonProps<T = Record<string, any>> {
  /** Current filtered data to export */
  data: T[];
  /** Column definitions for export */
  columns: ExportColumn<T>[];
  /** File name prefix (without extension) */
  fileName: string;
  /** Whether to fetch all data (not just current page) */
  onExportAll?: () => Promise<T[]>;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ExportButton<T extends Record<string, any>>({
  data,
  columns,
  fileName,
  onExportAll,
  loading = false,
  disabled = false,
}: ExportButtonProps<T>) {
  const handleExportCurrent = () => {
    if (data.length === 0) {
      message.warning('当前无数据可导出');
      return;
    }
    try {
      exportToCsv({ fileName, columns, data });
      message.success(`已导出 ${data.length} 条数据`);
    } catch {
      message.error('导出失败');
    }
  };

  const handleExportAll = async () => {
    if (!onExportAll) return;
    try {
      const allData = await onExportAll();
      if (allData.length === 0) {
        message.warning('无数据可导出');
        return;
      }
      exportToCsv({ fileName, columns, data: allData });
      message.success(`已导出全部 ${allData.length} 条数据`);
    } catch {
      message.error('导出全部数据失败');
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'current',
      label: `导出当前页 (${data.length} 条)`,
      icon: <DownloadOutlined />,
      onClick: handleExportCurrent,
    },
  ];

  if (onExportAll) {
    menuItems.push({
      key: 'all',
      label: '导出全部数据',
      icon: <FileExcelOutlined />,
      onClick: handleExportAll,
    });
  }

  return (
    <Dropdown menu={{ items: menuItems }} disabled={disabled || loading}>
      <Button icon={<DownloadOutlined />} loading={loading} disabled={disabled}>
        导出
      </Button>
    </Dropdown>
  );
}