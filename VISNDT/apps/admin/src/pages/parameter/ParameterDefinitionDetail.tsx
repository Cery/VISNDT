import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Tag,
  Spin,
  Alert,
  Button,
  Space,
  Table,
  Typography,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { parameterDefinitionService } from '../../api/parameter-definition.service';
import type { ParameterDefinition, ParameterOption } from '../../types/parameter-definition.types';

const { Title, Link } = Typography;

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

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: ParameterDefinition };

const OPTION_COLUMNS: ColumnsType<ParameterOption> = [
  {
    title: '值',
    dataIndex: 'value',
    key: 'value',
    width: 200,
    render: (value: string) => <code>{value}</code>,
  },
  {
    title: '标签',
    dataIndex: 'label',
    key: 'label',
  },
  {
    title: '排序',
    dataIndex: 'sortOrder',
    key: 'sortOrder',
    width: 100,
    sorter: (a, b) => a.sortOrder - b.sortOrder,
  },
];

function ParameterDefinitionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await parameterDefinitionService.getById(id);
      setPageState({ status: 'success', data });
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载参数定义详情失败';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

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
        message="加载参数定义失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchDetail}>重试</Button>
            <Button
              onClick={() => navigate('/parameter-definitions')}
              icon={<ArrowLeftOutlined />}
            >
              返回列表
            </Button>
          </Space>
        }
      />
    );
  }

  const definition = pageState.data;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/parameter-definitions')}
        >
          返回
        </Button>
        <Button onClick={() => navigate(`/parameter-definitions/${id}/edit`)}>
          编辑
        </Button>
      </Space>

      <Title level={4} style={{ marginBottom: 24 }}>
        参数定义详情
      </Title>

      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="名称">{definition.name}</Descriptions.Item>
          <Descriptions.Item label="编码">
            <code>{definition.code}</code>
          </Descriptions.Item>
          <Descriptions.Item label="数据类型">
            <Tag color={DATA_TYPE_COLOR_MAP[definition.dataType] || 'default'}>
              {DATA_TYPE_LABEL_MAP[definition.dataType] || definition.dataType}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="所属分组">
            {definition.group ? (
              <Link onClick={() => navigate(`/parameter-groups/${definition.group!.id}`)}>
                {definition.group.name}
              </Link>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="单位">{definition.unit || '-'}</Descriptions.Item>
          <Descriptions.Item label="必填">
            {definition.required ? (
              <Tag color="red">是</Tag>
            ) : (
              <Tag>否</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(definition.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {new Date(definition.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {definition.dataType === 'ENUM' && (
        <Card title="枚举选项">
          <Table<ParameterOption>
            dataSource={definition.options}
            columns={OPTION_COLUMNS}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Card>
      )}
    </div>
  );
}

export default ParameterDefinitionDetail;