import { useEffect, useState, useCallback } from 'react';
import { Table, Spin, Alert, Button, Tag, Typography } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { offerService } from '../api';
import type { Offer } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: Offer[]; total: number };

const STATUS_COLOR: Record<string, string> = {
  DRAFT: 'orange',
  ACTIVE: 'green',
  INACTIVE: 'default',
};

function OfferList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchOffers = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const result = await offerService.getList(page, pageSize);
      if (result.data.length === 0) {
        setPageState({ status: 'empty' });
      } else {
        setPageState({ status: 'success', data: result.data, total: result.total });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load offers';
      setPageState({ status: 'error', message });
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

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
        message="Failed to load offers"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchOffers}>
            Retry
          </Button>
        }
      />
    );
  }

  if (pageState.status === 'empty') {
    return (
      <div>
        <Title level={4} style={{ marginBottom: 16 }}>
          Offer Management
        </Title>
        <Alert
          type="info"
          message="No offers"
          description="No offers have been created yet."
          showIcon
        />
      </div>
    );
  }

  const columns: ColumnsType<Offer> = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (product: Offer['product']) => product?.name || '-',
    },
    {
      title: 'Supplier',
      dataIndex: 'organization',
      key: 'supplier',
      render: (org: Offer['organization']) => org?.name || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={STATUS_COLOR[status] || 'default'}>{status}</Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: Offer) => (
        <Button
          type="link"
          onClick={() => navigate(`/offers/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        Offer Management
      </Title>

      <Table<Offer>
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
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        }}
      />
    </div>
  );
}

export default OfferList;