import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spin, Alert, Typography, Input, Space, message, Modal, Card, Row, Col, Statistic, TreeSelect } from 'antd';
import { PlusOutlined, ReloadOutlined, GroupOutlined, ToolOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import { parameterGroupService } from '../../api/parameter-group.service';
import { parameterDefinitionService } from '../../api/parameter-definition.service';
import { categoriesService } from '../../api';
import type { ParameterGroup } from '../../types/parameter.types';
import type { ProductCategory } from '../../types/category.types';
import { BatchActionBar } from '../../components/operation';

const { Title } = Typography;

/** Build Ant Design TreeSelect treeData from ProductCategory list (parentId hierarchy) */
function buildCategoryTreeData(catList: ProductCategory[]) {
  const map = new Map<string, ProductCategory>();
  for (const cat of catList) map.set(cat.id, { ...cat, children: cat.children ?? [] });
  const roots: ProductCategory[] = [];
  for (const node of map.values()) {
    const parent = node.parentId ? map.get(node.parentId) : undefined;
    if (parent) {
      (parent.children = parent.children ?? []).push(node);
    } else {
      roots.push(node);
    }
  }
  const toData = (node: ProductCategory): Record<string, unknown> => ({
    title: node.name,
    value: node.id,
    children: (node.children ?? []).length > 0 ? (node.children as ProductCategory[]).map(toData) : undefined,
  });
  return roots.map(toData);
}

/** Return full category path label (e.g. 工业检测 / 内窥镜) from a category object */
function resolveCategoryPath(cat: { id: string; name: string } | null | undefined, catList: ProductCategory[]): string {
  if (!cat) return '-';
  const map = new Map(catList.map((c) => [c.id, c]));
  const chain: string[] = [];
  let cur = map.get(cat.id);
  while (cur) {
    chain.unshift(cur.name);
    cur = cur.parentId ? map.get(cur.parentId) : undefined;
  }
  return chain.join(' / ');
}

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: ParameterGroup[]; total: number };

interface QueryParams {
  page: number;
  pageSize: number;
  keyword: string;
  categoryId: string;
  sortBy: string;
  sortOrder: string;
}

function ParameterGroupList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [paramStats, setParamStats] = useState({ groupCount: 0, defCount: 0 });
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [query, setQuery] = useState<QueryParams>({
    page: 1,
    pageSize: 20,
    keyword: '',
    categoryId: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchData = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const result = await parameterGroupService.getList({
        page: query.page,
        pageSize: query.pageSize,
        keyword: query.keyword || undefined,
        categoryId: query.categoryId || undefined,
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
        err instanceof Error ? err.message : '加载参数组失败';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Load parameter governance statistics and categories
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [groups, defs, cats] = await Promise.all([
          parameterGroupService.getList({ page: 1, pageSize: 1 }),
          parameterDefinitionService.getList({ pageSize: 1 }),
          categoriesService.getList(),
        ]);
        setParamStats({ groupCount: groups.total, defCount: defs.total });
        setCategories(cats);
      } catch {
        // Stats load failure is non-critical
      }
    };
    loadStats();
  }, []);

  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      _filters: Record<string, unknown>,
      sorter: SorterResult<ParameterGroup> | SorterResult<ParameterGroup>[],
    ) => {
      const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
      setQuery((prev) => ({
        ...prev,
        page: pagination.current || 1,
        pageSize: pagination.pageSize || 20,
        sortBy: (singleSorter.field as string) || prev.sortBy,
        sortOrder: singleSorter.order === 'ascend' ? 'asc' : 'desc',
      }));
    },
    [],
  );

  const handleSearch = useCallback((value: string) => {
    setQuery((prev) => ({ ...prev, keyword: value, page: 1 }));
  }, []);

  const handleCategoryChange = useCallback((value: string | undefined) => {
    setQuery((prev) => ({ ...prev, categoryId: value || '', page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setQuery({ page: 1, pageSize: 20, keyword: '', categoryId: '', sortBy: 'createdAt', sortOrder: 'desc' });
  }, []);

  const renderCategoryFilter = () => (
    <TreeSelect
      placeholder="按分类筛选"
      allowClear
      treeDefaultExpandAll
      showSearch
      treeNodeFilterProp="title"
      style={{ width: 200 }}
      value={query.categoryId || undefined}
      onChange={handleCategoryChange}
      treeData={buildCategoryTreeData(categories)}
    />
  );

  const handleDelete = useCallback((id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除此参数组吗？此操作不可撤销。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await parameterGroupService.remove(id);
          message.success('参数组已删除');
          fetchData();
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败');
        }
      },
    });
  }, [fetchData]);

  const handleBatchDelete = useCallback(async (ids: string[]) => {
    setBatchLoading(true);
    const hideLoading = message.loading('正在删除...');
    try {
      const result = await parameterGroupService.batchDelete(ids);
      hideLoading();
      const succeeded = result.succeeded?.length ?? 0;
      const failed = result.failed ?? [];
      if (succeeded > 0) {
        message.success(`成功删除 ${succeeded} 个参数组`);
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
        message="加载参数组失败"
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

  const columns: ColumnsType<ParameterGroup> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: ParameterGroup) => (
        <Button type="link" style={{ padding: 0, fontWeight: 500 }} onClick={() => navigate(`/parameter-groups/${record.id}`)}>
          {name}
        </Button>
      ),
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <code>{code}</code>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (cat: ParameterGroup['category']) => resolveCategoryPath(cat, categories),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string | undefined) => desc || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: true,
      sortOrder:
        query.sortBy === 'createdAt'
          ? query.sortOrder === 'asc'
            ? 'ascend'
            : 'descend'
          : undefined,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_: unknown, record: ParameterGroup) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/parameter-groups/${record.id}/edit`)}
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
            参数组管理
          </Title>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            管理产品参数分组，每个参数组包含多个参数定义
          </Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/parameter-groups/create')}
        >
          创建分组
        </Button>
      </div>

      {/* Parameter Governance Stats */}
      {paramStats.groupCount > 0 && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={12} sm={8}>
            <Card size="small">
              <Statistic title="参数组" value={paramStats.groupCount} prefix={<GroupOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={8}>
            <Card size="small">
              <Statistic title="参数定义" value={paramStats.defCount} prefix={<ToolOutlined />} />
            </Card>
          </Col>
          </Row>
      )}

      {pageState.status === 'empty' ? (
        <>
          <Space style={{ marginBottom: 16 }} wrap>
            {renderCategoryFilter()}
            <Input.Search
              placeholder="搜索名称/编码..."
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
            message="暂无参数组"
            description="暂无参数组数据，请点击「创建分组」添加。"
            showIcon
          />
        </>
      ) : (
        <>
          <Space style={{ marginBottom: 16 }} wrap>
            {renderCategoryFilter()}
            <Input.Search
              placeholder="搜索名称/编码..."
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
              { key: 'delete', label: '批量删除', danger: true, icon: undefined, confirmTitle: '确认删除', confirmContent: `确定要删除选中的 ${selectedRowKeys.length} 个参数组吗？此操作不可撤销。` },
            ]}
            onAction={async (actionKey, ids) => {
              if (actionKey === 'delete') {
                await handleBatchDelete(ids);
              }
            }}
            loading={batchLoading}
          />

          <Table<ParameterGroup>
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
            showTotal: (total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`,
          }}
        />
      </>
      )}
    </div>
  );
}

export default ParameterGroupList;