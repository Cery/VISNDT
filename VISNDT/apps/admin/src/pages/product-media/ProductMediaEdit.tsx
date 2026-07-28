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
  Upload,
  Image,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  InboxOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { productMediaService } from '../../api/product-media.service';
import { fileAssetService } from '../../api/file-asset.service';
import type { UpdateProductMediaDto, MediaType } from '../../types/product-media.types';
import type { FileAsset } from '../../types/file-asset.types';
import { getFileTypeIcon, formatFileSize } from '../../utils/file-utils';

const { Title, Text } = Typography;
const { Dragger } = Upload;
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

  // Current FileAsset state
  const [currentFileAsset, setCurrentFileAsset] = useState<FileAsset | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileAssetId, setUploadedFileAssetId] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

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

      // Load current FileAsset from the inline response (backend includes fileAsset via Prisma include)
      const fa = media.fileAsset ?? null;
      setCurrentFileAsset(fa);
      // Resolve signed URL for image preview
      if (fa && fa.fileType === 'IMAGE') {
        try {
          const url = await fileAssetService.getSignedUrl(fa.id);
          setSignedUrl(url);
        } catch {
          setSignedUrl(null);
        }
      } else {
        setSignedUrl(null);
      }

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

  /** Handle file replacement upload */
  const handleFileReplace = async (file: File) => {
    setUploading(true);
    try {
      const fileAsset = await fileAssetService.upload(file);
      setUploadedFileAssetId(fileAsset.id);
      setUploadedFileName(file.name);
      setCurrentFileAsset(fileAsset);
      // Resolve signed URL for new image
      if (fileAsset.fileType === 'IMAGE') {
        try {
          const url = await fileAssetService.getSignedUrl(fileAsset.id);
          setSignedUrl(url);
        } catch {
          setSignedUrl(null);
        }
      }
      message.success(`File "${file.name}" uploaded successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      message.error(errorMessage);
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload behavior
  };

  /** Handle download of current file */
  const handleDownload = async () => {
    if (!currentFileAsset) return;
    try {
      const url = await fileAssetService.getSignedUrl(currentFileAsset.id);
      const link = document.createElement('a');
      link.href = url;
      link.download = currentFileAsset.fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      message.error('Failed to download file');
    }
  };

  const handleSubmit = async (values: UpdateProductMediaDto) => {
    if (!productId || !id) return;
    setPageState((prev) =>
      prev.status === 'ready'
        ? ({ ...prev, status: 'submitting' } as PageState)
        : prev,
    );
    try {
      const payload: UpdateProductMediaDto = {
        fileAssetId: uploadedFileAssetId || values.fileAssetId || undefined,
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
    <div style={{ maxWidth: 640 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Edit Media
      </Title>

      {/* Current File Display */}
      <Card
        title="Current File"
        style={{ marginBottom: 24 }}
        extra={
          currentFileAsset && (
            <Button
              type="link"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
            >
              Download
            </Button>
          )
        }
      >
        {currentFileAsset ? (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {currentFileAsset.fileType === 'IMAGE' ? (
              <Image
                alt={currentFileAsset.fileName}
                src={signedUrl || ''}
                width={200}
                style={{ objectFit: 'cover', borderRadius: 4 }}
                fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjEwMCIgeT0iNzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0Ij5JbWFnZTwvdGV4dD48L3N2Zz4="
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 0',
                }}
              >
                {getFileTypeIcon(currentFileAsset.fileType)}
                <Text strong style={{ marginLeft: 12, fontSize: 16 }}>
                  {currentFileAsset.fileName}
                </Text>
              </div>
            )}
            <div>
              <Text type="secondary">
                {formatFileSize(currentFileAsset.fileSize)} ·{' '}
                {currentFileAsset.mimeType}
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {currentFileAsset.id}
            </Text>
          </Space>
        ) : (
          <Text type="secondary">No file associated with this media</Text>
        )}
      </Card>

      {/* File Replacement */}
      <Card title="Replace File" style={{ marginBottom: 24 }}>
        <Dragger
          name="file"
          multiple={false}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
          showUploadList={false}
          beforeUpload={handleFileReplace}
          disabled={uploading}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          {uploadedFileName ? (
            <>
              <p className="ant-upload-text" style={{ color: '#52c41a' }}>
                ✅ {uploadedFileName}
              </p>
              <p className="ant-upload-hint">
                Drop or click to replace again
              </p>
            </>
          ) : (
            <>
              <p className="ant-upload-text">
                Click or drag file to replace current file
              </p>
              <p className="ant-upload-hint">
                Supports images, PDF, Office documents, TXT, CSV (max 10MB)
              </p>
            </>
          )}
        </Dragger>
        {uploading && (
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Spin size="small" /> <Text type="secondary">Uploading...</Text>
          </div>
        )}
      </Card>

      {/* Metadata Edit Form */}
      <Card title="Media Metadata">
        <Form<UpdateProductMediaDto>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item label="FileAsset ID" name="fileAssetId">
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

          <Divider />

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