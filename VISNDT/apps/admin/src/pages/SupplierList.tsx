import { useEffect, useState, useCallback } from 'react';
import { Table, Spin, Alert, Button, Input, Space, Typography } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { supplierService } from '../api';
import type { Supplier } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: Supplier[]; total: number };

function SupplierList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchSuppliers = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const result = await supplierService.getList(
        page,
        pageSize,
        searchKeyword || undefined,
      );
      if (result.items.length === 0) {
        setPageState({ status: 'empty' });
      } else {
        setPageState({
          status: 'success',
          data: result.items,
          total: result.total,
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load suppliers';
      setPageState({ status: 'error', message });
    }
  }, [page, pageSize, searchKeyword]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleSearch = useCallback(() => {
    setSearchKeyword(keyword);
    setPage(1);
  }, [keyword]);

  const handleReset = useCallback(() => {
    setKeyword('');
    setSearchKeyword('');
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
        message="Failed to load suppliers"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchSuppliers}>
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
          Supplier Management
        </Title>
        <Alert
          type="info"
          message="No suppliers"
          description="No suppliers found in the system."
          showIcon
        />
      </div>
    );
  }

  const columns: ColumnsType<Supplier> = [
    {
      title: 'Supplier Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Offers Count',
      dataIndex: 'offersCount',
      key: 'offersCount',
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: Supplier) => (
        <Button
          type="link"
          onClick={() => navigate(`/suppliers/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        Supplier Management
      </Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search by name"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 240 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          Reset
        </Button>
      </Space>

      <Table<Supplier>
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

export default SupplierList;