import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Spin, Alert, Typography, message, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { parameterGroupService } from '../../api/parameter-group.service';
import type { UpdateParameterGroupDto } from '../../types/parameter.types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready' }
  | { status: 'submitting' };

function ParameterGroupEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<UpdateParameterGroupDto>();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const loadData = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await parameterGroupService.getById(id);
      form.setFieldsValue({
        name: data.name,
        code: data.code,
        description: data.description ?? '',
      });
      setPageState({ status: 'ready' });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load parameter group';
      setPageState({ status: 'error', message });
    }
  }, [id, form]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (values: UpdateParameterGroupDto) => {
    if (!id) return;
    setPageState({ status: 'submitting' });
    try {
      await parameterGroupService.update(id, values);
      message.success('Parameter group updated successfully');
      navigate('/parameter-groups');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update parameter group';
      setPageState({ status: 'error', message: errorMessage });
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
        message="Failed to Load Parameter Group"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadData}>Retry</Button>
            <Button
              onClick={() => navigate('/parameter-groups')}
              icon={<ArrowLeftOutlined />}
            >
              Back to List
            </Button>
          </Space>
        }
      />
    );
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Edit Parameter Group
      </Title>

      <Card>
        <Form<UpdateParameterGroupDto>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input placeholder="e.g. Dimensions" />
          </Form.Item>

          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Please enter a code' }]}
          >
            <Input placeholder="e.g. dimensions" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea
              placeholder="Optional description"
              rows={3}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={pageState.status === 'submitting'}
            >
              Update Parameter Group
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate('/parameter-groups')}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ParameterGroupEdit;