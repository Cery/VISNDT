import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Table,
  Tag,
  Spin,
  Alert,
  Button,
  Space,
  Typography,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { parameterGroupService } from '../../api/parameter-group.service';
import type { ParameterGroup } from '../../types/parameter.types';
import type { ParameterDefinition } from '../../types/parameter-definition.types';

const { Title } = Typography;

// 后端 findOne 返回的 definitions 是 ParameterDefinition 数组
interface ParameterGroupWithDefinitions extends ParameterGroup {
  definitions: ParameterDefinition[];
}

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: ParameterGroupWithDefinitions };

const DATA_TYPE_COLOR: Record<string, string> = {
  STRING: 'green',
  NUMBER: 'orange',
  BOOLEAN: 'purple',
  ENUM: 'cyan',
};

const DATA_TYPE_LABEL: Record<string, string> = {
  STRING: '字符串',
  NUMBER: '数字',
  BOOLEAN: '布尔值',
  ENUM: '枚举',
};

const formatDate = (date: string | undefined) =>
  date ? new Date(date).toLocaleString() : '-';

export default function ParameterGroupDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const fetchGroup = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await parameterGroupService.getById(id);
      setPageState({ status: 'success', data: data as ParameterGroupWithDefinitions });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载参数组失败';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  if (pageState.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
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
          <Space>
            <Button onClick={fetchGroup}>重试</Button>
            <Button
              onClick={() => navigate('/parameter-groups')}
              icon={<ArrowLeftOutlined />}
            >
              返回列表
            </Button>
          </Space>
        }
      />
    );
  }

  const group = pageState.data;
  const definitions = group.definitions || [];

  const columns: ColumnsType<ParameterDefinition> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: ParameterDefinition) => (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() => navigate(`/parameter-definitions/${record.id}`)}
        >
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
      width: 120,
      render: (dataType: string) => (
        <Tag color={DATA_TYPE_COLOR[dataType] || 'default'}>
          {DATA_TYPE_LABEL[dataType] || '未知类型'}
        </Tag>
      ),
    },
    {
      title: '必填',
      dataIndex: 'required',
      key: 'required',
      width: 80,
      render: (required: boolean) =>
        required ? (
          <Tag color="red">是</Tag>
        ) : (
          <Tag color="default">否</Tag>
        ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => formatDate(date),
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: ParameterDefinition) => (
        <Button
          type="link"
          onClick={() => navigate(`/parameter-definitions/${record.id}`)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/parameter-groups')}
        >
          返回列表
        </Button>
      </Space>

      <Title level={3}>参数组详情</Title>

      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="名称">{group.name}</Descriptions.Item>
          <Descriptions.Item label="编码">
            <code>{group.code}</code>
          </Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {group.description || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {formatDate(group.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {formatDate(group.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title={`参数定义（${definitions.length}）`}
        style={{ marginBottom: 16 }}
      >
        <Table<ParameterDefinition>
          columns={columns}
          dataSource={definitions}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
}