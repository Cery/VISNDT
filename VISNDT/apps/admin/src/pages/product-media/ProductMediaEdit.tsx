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
import { VISNDT_COLORS } from '../../components/design-system/tokens';

const { Title, Text } = Typography;
const { Dragger } = Upload;
const { Option } = Select;

const MEDIA_TYPE_OPTIONS: { value: MediaType; label: string }[] = [
  { value: 'IMAGE', label: '图片' },
  { value: 'DOCUMENT', label: '文档' },
  { value: 'CERTIFICATE', label: '证书' },
  { value: 'OTHER', label: '其他' },
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
        err instanceof Error ? err.message : '加载媒体失败';
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
      message.success(`文件 "${file.name}" 上传成功`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '上传失败';
      message.error(errorMessage);
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload behavior
  };

  /** Handle download of current file */
  const handle下载 = async () => {
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
      message.error('文件下载失败');
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
      message.success('媒体更新成功');
      navigate(`/products/${productId}/media`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '更新媒体失败';
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
        message="加载媒体失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadData}>重试</Button>
            <Button
              onClick={() => navigate(`/products/${productId}/media`)}
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
    <div style={{ maxWidth: 640 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        编辑媒体
      </Title>

      {/* Current File Display */}
      <Card
        title="当前文件"
        style={{ marginBottom: 24 }}
        extra={
          currentFileAsset && (
            <Button
              type="link"
              icon={<DownloadOutlined />}
              onClick={handle下载}
            >
              下载
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
          <Text type="secondary">该媒体未关联文件</Text>
        )}
      </Card>

      {/* File Replacement */}
      <Card title="替换文件" style={{ marginBottom: 24 }}>
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
              <p className="ant-upload-text" style={{ color: VISNDT_COLORS.success }}>
                ✅ {uploadedFileName}
              </p>
              <p className="ant-upload-hint">
                拖动或点击以再次替换
              </p>
            </>
          ) : (
            <>
              <p className="ant-upload-text">
                点击或拖拽文件以替换当前文件
              </p>
              <p className="ant-upload-hint">
                支持图片、PDF、Office 文档、TXT、CSV（最大 10MB）
              </p>
            </>
          )}
        </Dragger>
        {uploading && (
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Spin size="small" /> <Text type="secondary">上传中...</Text>
          </div>
        )}
      </Card>

      {/* Metadata Edit Form */}
      <Card title="媒体元数据">
        <Form<UpdateProductMediaDto>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item label="文件资源ID" name="fileAssetId">
            <Input placeholder="输入文件资源ID" />
          </Form.Item>

          <Form.Item
            label="媒体类型"
            name="mediaType"
            rules={[{ required: true, message: '请选择媒体类型' }]}
          >
            <Select placeholder="请选择媒体类型">
              {MEDIA_TYPE_OPTIONS.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="标题" name="title">
            <Input placeholder="如：产品正面照" />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.TextArea placeholder="可选描述" rows={3} />
          </Form.Item>

          <Form.Item
            label="主图"
            name="isPrimary"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item label="显示顺序" name="displayOrder">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={pageState.status === 'submitting'}
            >
              更新媒体
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate(`/products/${productId}/media`)}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ProductMediaEdit;