import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spin, Alert, Tag, Typography, Input, Space, message, Modal } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { parameterDefinitionService } from '../../api/parameter-definition.service';
import type { ParameterDefinition } from '../../types/parameter-definition.types';
import BatchOperations from '../../components/BatchOperations';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: ParameterDefinition[]; total: number };

interface QueryParams {
  page: number;
  pageSize: number;
  keyword: string;
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
  const [query, setQuery] = useState<QueryParams>({
    page: 1,
    pageSize: 20,
    keyword: '',
  });

  const fetchData = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const result = await parameterDefinitionService.getList({
        page: query.page,
        pageSize: query.pageSize,
        keyword: query.keyword || undefined,
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

  const handleReset = useCallback(() => {
    setQuery({ page: 1, pageSize: 20, keyword: '' });
  }, []);

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
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <span style={{ fontWeight: 500 }}>{name}</span>
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
        <Tag color={DATA_TYPE_COLOR_MAP[dataType] || 'default'}>{DATA_TYPE_LABEL_MAP[dataType] || dataType}</Tag>
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
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 80,
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
        <Title level={4} style={{ margin: 0 }}>
          参数定义管理
        </Title>
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

          <BatchOperations
            selectedRowKeys={selectedRowKeys}
            onBatchDelete={handleBatchDelete}
            loading={batchLoading}
          />

          <Table<ParameterDefinition>
          columns={columns}
          dataSource={pageState.data}
          rowKey="id"
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