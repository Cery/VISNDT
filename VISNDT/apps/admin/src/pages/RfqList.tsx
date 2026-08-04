import { useEffect, useState, useCallback } from 'react';
import { Table, Select, Space, Spin, Alert, Button, Tag, Typography } from 'antd';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { rfqService } from '../api';
import type { Rfq } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Rfq[]; total: number };

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'DRAFT', label: '草稿' },
  { value: 'OPEN', label: '开放' },
  { value: 'RESPONDING', label: '响应中' },
  { value: 'CLOSED', label: '已关闭' },
  { value: 'CANCELLED', label: '已取消' },
];

const STATUS_COLOR_MAP: Record<string, string> = {
  DRAFT: 'orange',
  OPEN: 'blue',
  RESPONDING: 'cyan',
  CLOSED: 'default',
  CANCELLED: 'red',
};

function RfqList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchRfqs = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const result = await rfqService.getList(page, pageSize);
      let filteredData = result.data;
      if (statusFilter) {
        filteredData = result.data.filter(
          (rfq) => rfq.status === statusFilter,
        );
      }
      setPageState({
        status: 'success',
        data: filteredData,
        total: statusFilter ? filteredData.length : result.total,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载询价失败';
      setPageState({ status: 'error', message });
    }
  }, [page, pageSize, statusFilter]);

  useEffect(() => {
    fetchRfqs();
  }, [fetchRfqs]);

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setStatusFilter('');
    setPage(1);
    setPageSize(20);
  }, []);

  const handleTableChange = useCallback(
    (pagination: TablePaginationConfig) => {
      setPage(pagination.current || 1);
      setPageSize(pagination.pageSize || 20);
    },
    [],
  );

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
        message="加载询价失败"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchRfqs}>
            重试
          </Button>
        }
      />
    );
  }

  const columns: ColumnsType<Rfq> = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id: string) => id.slice(0, 8) + '...',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={STATUS_COLOR_MAP[status] || 'default'}>{status}</Tag>
      ),
    },
    {
      title: '需求',
      dataIndex: 'demand',
      key: 'demand',
      render: (demand: Rfq['demand']) => demand?.title || '-',
    },
    {
      title: '创建者',
      dataIndex: 'createdByUser',
      key: 'creator',
      render: (user: Rfq['createdByUser']) => user?.name || user?.email || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: Rfq) => (
        <Button
          type="link"
          onClick={() => navigate(`/rfqs/${record.id}`)}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        询价管理
      </Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          placeholder="按状态筛选"
          allowClear
          value={statusFilter || undefined}
          onChange={handleStatusChange}
          options={STATUS_OPTIONS}
          style={{ width: 160 }}
        />
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          重置
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/rfqs/create')}
        >
          创建询价
        </Button>
      </Space>

      <Table<Rfq>
        columns={columns}
        dataSource={pageState.data}
        rowKey="id"
        onChange={handleTableChange}
        pagination={{
          current: page,
          pageSize,
          total: pageState.total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        }}
      />
    </div>
  );
}

export default RfqList;