import { useEffect, useState, useCallback } from 'react';
import { Table, Spin, Alert, Button, Typography, Select, Space } from 'antd';
import type { Key } from 'react';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { supplierProductService } from '../api';
import type { SupplierProduct } from '../types';
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { StatusTag } from '../components/design-system';

const { Title, Text } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: SupplierProduct[]; total: number };

const STATUS_LABEL_MAP: Record<string, string> = {
  DRAFT: '草稿',
  SUBMITTED: '已提交',
  REVIEWING: '审核中',
  APPROVED: '已通过',
  PUBLISHED: '已发布',
  REJECTED: '已拒绝',
};

const STATUS_OPTIONS = Object.entries(STATUS_LABEL_MAP).map(([value, label]) => ({
  value,
  label,
}));

interface QueryParams {
  page: number;
  pageSize: number;
  status: string;
}

function SupplierProductList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [query, setQuery] = useState<QueryParams>({
    page: 1,
    pageSize: 20,
    status: '',
  });
  // P2-E Selection Model — UI preparation only. NO batch API / workflow (D8 FROZEN).
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const fetchData = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const result = await supplierProductService.getList(
        query.page,
        query.pageSize,
        query.status || undefined,
      );
      if (result.data.length === 0) {
        setPageState({ status: 'empty' });
      } else {
        setPageState({ status: 'success', data: result.data, total: result.total });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载产品型号池失败';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    setQuery((prev) => ({
      ...prev,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 20,
    }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setQuery((prev) => ({ ...prev, status: value, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setQuery({ page: 1, pageSize: 20, status: '' });
  }, []);

  const renderHeader = () => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 4, height: 20, borderRadius: 2, background: VISNDT_COLORS.primary, flexShrink: 0 }} />
        <Title level={4} style={{ margin: 0 }}>产品型号管理</Title>
      </div>
      <Text type="secondary" style={{ fontSize: 12, marginLeft: 12, display: 'block', marginTop: 4 }}>
        产品型号审核池 — 平台级审核，跨组织
      </Text>
    </div>
  );

  const renderToolbar = () => (
    <Space style={{ marginBottom: 16 }} wrap>
      <Select
        placeholder="按状态筛选"
        allowClear
        value={query.status || undefined}
        onChange={handleStatusChange}
        options={[{ value: '', label: '全部状态' }, ...STATUS_OPTIONS]}
        style={{ width: 160 }}
      />
      <Button icon={<ReloadOutlined />} onClick={handleReset}>
        重置
      </Button>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => navigate('/supplier-products/create')}
      >
        新建产品型号
      </Button>
    </Space>
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
        message="加载产品型号池失败"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchData}>
            重试
          </Button>
        }
      />
    );
  }

  if (pageState.status === 'empty') {
    return (
      <div>
        {renderHeader()}
        {renderToolbar()}
        <Alert
          type="info"
          message="暂无产品型号"
          description="当前没有可审核的产品型号。"
          showIcon
        />
      </div>
    );
  }

  const columns: ColumnsType<SupplierProduct> = [
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      render: (brand: string) => brand || '-',
    },
    {
      title: '型号',
      dataIndex: 'modelNumber',
      key: 'modelNumber',
      render: (model: string, record: SupplierProduct) =>
        record.series ? `${record.series} ${model}` : model,
    },
    {
      title: '所属能力',
      dataIndex: 'platformProduct',
      key: 'platformProduct',
      render: (pp: SupplierProduct['platformProduct']) => pp?.name || '-',
    },
    {
      title: '所属组织',
      dataIndex: 'organization',
      key: 'organization',
      render: (org: SupplierProduct['organization']) => org?.name || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <StatusTag status={status} label={STATUS_LABEL_MAP[status] || '未知状态'} />
      ),
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
      fixed: 'right' as const,
      render: (_: unknown, record: SupplierProduct) => (
        <Button
          type="link"
          onClick={() => navigate(`/supplier-products/${record.id}`)}
        >
          审核
        </Button>
      ),
    },
  ];

  return (
    <div>
      {renderHeader()}
      {renderToolbar()}
      {selectedRowKeys.length > 0 && (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message={`已选择 ${selectedRowKeys.length} 项产品型号`}
          description={
            <Space direction="vertical" size={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                批量操作（D8）尚未实现 — 当前为选择模型前端准备，仅保留扩展边界。
              </Text>
              <Button size="small" onClick={() => setSelectedRowKeys([])}>
                取消选择
              </Button>
            </Space>
          }
        />
      )}
      <Table<SupplierProduct>
        columns={columns}
        dataSource={pageState.data}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        onChange={handleTableChange}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{
          current: query.page,
          pageSize: query.pageSize,
          total: pageState.total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`,
        }}
      />
    </div>
  );
}

export default SupplierProductList;