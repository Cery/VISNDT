import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spin, Alert, Typography, Space, message, Switch } from 'antd';
import { PlusOutlined, ReloadOutlined, LinkOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { productCategoryKnowledgeMappingService, extractErrorMessage } from '../api';
import type { ProductCategoryKnowledgeMapping } from '../api/product-category-knowledge-mapping.service';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: ProductCategoryKnowledgeMapping[] };

function ProductCategoryKnowledgeMappingList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const data = await productCategoryKnowledgeMappingService.getList();
      if (data.length === 0) {
        setPageState({ status: 'empty' });
      } else {
        setPageState({ status: 'success', data });
      }
    } catch (err) {
      setPageState({ status: 'error', message: extractErrorMessage(err, '加载映射失败') });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleStatus = useCallback(
    async (id: string, currentActive: boolean) => {
      setStatusLoading(id);
      try {
        await productCategoryKnowledgeMappingService.updateStatus(id, !currentActive);
        message.success(currentActive ? '映射已停用' : '映射已启用');
        fetchData();
      } catch (err) {
        message.error(extractErrorMessage(err, '状态更新失败'));
      } finally {
        setStatusLoading(null);
      }
    },
    [fetchData],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await productCategoryKnowledgeMappingService.delete(id);
        message.success('映射已删除');
        fetchData();
      } catch (err) {
        message.error(extractErrorMessage(err, '删除失败'));
      }
    },
    [fetchData],
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
        message="加载失败"
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

  const columns: ColumnsType<ProductCategoryKnowledgeMapping> = [
    {
      title: '产品分类',
      dataIndex: ['productCategory', 'name'],
      key: 'productCategory',
      render: (name: string, record) => (
        <Space>
          <LinkOutlined />
          <span>{name}</span>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            ({record.productCategory.slug})
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: '知识分类',
      dataIndex: ['knowledgeCategory', 'name'],
      key: 'knowledgeCategory',
      render: (name: string, record) => (
        <Space direction="vertical" size={0}>
          <span>{name}</span>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Domain: {record.knowledgeCategory.domain.name}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: '知识领域',
      dataIndex: ['knowledgeCategory', 'domain', 'name'],
      key: 'domain',
      width: 120,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive: boolean, record) => (
        <Switch
          checked={isActive}
          loading={statusLoading === record.id}
          onChange={() => handleToggleStatus(record.id, isActive)}
          checkedChildren="启用"
          unCheckedChildren="停用"
        />
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_: unknown, record: ProductCategoryKnowledgeMapping) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/product-category-knowledge-mappings/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
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
        <div>
          <Title level={4} style={{ margin: 0 }}>
            产品-知识分类映射
          </Title>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            ProductCategory ↔ KnowledgeCategory 映射管理 (M24.1.1)
          </Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/product-category-knowledge-mappings/create')}
        >
          创建映射
        </Button>
      </div>

      {pageState.status === 'empty' ? (
        <Alert
          type="info"
          message="暂无映射"
          description="暂无产品-知识分类映射数据，请点击「创建映射」添加。"
          showIcon
          action={
            <Button size="small" icon={<ReloadOutlined />} onClick={fetchData}>
              刷新
            </Button>
          }
        />
      ) : (
        <>
          <Space style={{ marginBottom: 16 }}>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>
              刷新
            </Button>
          </Space>

          <Table<ProductCategoryKnowledgeMapping>
            columns={columns}
            dataSource={pageState.data}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => `共 ${total} 条映射` }}
          />
        </>
      )}
    </div>
  );
}

export default ProductCategoryKnowledgeMappingList;