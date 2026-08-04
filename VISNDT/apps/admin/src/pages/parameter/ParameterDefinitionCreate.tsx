import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Select, Switch, Spin, Alert, Typography, message } from 'antd';
import { parameterDefinitionService } from '../../api/parameter-definition.service';
import { parameterGroupService } from '../../api/parameter-group.service';
import type { CreateParameterDefinitionDto, ParameterDataType } from '../../types/parameter-definition.types';
import type { ParameterGroup } from '../../types/parameter.types';

const { Title } = Typography;
const { Option } = Select;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; groups: ParameterGroup[] }
  | { status: 'submitting' };

const DATA_TYPE_OPTIONS: { value: ParameterDataType; label: string }[] = [
  { value: 'STRING', label: 'STRING' },
  { value: 'NUMBER', label: 'NUMBER' },
  { value: 'BOOLEAN', label: 'BOOLEAN' },
  { value: 'ENUM', label: 'ENUM' },
];

function ParameterDefinitionCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateParameterDefinitionDto>();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    const loadGroups = async () => {
      try {
        const result = await parameterGroupService.list({ page: 1, pageSize: 100 });
        if (!cancelled) {
          setPageState({ status: 'ready', groups: result.data });
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage =
            err instanceof Error ? err.message : '加载参数组失败';
          setPageState({ status: 'error', message: errorMessage });
        }
      }
    };
    loadGroups();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (values: CreateParameterDefinitionDto) => {
    setPageState((prev) =>
      prev.status === 'ready' ? { ...prev, status: 'submitting' } as PageState : prev
    );
    try {
      const payload: CreateParameterDefinitionDto = {
        name: values.name,
        code: values.code,
        dataType: values.dataType,
        parameterGroupId: values.parameterGroupId || undefined,
        unit: values.unit || undefined,
        required: values.required ?? false,
      };
      await parameterDefinitionService.create(payload);
      message.success('参数定义创建成功');
      navigate('/parameter-definitions');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '创建参数定义失败';
      setPageState((prev) =>
        prev.status === 'ready' ? { ...prev, status: 'ready' } as PageState : prev
      );
      message.error(errorMessage);
    }
  };

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
        message="加载表单数据失败"
        description={pageState.message}
        showIcon
        action={
          <Button onClick={() => navigate('/parameter-definitions')}>
            返回列表
          </Button>
        }
      />
    );
  }

  const groups: ParameterGroup[] =
    'groups' in pageState ? (pageState as { status: 'ready'; groups: ParameterGroup[] }).groups : [];

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        创建参数定义
      </Title>

      <Card>
        <Form<CreateParameterDefinitionDto>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: '',
            code: '',
            dataType: 'STRING',
            required: false,
          }}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="如：长度" />
          </Form.Item>

          <Form.Item
            label="编码"
            name="code"
            rules={[{ required: true, message: '请输入编码' }]}
          >
            <Input placeholder="如：length" />
          </Form.Item>

          <Form.Item
            label="数据类型"
            name="dataType"
            rules={[{ required: true, message: '请选择数据类型' }]}
          >
            <Select placeholder="请选择数据类型">
              {DATA_TYPE_OPTIONS.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="参数组"
            name="parameterGroupId"
          >
            <Select
              placeholder="请选择参数组（可选）"
              allowClear
            >
              {groups.map((g: ParameterGroup) => (
                <Option key={g.id} value={g.id}>
                  {g.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="单位"
            name="unit"
          >
            <Input placeholder="如：mm、kg、°C" />
          </Form.Item>

          <Form.Item
            label="必填"
            name="required"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={pageState.status === 'submitting'}
            >
              创建参数定义
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate('/parameter-definitions')}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ParameterDefinitionCreate;