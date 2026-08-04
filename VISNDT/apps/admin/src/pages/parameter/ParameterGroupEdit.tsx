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
        err instanceof Error ? err.message : '加载参数组失败';
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
      message.success('参数组更新成功');
      navigate('/parameter-groups');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '更新参数组失败';
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
        message="加载参数组失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadData}>重试</Button>
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

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        编辑参数组
      </Title>

      <Card>
        <Form<UpdateParameterGroupDto>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
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
              更新参数组
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

export default ParameterGroupEdit;