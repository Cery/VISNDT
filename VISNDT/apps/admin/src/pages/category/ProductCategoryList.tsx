import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spin, Alert, Typography, Input, Space, message, Modal, Card, Row, Col, Statistic } from 'antd';
import { PlusOutlined, ReloadOutlined, ApartmentOutlined, NodeIndexOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { categoryService, extractErrorMessage } from '../../api';
import type { ProductCategory } from '../../types/category.types';
import { BatchActionBar } from '../../components/operation';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: ProductCategory[]; total: number };

function ProductCategoryList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryStats, setCategoryStats] = useState({ total: 0, maxDepth: 0, leafCount: 0 });

  // Compute category tree statistics
  const computeStats = useCallback((allCategories: ProductCategory[]) => {
    const total = allCategories.length;
    let maxDepth = 0;
    let leafCount = 0;

    const walkTree = (nodes: ProductCategory[], depth: number) => {
      maxDepth = Math.max(maxDepth, depth);
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          walkTree(node.children, depth + 1);
        } else {
          leafCount++;
        }
      });
    };

    // Find root nodes (no parentId) and walk
    const roots = allCategories.filter((c) => !c.parentId);
    if (roots.length > 0) {
      walkTree(roots, 1);
    } else {
      walkTree(allCategories, 1);
    }
    setCategoryStats({ total, maxDepth, leafCount });
  }, []);

  const fetchData = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      // 获取所有分类数据（不分页），树形需要完整数据
      const result = await categoryService.getList({ pageSize: 100 });
      computeStats(result.data);
      if (result.data.length === 0) {
        setPageState({ status: 'empty' });
      } else {
        // 构建树形数据：顶层节点（parentId == null）作为根节点，children 自动展开
        const topLevel = result.data.filter((c) => !c.parentId);
        if (topLevel.length === 0) {
          // 如果没有顶层节点，则全部作为根节点
          setPageState({
            status: 'success',
            data: result.data,
            total: result.data.length,
          });
        } else {
          setPageState({
            status: 'success',
            data: topLevel,
            total: result.data.length,
          });
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载分类失败';
      setPageState({ status: 'error', message });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 客户端搜索过滤：按名称和标识匹配，递归保留匹配节点及其父路径
  const filteredData = useMemo(() => {
    if (pageState.status !== 'success') return [];
    if (!searchKeyword) return pageState.data;

    const keyword = searchKeyword.toLowerCase();

    const filterTree = (nodes: ProductCategory[]): ProductCategory[] => {
      return nodes.reduce<ProductCategory[]>((acc, node) => {
        const matches =
          node.name.toLowerCase().includes(keyword) ||
          node.slug.toLowerCase().includes(keyword);
        const filteredChildren = node.children
          ? filterTree(node.children)
          : [];

        if (matches || filteredChildren.length > 0) {
          acc.push({
            ...node,
            children:
              filteredChildren.length > 0 ? filteredChildren : node.children,
          });
        }
        return acc;
      }, []);
    };

    return filterTree(pageState.data);
  }, [searchKeyword, pageState]);

  const handleSearch = useCallback((value: string) => {
    setSearchKeyword(value);
  }, []);

  const handleReset = useCallback(() => {
    setSearchKeyword('');
  }, []);

  const handleDelete = useCallback((id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除此分类吗？此操作不可撤销。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await categoryService.remove(id);
          message.success('分类已删除');
          fetchData();
        } catch (err) {
          message.error(extractErrorMessage(err, '删除失败'));
        }
      },
    });
  }, [fetchData]);

  const handleBatchDelete = useCallback(async (ids: string[]) => {
    setBatchLoading(true);
    const hideLoading = message.loading('正在删除...');
    try {
      const result = await categoryService.batchDelete(ids);
      hideLoading();
      const succeeded = result.succeeded?.length ?? 0;
      const failed = result.failed ?? [];
      if (succeeded > 0) {
        message.success(`成功删除 ${succeeded} 个分类`);
      }
      if (failed.length > 0) {
        failed.forEach((f) => {
          message.error(`删除失败: ${f.reason}`);
        });
      }
      setSelectedRowKeys([]);
      fetchData();
    } catch (err) {
      hideLoading();
      message.error(err instanceof Error ? err.message : '批量删除失败');
    } finally {
      setBatchLoading(false);
    }
  }, [fetchData]);

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
        message="加载分类失败"
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

  const columns: ColumnsType<ProductCategory> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <span style={{ fontWeight: 500 }}>{name}</span>
      ),
    },
    {
      title: '标识',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => <code>{slug}</code>,
    },
    {
      title: '子级',
      dataIndex: 'children',
      key: 'children',
      width: 100,
      render: (children: ProductCategory['children']) =>
        children ? children.length : 0,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 80,
      fixed: 'right' as const,
      render: (_: unknown, record: ProductCategory) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/product-categories/${record.id}/edit`)}
          >
            编辑
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
            分类管理
          </Title>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            管理产品分类层级结构，分类用于组织产品目录
          </Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/product-categories/create')}
        >
          创建分类
        </Button>
      </div>

      {/* Category Governance Stats */}
      {categoryStats.total > 0 && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={12} sm={8}>
            <Card size="small">
              <Statistic title="分类总数" value={categoryStats.total} prefix={<ApartmentOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={8}>
            <Card size="small">
              <Statistic title="树深度" value={categoryStats.maxDepth} suffix="层" prefix={<NodeIndexOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={8}>
            <Card size="small">
              <Statistic title="叶子分类" value={categoryStats.leafCount} prefix={<FileTextOutlined />} />
            </Card>
          </Col>
        </Row>
      )}

      {pageState.status === 'empty' ? (
        <>
          <Space style={{ marginBottom: 16 }} wrap>
            <Input.Search
              placeholder="搜索名称/标识..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 240 }}
            />
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Space>
          <Alert
            type="info"
            message="暂无分类"
            description="暂无分类数据，请点击「创建分类」添加。"
            showIcon
          />
        </>
      ) : (
        <>
          <Space style={{ marginBottom: 16 }} wrap>
            <Input.Search
              placeholder="搜索名称/标识..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 240 }}
            />
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Space>

          <BatchActionBar
            selectedRowKeys={selectedRowKeys}
            actions={[
              { key: 'delete', label: '批量删除', danger: true, icon: undefined, confirmTitle: '确认删除', confirmContent: `确定要删除选中的 ${selectedRowKeys.length} 个分类吗？此操作不可撤销。` },
            ]}
            onAction={async (actionKey, ids) => {
              if (actionKey === 'delete') {
                await handleBatchDelete(ids);
              }
            }}
            loading={batchLoading}
          />

          <Table<ProductCategory>
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
            pagination={false}
          />
        </>
      )}
    </div>
  );
}

export default ProductCategoryList;