import { Button, Modal, message, Space } from 'antd';

interface BatchAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  confirmTitle?: string;
  confirmContent?: string;
}

interface BatchActionBarProps {
  /** Currently selected row keys */
  selectedRowKeys: React.Key[];
  /** Available batch actions */
  actions: BatchAction[];
  /** Called when an action is triggered */
  onAction: (actionKey: string, ids: string[]) => Promise<void>;
  /** Loading state */
  loading?: boolean;
  /** Placeholder text when no selection */
  placeholder?: string;
}

export default function BatchActionBar({
  selectedRowKeys,
  actions,
  onAction,
  loading = false,
  placeholder = '勾选数据行后，可进行批量操作',
}: BatchActionBarProps) {
  const count = selectedRowKeys.length;

  if (count === 0) {
    return (
      <div
        className="admin-batch-bar"
        style={{
          padding: '8px 16px',
          background: 'var(--surface-muted, #f5f5f5)',
          borderRadius: 6,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          color: 'var(--text-muted, #999)',
          fontSize: 13,
        }}
      >
        {placeholder}
      </div>
    );
  }

  const handleAction = async (action: BatchAction) => {
    const confirmTitle = action.confirmTitle || '确认操作';
    const confirmContent =
      action.confirmContent || `确定要对选中的 ${count} 项执行「${action.label}」操作吗？`;

    Modal.confirm({
      title: confirmTitle,
      content: confirmContent,
      okText: '确认',
      okType: action.danger ? 'danger' : 'primary',
      cancelText: '取消',
      onOk: async () => {
        try {
          await onAction(action.key, selectedRowKeys as string[]);
        } catch (err) {
          message.error(err instanceof Error ? err.message : '批量操作失败');
        }
      },
    });
  };

  return (
    <div
      className="admin-batch-bar"
      style={{
        padding: '8px 16px',
        background: '#e6f4ff',
        borderRadius: 6,
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      <span style={{ color: '#2563eb', fontWeight: 500, fontSize: 13 }}>
        已选择 {count} 项
      </span>
      <Space wrap>
        {actions.map((action) => (
          <Button
            key={action.key}
            danger={action.danger}
            icon={action.icon}
            loading={loading}
            size="small"
            onClick={() => handleAction(action)}
          >
            {action.label}
          </Button>
        ))}
      </Space>
    </div>
  );
}