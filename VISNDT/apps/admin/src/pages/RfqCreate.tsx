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
        err instanceof Error ? err.message : 'Failed to load demands';
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
      message.success('RFQ created successfully');
      navigate(`/rfqs/${rfq.id}`);
    } catch (err) {
      if (err instanceof Error) {
        message.error(err.message || 'Failed to create RFQ');
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
        message="Failed to load demands"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchDemands}>Retry</Button>
            <Button onClick={() => navigate('/rfqs')} icon={<ArrowLeftOutlined />}>
              Back to List
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
          Back to List
        </Button>
      </Space>

      <Title level={3}>Create RFQ</Title>

      <Card style={{ maxWidth: 600 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Select Demand"
            name="demandId"
            rules={[{ required: true, message: 'Please select a demand' }]}
          >
            <Select
              placeholder="Select a demand to create RFQ"
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
                Create RFQ
              </Button>
              <Button onClick={() => navigate('/rfqs')}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default RfqCreate;