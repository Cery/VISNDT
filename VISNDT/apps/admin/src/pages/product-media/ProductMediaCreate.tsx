import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Button, Card, Select, Switch, Upload, Typography, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { productMediaService } from '../../api/product-media.service';
import type { CreateProductMediaDto, MediaType } from '../../types/product-media.types';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title } = Typography;
const { Dragger } = Upload;
const { Option } = Select;

const MEDIA_TYPE_OPTIONS: { value: MediaType; label: string }[] = [
  { value: 'IMAGE', label: 'IMAGE' },
  { value: 'DOCUMENT', label: 'DOCUMENT' },
  { value: 'CERTIFICATE', label: 'CERTIFICATE' },
  { value: 'OTHER', label: 'OTHER' },
];

type PageState =
  | { status: 'idle' }
  | { status: 'submitting'; fileName: string }
  | { status: 'error'; message: string };

function ProductMediaCreate() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateProductMediaDto>();
  const [pageState, setPageState] = useState<PageState>({ status: 'idle' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const selectedFileName = useRef<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    selectedFileName.current = file.name;
    return false; // Prevent default upload behavior
  };

  const handleDrop = (info: { fileList: UploadFile[] }) => {
    const file = info.fileList[0]?.originFileObj;
    if (file) {
      setSelectedFile(file);
      selectedFileName.current = file.name;
    }
    return false;
  };

  const handleSubmit = async (values: CreateProductMediaDto) => {
    if (!productId || !selectedFile) return;
    setPageState({ status: 'submitting', fileName: selectedFile.name });

    try {
      const metadata: CreateProductMediaDto = {
        mediaType: values.mediaType,
        title: values.title || undefined,
        description: values.description || undefined,
        isPrimary: values.isPrimary ?? false,
        displayOrder: values.displayOrder ?? 0,
      };

      await productMediaService.createWithUpload(productId, selectedFile, metadata);
      message.success('媒体添加成功');
      navigate(`/products/${productId}/media`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '添加媒体失败';
      setPageState({ status: 'error', message: errorMessage });
      message.error(errorMessage);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    selectedFileName.current = null;
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        添加媒体
      </Title>

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
          <Form.Item label="上传文件">
            <Dragger
              name="file"
              multiple={false}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
              showUploadList={false}
              beforeUpload={handleFileSelect}
              onDrop={handleDrop as any}
              onRemove={removeFile}
              disabled={pageState.status === 'submitting'}
              fileList={
                selectedFile
                  ? ([
                      {
                        uid: '-1',
                        name: selectedFile.name,
                        status: 'done',
                      },
                    ] as UploadFile[])
                  : []
              }
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              {selectedFileName.current ? (
                <>
                  <p className="ant-upload-text" style={{ color: '#52c41a' }}>
                    ✅ {selectedFileName.current}
                  </p>
                  <p className="ant-upload-hint">
                    拖动或点击以替换文件
                  </p>
                </>
              ) : (
                <>
                  <p className="ant-upload-text">
                    点击或拖拽文件到此处上传
                  </p>
                  <p className="ant-upload-hint">
                    支持图片、PDF、Office 文档、TXT、CSV（最大 10MB）
                  </p>
                </>
              )}
            </Dragger>
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={pageState.status === 'submitting'}
              disabled={!selectedFile || pageState.status === 'submitting'}
            >
              添加媒体
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

export default ProductMediaCreate;