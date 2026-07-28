import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spin, Alert, Tag, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { parameterDefinitionService } from '../../api/parameter-definition.service';
import type { ParameterDefinition } from '../../types/parameter-definition.types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty' }
  | { status: 'success'; data: ParameterDefinition[]; total: number };

interface QueryParams {
  page: number;
  pageSize: number;
}

const DATA_TYPE_COLOR_MAP: Record<string, string> = {
  STRING: 'blue',
  NUMBER: 'green',
  BOOLEAN: 'orange',
  ENUM: 'purple',
};

function ParameterDefinitionList() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [query, setQuery] = useState<QueryParams>({
    page: 1,
    pageSize: 20,
  });

  const fetchData = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const result = await parameterDefinitionService.list({
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
        err instanceof Error ? err.message : 'Failed to load parameter definitions';
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
        message="Failed to load parameter definitions"
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

  const columns: ColumnsType<ParameterDefinition> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <span style={{ fontWeight: 500 }}>{name}</span>
      ),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <code>{code}</code>,
    },
    {
      title: 'Type',
      dataIndex: 'dataType',
      key: 'dataType',
      width: 100,
      render: (dataType: string) => (
        <Tag color={DATA_TYPE_COLOR_MAP[dataType] || 'default'}>{dataType}</Tag>
      ),
    },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
      render: (group: ParameterDefinition['group']) => group?.name || '-',
    },
    {
      title: 'Required',
      dataIndex: 'required',
      key: 'required',
      width: 100,
      render: (required: boolean) => (
        required ? <Tag color="red">Yes</Tag> : <Tag>No</Tag>
      ),
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
      render: (_: unknown, record: ParameterDefinition) => (
        <Button
          type="link"
          onClick={() => navigate(`/parameter-definitions/${record.id}/edit`)}
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
          Parameter Definitions
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/parameter-definitions/create')}
        >
          Create Definition
        </Button>
      </div>

      {pageState.status === 'empty' ? (
        <Alert
          type="info"
          message="No Parameter Definitions"
          description="No parameter definitions have been created yet. Click 'Create Definition' to add one."
          showIcon
        />
      ) : (
        <Table<ParameterDefinition>
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

export default ParameterDefinitionList;