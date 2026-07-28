import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Select, Switch, Spin, Alert, Typography, message, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { parameterDefinitionService } from '../../api/parameter-definition.service';
import { parameterGroupService } from '../../api/parameter-group.service';
import type { UpdateParameterDefinitionDto, ParameterDataType } from '../../types/parameter-definition.types';
import type { ParameterGroup } from '../../types/parameter.types';

const { Title } = Typography;
const { Option } = Select;

const DATA_TYPE_OPTIONS: { value: ParameterDataType; label: string }[] = [
  { value: 'STRING', label: 'STRING' },
  { value: 'NUMBER', label: 'NUMBER' },
  { value: 'BOOLEAN', label: 'BOOLEAN' },
  { value: 'ENUM', label: 'ENUM' },
];

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; groups: ParameterGroup[] }
  | { status: 'submitting' };

function ParameterDefinitionEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<UpdateParameterDefinitionDto>();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const loadData = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const [definition, groupsResult] = await Promise.all([
        parameterDefinitionService.getById(id),
        parameterGroupService.list({ page: 1, pageSize: 100 }),
      ]);
      form.setFieldsValue({
        name: definition.name,
        code: definition.code,
        dataType: definition.dataType,
        parameterGroupId: definition.parameterGroupId ?? undefined,
        unit: definition.unit ?? undefined,
        required: definition.required,
      });
      setPageState({ status: 'ready', groups: groupsResult.data });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load parameter definition';
      setPageState({ status: 'error', message: errorMessage });
    }
  }, [id, form]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (values: UpdateParameterDefinitionDto) => {
    if (!id) return;
    setPageState((prev) =>
      prev.status === 'ready' ? { ...prev, status: 'submitting' } as PageState : prev
    );
    try {
      const payload: UpdateParameterDefinitionDto = {
        name: values.name,
        code: values.code,
        dataType: values.dataType,
        parameterGroupId: values.parameterGroupId || undefined,
        unit: values.unit || undefined,
        required: values.required ?? false,
      };
      await parameterDefinitionService.update(id, payload);
      message.success('Parameter definition updated successfully');
      navigate('/parameter-definitions');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update parameter definition';
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
        message="Failed to Load Parameter Definition"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadData}>Retry</Button>
            <Button
              onClick={() => navigate('/parameter-definitions')}
              icon={<ArrowLeftOutlined />}
            >
              Back to List
            </Button>
          </Space>
        }
      />
    );
  }

  const groups: ParameterGroup[] =
    'groups' in pageState ? (pageState as { status: 'ready'; groups: ParameterGroup[] }).groups : [];

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Edit Parameter Definition
      </Title>

      <Card>
        <Form<UpdateParameterDefinitionDto>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input placeholder="e.g. Length" />
          </Form.Item>

          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Please enter a code' }]}
          >
            <Input placeholder="e.g. length" />
          </Form.Item>

          <Form.Item
            label="Data Type"
            name="dataType"
            rules={[{ required: true, message: 'Please select a data type' }]}
          >
            <Select placeholder="Select data type">
              {DATA_TYPE_OPTIONS.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Parameter Group"
            name="parameterGroupId"
          >
            <Select
              placeholder="Select a parameter group (optional)"
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
            label="Unit"
            name="unit"
          >
            <Input placeholder="e.g. mm, kg, °C" />
          </Form.Item>

          <Form.Item
            label="Required"
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
              Update Parameter Definition
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate('/parameter-definitions')}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ParameterDefinitionEdit;