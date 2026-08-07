import { Button, Dropdown, Space, Modal, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

interface BatchOperationsProps {
  selectedRowKeys: React.Key[];
  onBatchDelete?: (ids: string[]) => Promise<void>;
  onBatchStatus?: (ids: string[], status: string) => Promise<void>;
  statusOptions?: { label: string; value: string }[];
  loading?: boolean;
  deleteTitle?: string;
  deleteDescription?: string;
}

export default function BatchOperations({
  selectedRowKeys,
  onBatchDelete,
  onBatchStatus,
  statusOptions,
  loading = false,
  deleteTitle = '确认删除',
  deleteDescription,
}: BatchOperationsProps) {
  const count = selectedRowKeys.length;
  if (count === 0) return null;

  const handleDelete = () => {
    const desc =
      deleteDescription || `确定要删除选中的 ${count} 项吗？此操作不可撤销。`;
    Modal.confirm({
      title: deleteTitle,
      content: desc,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        if (onBatchDelete) {
          try {
            await onBatchDelete(selectedRowKeys as string[]);
            message.success(`成功删除 ${count} 项`);
          } catch (err) {
            console.error('Batch delete error:', err);
            message.error(err instanceof Error ? err.message : '批量删除失败，请重试。');
          }
        }
      },
    });
  };

  const handleStatusChange: MenuProps['onClick'] = async ({ key }) => {
    const option = statusOptions?.find((o) => o.value === key);
    Modal.confirm({
      title: '确认状态变更',
      content: `确定要将选中的 ${count} 项状态变更为「${option?.label || key}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        if (onBatchStatus) {
          try {
            await onBatchStatus(selectedRowKeys as string[], key);
            message.success(`成功更新 ${count} 项状态`);
          } catch (err) {
            console.error('Batch status change error:', err);
            message.error(err instanceof Error ? err.message : '批量状态变更失败，请重试。');
          }
        }
      },
    });
  };

  const statusMenuItems: MenuProps['items'] = (statusOptions || []).map(
    (opt) => ({
      key: opt.value,
      label: opt.label,
    }),
  );

  return (
    <div
      style={{
        padding: '8px 16px',
        background: '#e6f4ff',
        borderRadius: 6,
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span style={{ color: '#1677ff', fontWeight: 500 }}>
        已选择 {count} 项
      </span>
      <Space>
        {onBatchStatus && statusOptions && statusOptions.length > 0 && (
          <Dropdown
            menu={{ items: statusMenuItems, onClick: handleStatusChange }}
            disabled={loading}
          >
            <Button loading={loading}>批量状态变更</Button>
          </Dropdown>
        )}
        {onBatchDelete && (
          <Button
            danger
            icon={<DeleteOutlined />}
            loading={loading}
            onClick={handleDelete}
          >
            批量删除
          </Button>
        )}
      </Space>
    </div>
  );
}