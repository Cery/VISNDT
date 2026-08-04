import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Select,
  Button,
  Spin,
  Alert,
  Space,
  Typography,
  message,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { rfqService } from '../api';
import { demandService } from '../api';
import type { Demand } from '../types';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; demands: Demand[] };

function RfqCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [submitting, setSubmitting] = useState(false);

  const fetchDemands = useCallback(async () => {
    setPageState({ status: 'loading' });
    try {
      const result = await demandService.getList({ page: 1, pageSize: 100 });
      setPageState({ status: 'success', demands: result.data });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载需求列表失败';
      setPageState({ status: 'error', message });
    }
  }, []);

  useEffect(() => {
    fetchDemands();
  }, [fetchDemands]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const rfq = await rfqService.create({ demandId: values.demandId });
      message.success('询价单创建成功');
      navigate(`/rfqs/${rfq.id}`);
    } catch (err) {
      if (err instanceof Error) {
        message.error(err.message || '创建询价单失败');
      }
    } finally {
      setSubmitting(false);
    }
  };

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
        message="加载需求列表失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchDemands}>重试</Button>
            <Button onClick={() => navigate('/rfqs')} icon={<ArrowLeftOutlined />}>
              返回列表
            </Button>
          </Space>
        }
      />
    );
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/rfqs')}>
          返回列表
        </Button>
      </Space>

      <Title level={3}>创建询价单</Title>

      <Card style={{ maxWidth: 600 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="选择需求"
            name="demandId"
            rules={[{ required: true, message: '请选择一个需求' }]}
          >
            <Select
              placeholder="选择需求以创建询价单"
              showSearch
              optionFilterProp="label"
              options={pageState.demands.map((d) => ({
                value: d.id,
                label: d.title,
              }))}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
              >
                创建询价单
              </Button>
              <Button onClick={() => navigate('/rfqs')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default RfqCreate;