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
      message.success('参数组创建成功');
      navigate('/parameter-groups');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '创建参数组失败';
      setPageState({ status: 'error', message: errorMessage });
      message.error(errorMessage);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        创建参数组
      </Title>

      <Card>
        <Form<CreateParameterGroupDto>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ name: '', code: '', description: '' }}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="如：尺寸" />
          </Form.Item>

          <Form.Item
            label="编码"
            name="code"
            rules={[{ required: true, message: '请输入编码' }]}
          >
            <Input placeholder="如：dimensions" />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea
              placeholder="可选描述"
              rows={3}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={pageState.status === 'submitting'}
            >
              创建参数组
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate('/parameter-groups')}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ParameterGroupCreate;