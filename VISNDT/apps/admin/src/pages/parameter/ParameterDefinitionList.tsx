import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spin, Alert, Tag, Typography, Input, Space, message, Modal, TreeSelect } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import { parameterDefinitionService } from '../../api/parameter-definition.service';
import { categoriesService } from '../../api';
import type { ParameterDefinition } from '../../types/parameter-definition.types';
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
  | { status: 'success'; data: ParameterDefinition[]; total: number };

interface QueryParams {
  page: number;
  pageSize: number;
  keyword: string;
  categoryId: string;
  sortBy: string;
  sortOrder: string;
}

const DATA_TYPE_COLOR_MAP: Record<string, string> = {
  STRING: 'blue',
  NUMBER: 'green',
  BOOLEAN: 'orange',
  ENUM: 'purple',
};

const DATA_TYPE_LABEL_MAP: Record<string, string> = {
  STRING: '字符串',
  NUMBER: '数字',
  BOOLEAN: '布尔',
  ENUM: '枚举',
};

function ParameterDefinitionList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
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
      const result = await parameterDefinitionService.getList({
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
        err instanceof Error ? err.message : '加载参数定义失败';
      setPageState({ status: 'error', message });
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Load product categories for the hierarchical category filter
  useEffect(() => {
    categoriesService
      .getList()
      .then(setCategories)
      .catch(() => {
        // Category loading failure is non-critical
      });
  }, []);

  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      _filters: Record<string, unknown>,
      sorter: SorterResult<ParameterDefinition> | SorterResult<ParameterDefinition>[],
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
      content: '确定要删除此参数定义吗？此操作不可撤销。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await parameterDefinitionService.remove(id);
          message.success('参数定义已删除');
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
      const result = await parameterDefinitionService.batchDelete(ids);
      hideLoading();
      const succeeded = result.succeeded?.length ?? 0;
      const failed = result.failed ?? [];
      if (succeeded > 0) {
        message.success(`成功删除 ${succeeded} 个参数定义`);
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
        message="加载参数定义失败"
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

  const columns: ColumnsType<ParameterDefinition> = [
    {
      title: '分类',
      dataIndex: 'group',
      key: 'category',
      width: 180,
      render: (group: ParameterDefinition['group']) => resolveCategoryPath(group?.category, categories),
    },
    {
      title: '分组',
      dataIndex: 'group',
      key: 'group',
      width: 160,
      render: (group: ParameterDefinition['group']) => group?.name || '-',
    },
    {
      title: '参数',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: ParameterDefinition) => (
        <Button type="link" style={{ padding: 0, fontWeight: 500 }} onClick={() => navigate(`/parameter-definitions/${record.id}`)}>
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
      title: '类型',
      dataIndex: 'dataType',
      key: 'dataType',
      width: 100,
      render: (dataType: string) => (
        <Tag color={DATA_TYPE_COLOR_MAP[dataType] || 'default'}>{DATA_TYPE_LABEL_MAP[dataType] || '未知类型'}</Tag>
      ),
    },
    {
      title: '分组',
      dataIndex: 'group',
      key: 'group',
      render: (group: ParameterDefinition['group']) => group?.name || '-',
    },
    {
      title: '必填',
      dataIndex: 'required',
      key: 'required',
      width: 100,
      render: (required: boolean) => (
        required ? <Tag color="red">是</Tag> : <Tag>否</Tag>
      ),
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
      width: 80,
      fixed: 'right' as const,
      render: (_: unknown, record: ParameterDefinition) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/parameter-definitions/${record.id}/edit`)}
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
            参数定义管理
          </Title>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            管理产品参数定义，定义参数名称、数据类型和所属分组
          </Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/parameter-definitions/create')}
        >
          创建定义
        </Button>
      </div>

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
            message="暂无参数定义"
            description="暂无参数定义数据，请点击「创建定义」添加。"
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
              { key: 'delete', label: '批量删除', danger: true, icon: undefined, confirmTitle: '确认删除', confirmContent: `确定要删除选中的 ${selectedRowKeys.length} 个参数定义吗？此操作不可撤销。` },
            ]}
            onAction={async (actionKey, ids) => {
              if (actionKey === 'delete') {
                await handleBatchDelete(ids);
              }
            }}
            loading={batchLoading}
          />

          <Table<ParameterDefinition>
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

export default ParameterDefinitionList;