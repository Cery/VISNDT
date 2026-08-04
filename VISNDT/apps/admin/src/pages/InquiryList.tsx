import { useEffect, useState, useCallback } from 'react';
import { Table, Spin, Alert, Button, Tag, Typography } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { inquiryService } from '../api';
import type { Inquiry } from '../types';

const { Title } = Typography;

const STATUS_COLOR: Record<string, string> = {
  NEW: 'blue',
  PROCESSING: 'orange',
  REPLIED: 'green',
  CLOSED: 'default',
};

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: Inquiry[]; total: number };

function InquiryList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchInquiries = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const result = await inquiryService.getList(page, pageSize);
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
  }, [page, pageSize]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

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
        <Title level={4} style={{ marginBottom: 16 }}>
          询价管理
        </Title>
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
      title: '产品',
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
        <Tag color={STATUS_COLOR[status] || 'default'}>{status}</Tag>
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
      render: (_: unknown, record: Inquiry) => (
        <Button
          type="link"
          onClick={() => navigate(`/inquiries/${record.id}`)}
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

      <Table<Inquiry>
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

export default InquiryList;