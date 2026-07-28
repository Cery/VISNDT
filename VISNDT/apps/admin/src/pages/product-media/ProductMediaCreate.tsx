import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Button, Card, Select, Switch, Alert, Typography, message } from 'antd';
import { productMediaService } from '../../api/product-media.service';
import type { CreateProductMediaDto, MediaType } from '../../types/product-media.types';

const { Title } = Typography;
const { Option } = Select;

const MEDIA_TYPE_OPTIONS: { value: MediaType; label: string }[] = [
  { value: 'IMAGE', label: 'IMAGE' },
  { value: 'DOCUMENT', label: 'DOCUMENT' },
  { value: 'CERTIFICATE', label: 'CERTIFICATE' },
  { value: 'OTHER', label: 'OTHER' },
];

type PageState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'error'; message: string };

function ProductMediaCreate() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateProductMediaDto>();
  const [pageState, setPageState] = useState<PageState>({ status: 'idle' });

  const handleSubmit = async (values: CreateProductMediaDto) => {
    if (!productId) return;
    setPageState({ status: 'submitting' });
    try {
      const payload: CreateProductMediaDto = {
        fileAssetId: values.fileAssetId || undefined,
        mediaType: values.mediaType,
        title: values.title || undefined,
        description: values.description || undefined,
        isPrimary: values.isPrimary ?? false,
        displayOrder: values.displayOrder ?? 0,
      };
      await productMediaService.create(productId, payload);
      message.success('Media added successfully');
      navigate(`/products/${productId}/media`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to add media';
      setPageState({ status: 'error', message: errorMessage });
      message.error(errorMessage);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Add Media
      </Title>

      <Alert
        type="info"
        showIcon
        message="Current version does not support file upload"
        description="Only existing FileAsset association is supported. Please enter a valid FileAsset ID."
        style={{ marginBottom: 16 }}
      />

      <Card>
        <Form<CreateProductMediaDto>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            mediaType: 'IMAGE',
            isPrimary: false,
            displayOrder: 0,
          }}
        >
          <Form.Item
            label="FileAsset ID"
            name="fileAssetId"
            rules={[{ required: true, message: 'Please enter a FileAsset ID' }]}
          >
            <Input placeholder="Enter existing FileAsset ID" />
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
              Add Media
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

export default ProductMediaCreate;