import { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Spin,
  Alert,
  Button,
  Tag,
  Typography,
  Modal,
  message,
  Space,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { fileAssetService } from '../api';
import type { FileAsset } from '../types';
import { getFileTypeIcon, formatFileSize } from '../utils/file-utils';

const { Title } = Typography;
const { confirm } = Modal;

const FILE_TYPE_COLOR: Record<string, string> = {
  IMAGE: 'blue',
  DOCUMENT: 'green',
  CERTIFICATE: 'gold',
  OTHER: 'default',
};

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: FileAsset[] };

function FileAssetOrphanList() {
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [cleaningUp, setCleaningUp] = useState(false);

  const fetchOrphans = useCallback(async () => {
    setPageState({ status: 'loading' });
    setSelectedRowKeys([]);
    try {
      const orphans = await fileAssetService.getOrphans();
      if (orphans.length === 0) {
        setPageState({ status: 'empty' });
      } else {
        setPageState({ status: 'success', data: orphans });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load orphan files';
      setPageState({ status: 'error', message: errorMessage });
    }
  }, []);

  useEffect(() => {
    fetchOrphans();
  }, [fetchOrphans]);

  const handleCleanup = useCallback(() => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one orphan file to clean up');
      return;
    }

    confirm({
      title: 'Clean Up Orphan Files',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>
            You are about to delete{' '}
            <strong>{selectedRowKeys.length}</strong> orphan file
            {selectedRowKeys.length > 1 ? 's' : ''}.
          </p>
          <p style={{ color: '#ff4d4f' }}>
            This action will permanently delete the files from the database and
            storage. This cannot be undone.
          </p>
        </div>
      ),
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setCleaningUp(true);
        try {
          const result = await fileAssetService.cleanupOrphans(
            selectedRowKeys as string[],
          );

          if (result.failed.length > 0) {
            message.warning(
              `Deleted ${result.deleted} orphan file(s). ${result.failed.length} file(s) failed to delete.`,
            );
          } else {
            message.success(
              `Successfully deleted ${result.deleted} orphan file(s).`,
            );
          }

          await fetchOrphans();
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to clean up orphan files';
          message.error(errorMessage);
        } finally {
          setCleaningUp(false);
        }
      },
    });
  }, [selectedRowKeys, fetchOrphans]);

  const rowSelection: TableRowSelection<FileAsset> = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  const columns: ColumnsType<FileAsset> = [
    {
      title: 'File',
      dataIndex: 'fileName',
      key: 'fileName',
      width: 260,
      render: (name: string, record: FileAsset) => (
        <Space>
          {getFileTypeIcon(record.fileType)}
          <span style={{ wordBreak: 'break-all' }}>{name}</span>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'fileType',
      key: 'fileType',
      width: 110,
      render: (type: string) => (
        <Tag color={FILE_TYPE_COLOR[type] || 'default'}>{type}</Tag>
      ),
    },
    {
      title: 'MIME',
      dataIndex: 'mimeType',
      key: 'mimeType',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 100,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: 'Storage Key',
      dataIndex: 'storageKey',
      key: 'storageKey',
      width: 280,
      ellipsis: true,
      render: (key: string) => (
        <Typography.Text copyable={{ text: key }} style={{ fontSize: 12 }}>
          {key}
        </Typography.Text>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  if (pageState.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (pageState.status === 'error') {
    return (
      <Alert
        type="error"
        message="Failed to Load Orphan Files"
        description={pageState.message}
        showIcon
        action={
          <Button onClick={fetchOrphans} type="primary">
            Retry
          </Button>
        }
      />
    );
  }

  if (pageState.status === 'empty') {
    return (
      <div>
        <Title level={4} style={{ marginBottom: 24 }}>
          Orphan Files
        </Title>
        <Alert
          type="success"
          message="No Orphan Files"
          description="All FileAssets are properly linked to ProductMedia records. No cleanup needed."
          showIcon
          action={
            <Button onClick={fetchOrphans}>Refresh</Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Orphan Files
        </Title>
        <Space>
          <Button onClick={fetchOrphans}>Refresh</Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleCleanup}
            loading={cleaningUp}
            disabled={selectedRowKeys.length === 0}
          >
            Cleanup Selected ({selectedRowKeys.length})
          </Button>
        </Space>
      </div>

      <Table<FileAsset>
        rowKey="id"
        columns={columns}
        dataSource={pageState.data}
        rowSelection={rowSelection}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} orphan file(s)`,
        }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
}

export default FileAssetOrphanList;