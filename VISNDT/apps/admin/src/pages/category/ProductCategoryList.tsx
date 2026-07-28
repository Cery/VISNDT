import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spin, Alert, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { categoryService } from '../../api/category.service';
import type { ProductCategory } from '../../types/category.types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: ProductCategory[]; total: number };

interface QueryParams {
  page: number;
  pageSize: number;
}

function ProductCategoryList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [query, setQuery] = useState<QueryParams>({
    page: 1,
    pageSize: 20,
  });

  const fetchData = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const result = await categoryService.list({
        page: query.page,
        pageSize: query.pageSize,
      });
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
        err instanceof Error ? err.message : 'Failed to load categories';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        message="Failed to load categories"
        description={pageState.message}
        showIcon
        action={
          <Button size="small" onClick={fetchData}>
            Retry
          </Button>
        }
      />
    );
  }

  const columns: ColumnsType<ProductCategory> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <span style={{ fontWeight: 500 }}>{name}</span>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => <code>{slug}</code>,
    },
    {
      title: 'Parent',
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId: string | undefined) => parentId || '-',
    },
    {
      title: 'Children',
      dataIndex: 'children',
      key: 'children',
      width: 100,
      render: (children: ProductCategory['children']) =>
        children ? children.length : 0,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_: unknown, record: ProductCategory) => (
        <Button
          type="link"
          onClick={() => navigate(`/product-categories/${record.id}/edit`)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Categories
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/product-categories/create')}
        >
          Create Category
        </Button>
      </div>

      {pageState.status === 'empty' ? (
        <Alert
          type="info"
          message="No Categories"
          description="No categories have been created yet. Click 'Create Category' to add one."
          showIcon
        />
      ) : (
        <Table<ProductCategory>
          columns={columns}
          dataSource={pageState.data}
          rowKey="id"
          onChange={handleTableChange}
          pagination={{
            current: query.page,
            pageSize: query.pageSize,
            total: pageState.total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          }}
        />
      )}
    </div>
  );
}

export default ProductCategoryList;