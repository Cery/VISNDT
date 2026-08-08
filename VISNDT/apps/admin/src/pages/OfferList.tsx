import { useEffect, useState, useCallback } from 'react';
import { Table, Spin, Alert, Button, Tag, Typography, Select, Input, Space, message, Modal } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { offerService } from '../api';
import type { Offer } from '../types';
import BatchOperations from '../components/BatchOperations';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: Offer[]; total: number };

const STATUS_COLOR: Record<string, string> = {
  DRAFT: 'default',
  SUBMITTED: 'processing',
  ACCEPTED: 'success',
  REJECTED: 'error',
  WITHDRAWN: 'warning',
  ACTIVE: 'blue',
  INACTIVE: 'default',
};

const STATUS_LABEL_MAP: Record<string, string> = {
  DRAFT: '草稿',
  SUBMITTED: '已提交',
  ACCEPTED: '已接受',
  REJECTED: '已拒绝',
  WITHDRAWN: '已撤回',
  ACTIVE: '活跃',
  INACTIVE: '不活跃',
};

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'DRAFT', label: '草稿' },
  { value: 'SUBMITTED', label: '已提交' },
  { value: 'ACCEPTED', label: '已接受' },
  { value: 'REJECTED', label: '已拒绝' },
  { value: 'WITHDRAWN', label: '已撤回' },
];

const BATCH_STATUS_OPTIONS = [
  { label: '草稿', value: 'DRAFT' },
  { label: '上架', value: 'ACTIVE' },
  { label: '下架', value: 'INACTIVE' },
];

interface QueryParams {
  page: number;
  pageSize: number;
  keyword: string;
  status: string;
}

function OfferList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [query, setQuery] = useState<QueryParams>({
    page: 1,
    pageSize: 20,
    keyword: '',
    status: '',
  });

  const fetchOffers = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const result = await offerService.getList(
        query.page,
        query.pageSize,
        query.keyword || undefined,
        query.status || undefined,
      );
      if (result.data.length === 0) {
        setPageState({ status: 'empty' });
      } else {
        setPageState({ status: 'success', data: result.data, total: result.total });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载报价失败';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleTableChange = useCallback(
    (pagination: TablePaginationConfig) => {
      setQuery((prev) => ({
        ...prev,
        page: pagination.current || 1,
        pageSize: pagination.pageSize || 20,
      }));
    },
    [],
  );

  const handleSearch = useCallback((value: string) => {
    setQuery((prev) => ({ ...prev, keyword: value, page: 1 }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setQuery((prev) => ({ ...prev, status: value, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setQuery({ page: 1, pageSize: 20, keyword: '', status: '' });
  }, []);

  const handleDelete = useCallback((id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除此报价吗？此操作不可撤销。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await offerService.remove(id);
          message.success('报价已删除');
          fetchOffers();
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败');
        }
      },
    });
  }, [fetchOffers]);

  const handleBatchDelete = useCallback(async (ids: string[]) => {
    setBatchLoading(true);
    const hideLoading = message.loading('正在删除...');
    try {
      await offerService.batchDelete(ids);
      hideLoading();
      message.success(`成功删除 ${ids.length} 个报价`);
      setSelectedRowKeys([]);
      fetchOffers();
    } catch (err) {
      hideLoading();
      message.error(err instanceof Error ? err.message : '批量删除失败');
    } finally {
      setBatchLoading(false);
    }
  }, [fetchOffers]);

  const handleBatchStatus = useCallback(async (ids: string[], status: string) => {
    setBatchLoading(true);
    const hideLoading = message.loading('正在更新状态...');
    try {
      await offerService.batchStatus(ids, status);
      hideLoading();
      message.success(`成功更新 ${ids.length} 个报价状态`);
      setSelectedRowKeys([]);
      fetchOffers();
    } catch (err) {
      hideLoading();
      message.error(err instanceof Error ? err.message : '批量更新状态失败');
    } finally {
      setBatchLoading(false);
    }
  }, [fetchOffers]);

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
        message="加载报价失败"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchOffers}>
            重试
          </Button>
        }
      />
    );
  }

  if (pageState.status === 'empty') {
    return (
      <div>
        <Title level={4} style={{ marginBottom: 16 }}>
          报价管理
        </Title>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input.Search
            placeholder="搜索产品/描述..."
            allowClear
            onSearch={handleSearch}
            style={{ width: 240 }}
          />
          <Select
            placeholder="按状态筛选"
            allowClear
            value={query.status || undefined}
            onChange={handleStatusChange}
            options={STATUS_OPTIONS}
            style={{ width: 160 }}
          />
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            重置
          </Button>
        </Space>
        <Alert
          type="info"
          message="暂无报价"
          description="暂无报价创建。"
          showIcon
        />
      </div>
    );
  }

  const columns: ColumnsType<Offer> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string | undefined) => title || '-',
    },
    {
      title: '产品',
      dataIndex: 'product',
      key: 'product',
      render: (product: Offer['product']) => product?.name || '-',
    },
    {
      title: '供应商',
      dataIndex: 'organization',
      key: 'supplier',
      render: (org: Offer['organization']) => org?.name || '-',
    },
    {
      title: '业务员',
      dataIndex: 'createdByUser',
      key: 'createdByUser',
      width: 120,
      render: (user: Offer['createdByUser']) => user?.name || user?.email || '-',
    },
    {
      title: '报价金额',
      dataIndex: 'price',
      key: 'price',
      width: 140,
      render: (price: number | undefined | null, record: Offer) => {
        if (price == null) return '-';
        const currency = record.currency || 'CNY';
        const symbol = currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency;
        return `${symbol}${Number(price).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={STATUS_COLOR[status] || 'default'}>{STATUS_LABEL_MAP[status] || status}</Tag>
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
      render: (_: unknown, record: Offer) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/offers/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 4 }}>
        报价管理
      </Title>
      <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 13 }}>
        管理供应商提交的报价，报价关联具体产品和供应商组织
      </Typography.Text>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="搜索产品/描述..."
          allowClear
          onSearch={handleSearch}
          style={{ width: 240 }}
        />
        <Select
          placeholder="按状态筛选"
          allowClear
          value={query.status || undefined}
          onChange={handleStatusChange}
          options={STATUS_OPTIONS}
          style={{ width: 160 }}
        />
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          重置
        </Button>
      </Space>

      <BatchOperations
        selectedRowKeys={selectedRowKeys}
        onBatchDelete={handleBatchDelete}
        onBatchStatus={handleBatchStatus}
        statusOptions={BATCH_STATUS_OPTIONS}
        loading={batchLoading}
      />

      <Table<Offer>
        columns={columns}
        dataSource={pageState.data}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        onChange={handleTableChange}
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

export default OfferList;