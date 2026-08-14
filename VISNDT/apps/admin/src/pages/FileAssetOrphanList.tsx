import { useEffect, useState, useCallback, useMemo } from 'react';
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
  Select,
  Input,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { ExclamationCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { fileAssetService } from '../api';
import type { FileAsset } from '../types';
import { getFileTypeIcon, formatFileSize } from '../utils/file-utils';
import { BatchActionBar } from '../components/operation';

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
  const [batchLoading, setBatchLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterFileType, setFilterFileType] = useState<string>('');

  const filteredOrphans = useMemo(() => {
    if (pageState.status !== 'success') return [];
    let list = pageState.data;
    if (searchText) {
      const lower = searchText.toLowerCase();
      list = list.filter(
        (f) =>
          f.fileName.toLowerCase().includes(lower) ||
          (f.mimeType && f.mimeType.toLowerCase().includes(lower)),
      );
    }
    if (filterFileType) {
      list = list.filter((f) => f.fileType === filterFileType);
    }
    return list;
  }, [pageState, searchText, filterFileType]);

  const FILE_TYPE_OPTIONS = [
    { value: '', label: '全部类型' },
    { value: 'IMAGE', label: '图片' },
    { value: 'DOCUMENT', label: '文档' },
    { value: 'CERTIFICATE', label: '证书' },
    { value: 'OTHER', label: '其他' },
  ];

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
        err instanceof Error ? err.message : '加载孤立文件失败';
      setPageState({ status: 'error', message: errorMessage });
    }
  }, []);

  useEffect(() => {
    fetchOrphans();
  }, [fetchOrphans]);

  const handleBatchDelete = useCallback(async (ids: string[]) => {
    confirm({
      title: '清理孤立文件',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>
            您即将删除 <strong>{ids.length}</strong> 个孤立文件。
          </p>
          <p style={{ color: '#ff4d4f' }}>
            此操作将永久从数据库和存储中删除文件，且不可撤销。
          </p>
        </div>
      ),
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        setBatchLoading(true);
        try {
          const result = await fileAssetService.cleanupOrphans(ids);

          if (result.failed.length > 0) {
            message.warning(
              `已删除 ${result.deleted} 个孤立文件，${result.failed.length} 个文件删除失败。`,
            );
          } else {
            message.success(
              `成功删除 ${result.deleted} 个孤立文件。`,
            );
          }

          await fetchOrphans();
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : '清理孤立文件失败';
          message.error(errorMessage);
        } finally {
          setBatchLoading(false);
        }
      },
    });
  }, [fetchOrphans]);

  const rowSelection: TableRowSelection<FileAsset> = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  const columns: ColumnsType<FileAsset> = [
    {
      title: '文件',
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
      title: '类型',
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
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 100,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '存储路径',
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
      title: '创建时间',
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
        message="加载孤立文件失败"
        description={pageState.message}
        showIcon
        action={
          <Button onClick={fetchOrphans} type="primary">
            重试
          </Button>
        }
      />
    );
  }

  if (pageState.status === 'empty') {
    return (
      <div>
        <Title level={4} style={{ marginBottom: 24 }}>
          孤立文件
        </Title>
        <Alert
          type="success"
          message="无孤立文件"
          description="所有文件资产已正确关联到产品媒体记录，无需清理。"
          showIcon
          action={
            <Button onClick={fetchOrphans}>刷新</Button>
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
          孤立文件
        </Title>
        <Space>
          <Input.Search
            placeholder="搜索文件名..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => setSearchText(value)}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Select
            placeholder="文件类型"
            allowClear
            value={filterFileType || undefined}
            onChange={(value) => setFilterFileType(value || '')}
            options={FILE_TYPE_OPTIONS}
            style={{ width: 140 }}
          />
          <Button icon={<ReloadOutlined />} onClick={() => { setSearchText(''); setFilterFileType(''); fetchOrphans(); }}>
            重置
          </Button>
          <Button onClick={fetchOrphans}>刷新</Button>
        </Space>
      </div>

      <BatchActionBar
        selectedRowKeys={selectedRowKeys}
        actions={[
          { key: 'delete', label: '清理孤立文件', danger: true, icon: undefined, confirmTitle: '清理孤立文件', confirmContent: '此操作将永久从数据库和存储中删除文件，且不可撤销。' },
        ]}
        onAction={async (actionKey, ids) => {
          if (actionKey === 'delete') {
            await handleBatchDelete(ids);
          }
        }}
        loading={batchLoading}
      />

      <Table<FileAsset>
        rowKey="id"
        columns={columns}
        dataSource={filteredOrphans}
        rowSelection={rowSelection}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 个孤立文件`,
        }}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: searchText || filterFileType ? '未找到匹配的孤立文件' : '暂无数据' }}
      />
    </div>
  );
}

export default FileAssetOrphanList;