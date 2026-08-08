import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Spin,
  Alert,
  Space,
  message,
  Typography,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { demandService, apiClient } from '../api';
import type { Demand } from '../types';

const { Title } = Typography;
const { TextArea } = Input;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: Demand };

interface DemandFormValues {
  title: string;
  description?: string;
  budgetRange?: string;
  quantity?: number;
  quantityUnit?: string;
  expectedDeliveryDate?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export default function DemandEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<DemandFormValues>();

  const loadDemand = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await demandService.getById(id);
      setPageState({ status: 'ready', data });
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载需求失败';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    loadDemand();
  }, [loadDemand]);

  const handleSubmit = async (values: DemandFormValues) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await apiClient.patch(`/demands/${id}`, values);
      message.success('需求更新成功');
      navigate(`/demands/${id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '更新需求失败';
      message.error(msg);
    } finally {
      setSubmitting(false);
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
        message="加载需求失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadDemand}>重试</Button>
            <Button onClick={() => navigate(`/demands/${id}`)} icon={<ArrowLeftOutlined />}>
              返回详情
            </Button>
          </Space>
        }
      />
    );
  }

  const demand = pageState.data;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/demands/${id}`)}>
          返回详情
        </Button>
      </Space>

      <Title level={3}>编辑需求</Title>

      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            title: demand.title,
            description: demand.description,
            budgetRange: demand.budgetRange,
            quantity: demand.quantity,
            quantityUnit: demand.quantityUnit,
            expectedDeliveryDate: demand.expectedDeliveryDate,
            contactName: demand.contactName,
            contactEmail: demand.contactEmail,
            contactPhone: demand.contactPhone,
          }}
          onFinish={handleSubmit}
          style={{ maxWidth: 720 }}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入需求标题' }]}
          >
            <Input placeholder="请输入需求标题" />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <TextArea rows={4} placeholder="请输入需求描述（可选）" />
          </Form.Item>

          <Form.Item label="预算范围" name="budgetRange">
            <Input placeholder="例如：10000-50000" />
          </Form.Item>

          <Space size="large" style={{ display: 'flex' }} align="start">
            <Form.Item label="数量" name="quantity">
              <InputNumber min={0} style={{ width: 160 }} placeholder="请输入数量" />
            </Form.Item>

            <Form.Item label="数量单位" name="quantityUnit">
              <Input placeholder="例如：个、件、套" style={{ width: 160 }} />
            </Form.Item>
          </Space>

          <Form.Item
            label="预计交付日期"
            name="expectedDeliveryDate"
            getValueFromEvent={(date: dayjs.Dayjs | null) =>
              date ? date.format('YYYY-MM-DD') : undefined
            }
            getValueProps={(value: string | undefined) => ({
              value: value ? dayjs(value) : undefined,
            })}
          >
            <DatePicker style={{ width: 240 }} />
          </Form.Item>

          <Form.Item label="联系人" name="contactName">
            <Input placeholder="请输入联系人姓名（可选）" />
          </Form.Item>

          <Form.Item label="联系人邮箱" name="contactEmail">
            <Input placeholder="请输入联系人邮箱（可选）" />
          </Form.Item>

          <Form.Item label="联系人电话" name="contactPhone">
            <Input placeholder="请输入联系人电话（可选）" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button onClick={() => navigate(`/demands/${id}`)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}