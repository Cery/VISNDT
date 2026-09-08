import { useEffect, useState, useCallback } from 'react';
import { Table, Spin, Alert, Button, Typography, Select, Input, Space, message, Modal } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { inquiryService } from '../api';
import type { Inquiry } from '../types';
import { BatchActionBar } from '../components/operation';
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { StatusTag } from '../components/design-system';

const { Title, Text } = Typography;

const INQUIRY_STATUS_LABEL_MAP: Record<string, string> = {
  NEW: '新建',
  PROCESSING: '处理中',
  REPLIED: '已回复',
  CLOSED: '已关闭',
};

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'NEW', label: '新建' },
  { value: 'PROCESSING', label: '处理中' },
  { value: 'REPLIED', label: '已回复' },
  { value: 'CLOSED', label: '已关闭' },
];

const BATCH_STATUS_OPTIONS = [
  { label: '新建', value: 'NEW' },
  { label: '处理中', value: 'PROCESSING' },
  { label: '已回复', value: 'REPLIED' },
  { label: '已关闭', value: 'CLOSED' },
];

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: Inquiry[]; total: number };

interface QueryParams {
  page: number;
  pageSize: number;
  keyword: string;
  status: string;
}

function InquiryList() {
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

  const fetchInquiries = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const result = await inquiryService.getList(
        query.page,
        query.pageSize,
        query.keyword || undefined,
        query.status || undefined,
      );
      if (result.data.length === 0) {
        setPageState({ status: 'empty' });
      } else {
        setPageState({
          status: 'success',
          data: result.data,
          total: result.total,
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载询价失败';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

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
      content: '确定要删除此询价吗？此操作不可撤销。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await inquiryService.remove(id);
          message.success('询价已删除');
          fetchInquiries();
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败');
        }
      },
    });
  }, [fetchInquiries]);

  const handleBatchDelete = useCallback(async (ids: string[]) => {
    setBatchLoading(true);
    const hideLoading = message.loading('正在删除...');
    try {
      await inquiryService.batchDelete(ids);
      hideLoading();
      message.success(`成功删除 ${ids.length} 个询价`);
      setSelectedRowKeys([]);
      fetchInquiries();
    } catch (err) {
      hideLoading();
      message.error(err instanceof Error ? err.message : '批量删除失败');
    } finally {
      setBatchLoading(false);
    }
  }, [fetchInquiries]);

  const handleBatchStatus = useCallback(async (ids: string[], status: string) => {
    setBatchLoading(true);
    const hideLoading = message.loading('正在更新状态...');
    try {
      await inquiryService.batchStatus(ids, status);
      hideLoading();
      message.success(`成功更新 ${ids.length} 个询价状态`);
      setSelectedRowKeys([]);
      fetchInquiries();
    } catch (err) {
      hideLoading();
      message.error(err instanceof Error ? err.message : '批量更新状态失败');
    } finally {
      setBatchLoading(false);
    }
  }, [fetchInquiries]);

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
          <Button size="small" onClick={fetchInquiries}>
            重试
          </Button>
        }
      />
    );
  }

  if (pageState.status === 'empty') {
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 4, height: 20, borderRadius: 2, background: VISNDT_COLORS.primary, flexShrink: 0 }} />
            <Title level={4} style={{ margin: 0 }}>询价管理</Title>
          </div>
          <Text type="secondary" style={{ fontSize: 12, marginLeft: 12, display: 'block', marginTop: 4 }}>
            管理买方询价、供应商响应与状态
          </Text>
        </div>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input.Search
            placeholder="搜索联系人/邮箱..."
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
          message="暂无询价"
          description="暂无询价提交。"
          showIcon
        />
      </div>
    );
  }

  const columns: ColumnsType<Inquiry> = [
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
      render: (name: string) => name || '-',
    },
    {
      title: '邮箱',
      dataIndex: 'contactEmail',
      key: 'contactEmail',
      render: (email: string) => email || '-',
    },
    {
      title: '组织',
      dataIndex: 'organization',
      key: 'organization',
      render: (org: Inquiry['organization']) => org?.name || '-',
    },
    {
      title: '能力',
      dataIndex: 'product',
      key: 'product',
      render: (product: Inquiry['product']) => product?.name || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <StatusTag status={status} label={INQUIRY_STATUS_LABEL_MAP[status] || '未知状态'} />
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
      render: (_: unknown, record: Inquiry) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/inquiries/${record.id}`)}
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
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: VISNDT_COLORS.primary, flexShrink: 0 }} />
          <Title level={4} style={{ margin: 0 }}>询价管理</Title>
        </div>
        <Text type="secondary" style={{ fontSize: 12, marginLeft: 12, display: 'block', marginTop: 4 }}>
          管理买方询价、供应商响应与状态
        </Text>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="搜索联系人/邮箱..."
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

      <BatchActionBar
        selectedRowKeys={selectedRowKeys}
        actions={[
          ...BATCH_STATUS_OPTIONS.map((opt) => ({
            key: `status:${opt.value}`,
            label: opt.label,
            confirmTitle: '确认状态变更',
            confirmContent: `确定要将选中的 ${selectedRowKeys.length} 项状态变更为「${opt.label}」吗？`,
          })),
          { key: 'delete', label: '批量删除', danger: true, icon: undefined, confirmTitle: '确认删除', confirmContent: `确定要删除选中的 ${selectedRowKeys.length} 个询价吗？此操作不可撤销。` },
        ]}
        onAction={async (actionKey, ids) => {
          if (actionKey === 'delete') {
            await handleBatchDelete(ids);
          } else if (actionKey.startsWith('status:')) {
            const status = actionKey.replace('status:', '');
            await handleBatchStatus(ids, status);
          }
        }}
        loading={batchLoading}
      />

      <Table<Inquiry>
        columns={columns}
        dataSource={pageState.data}
        rowKey="id"
        scroll={{ x: 'max-content' }}
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

export default InquiryList;