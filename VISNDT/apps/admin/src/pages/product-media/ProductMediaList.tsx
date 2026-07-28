import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button, Spin, Alert, Tag, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { productMediaService } from '../../api/product-media.service';
import type { ProductMediaItem, MediaType } from '../../types/product-media.types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: ProductMediaItem[]; total: number };

interface QueryParams {
  page: number;
  pageSize: number;
}

const MEDIA_TYPE_COLOR_MAP: Record<MediaType, string> = {
  IMAGE: 'blue',
  DOCUMENT: 'green',
  CERTIFICATE: 'orange',
  OTHER: 'default',
};

function ProductMediaList() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [query, setQuery] = useState<QueryParams>({ page: 1, pageSize: 20 });

  const fetchData = useCallback(async () => {
    if (!productId) return;
    setPageState({ status: 'loading' });
    try {
      const result = await productMediaService.list(productId, {
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
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load media';
      setPageState({ status: 'error', message: errorMessage });
    }
  }, [productId, query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!productId) return;
    try {
      await productMediaService.remove(productId, id);
      message.success('Media deleted successfully');
      fetchData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete media';
      message.error(errorMessage);
    }
  };

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
        message="Failed to load media"
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

  const columns: ColumnsType<ProductMediaItem> = [
    {
      title: 'Media Type',
      dataIndex: 'mediaType',
      key: 'mediaType',
      width: 120,
      render: (mediaType: MediaType) => (
        <Tag color={MEDIA_TYPE_COLOR_MAP[mediaType] || 'default'}>
          {mediaType}
        </Tag>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string | undefined) => title || '-',
    },
    {
      title: 'FileAsset ID',
      dataIndex: 'fileAssetId',
      key: 'fileAssetId',
      width: 300,
      render: (fileAssetId: string | undefined) =>
        fileAssetId ? <code style={{ fontSize: 12 }}>{fileAssetId}</code> : '-',
      ellipsis: true,
    },
    {
      title: 'Primary',
      dataIndex: 'isPrimary',
      key: 'isPrimary',
      width: 80,
      render: (isPrimary: boolean) =>
        isPrimary ? <Tag color="gold">Yes</Tag> : <Tag>No</Tag>,
    },
    {
      title: 'Display Order',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 120,
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
      width: 160,
      render: (_: unknown, record: ProductMediaItem) => (
        <span>
          <Button
            type="link"
            onClick={() =>
              navigate(
                `/products/${productId}/media/${record.id}/edit`,
              )
            }
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this media?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
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
          Product Media
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(`/products/${productId}/media/create`)}
        >
          Add Media
        </Button>
      </div>

      {pageState.status === 'empty' ? (
        <Alert
          type="info"
          message="No Media"
          description="No media has been added to this product yet. Click 'Add Media' to associate an existing FileAsset."
          showIcon
        />
      ) : (
        <Table<ProductMediaItem>
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

export default ProductMediaList;