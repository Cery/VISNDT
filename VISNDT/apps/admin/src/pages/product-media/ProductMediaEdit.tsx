import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Select,
  Switch,
  Spin,
  Alert,
  Typography,
  message,
  Space,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { productMediaService } from '../../api/product-media.service';
import type { UpdateProductMediaDto, MediaType } from '../../types/product-media.types';

const { Title } = Typography;
const { Option } = Select;

const MEDIA_TYPE_OPTIONS: { value: MediaType; label: string }[] = [
  { value: 'IMAGE', label: 'IMAGE' },
  { value: 'DOCUMENT', label: 'DOCUMENT' },
  { value: 'CERTIFICATE', label: 'CERTIFICATE' },
  { value: 'OTHER', label: 'OTHER' },
];

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready' }
  | { status: 'submitting' };

function ProductMediaEdit() {
  const { productId, id } = useParams<{ productId: string; id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<UpdateProductMediaDto>();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  const loadData = useCallback(async () => {
    if (!productId || !id) return;
    setPageState({ status: 'loading' });
    try {
      const media = await productMediaService.getById(productId, id);
      form.setFieldsValue({
        fileAssetId: media.fileAssetId ?? undefined,
        mediaType: media.mediaType,
        title: media.title ?? undefined,
        description: media.description ?? undefined,
        isPrimary: media.isPrimary,
        displayOrder: media.displayOrder,
      });
      setPageState({ status: 'ready' });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load media';
      setPageState({ status: 'error', message: errorMessage });
    }
  }, [productId, id, form]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (values: UpdateProductMediaDto) => {
    if (!productId || !id) return;
    setPageState((prev) =>
      prev.status === 'ready'
        ? ({ ...prev, status: 'submitting' } as PageState)
        : prev,
    );
    try {
      const payload: UpdateProductMediaDto = {
        fileAssetId: values.fileAssetId || undefined,
        mediaType: values.mediaType,
        title: values.title || undefined,
        description: values.description || undefined,
        isPrimary: values.isPrimary ?? false,
        displayOrder: values.displayOrder ?? 0,
      };
      await productMediaService.update(productId, id, payload);
      message.success('Media updated successfully');
      navigate(`/products/${productId}/media`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update media';
      setPageState((prev) =>
        prev.status === 'ready'
          ? ({ ...prev, status: 'ready' } as PageState)
          : prev,
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
        message="Failed to Load Media"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadData}>Retry</Button>
            <Button
              onClick={() => navigate(`/products/${productId}/media`)}
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
        Edit Media
      </Title>

      <Card>
        <Form<UpdateProductMediaDto>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="FileAsset ID"
            name="fileAssetId"
          >
            <Input placeholder="Enter FileAsset ID" />
          </Form.Item>

          <Form.Item
            label="Media Type"
            name="mediaType"
            rules={[{ required: true, message: 'Please select a media type' }]}
          >
            <Select placeholder="Select media type">
              {MEDIA_TYPE_OPTIONS.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Title" name="title">
            <Input placeholder="e.g. Product front view" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Optional description" rows={3} />
          </Form.Item>

          <Form.Item
            label="Primary"
            name="isPrimary"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item label="Display Order" name="displayOrder">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={pageState.status === 'submitting'}
            >
              Update Media
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate(`/products/${productId}/media`)}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ProductMediaEdit;