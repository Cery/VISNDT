import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { parameterGroupService } from '../../api/parameter-group.service';
import type { CreateParameterGroupDto } from '../../types/parameter.types';

const { Title } = Typography;

type PageState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'error'; message: string };

function ParameterGroupCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateParameterGroupDto>();
  const [pageState, setPageState] = useState<PageState>({ status: 'idle' });

  const handleSubmit = async (values: CreateParameterGroupDto) => {
    setPageState({ status: 'submitting' });
    try {
      await parameterGroupService.create(values);
      message.success('Parameter group created successfully');
      navigate('/parameter-groups');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create parameter group';
      setPageState({ status: 'error', message: errorMessage });
      message.error(errorMessage);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Create Parameter Group
      </Title>

      <Card>
        <Form<CreateParameterGroupDto>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ name: '', code: '', description: '' }}
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
              Create Parameter Group
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

export default ParameterGroupCreate;