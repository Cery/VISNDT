import { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Image,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Typography,
} from 'antd';
import {
  UploadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { contentService } from '../../api/content.service';
import { fileAssetService } from '../../api/file-asset.service';
import type {
  ContentMedia,
  ContentMediaType,
  CreateContentMediaDto,
  UpdateContentMediaDto,
} from '../../types/content.types';
import { getFileTypeIcon, formatFileSize } from '../../utils/file-utils';

const { Text } = Typography;

const MEDIA_TYPE_LABEL_MAP: Record<ContentMediaType, string> = {
  IMAGE: '图片',
  ATTACHMENT: '附件',
};

interface ContentMediaManagerProps {
  contentId: string;
}

/**
 * Content media management UI (ADMIN).
 * Enables upload-create, caption/altText/sortOrder editing, and cascade delete.
 */
export default function ContentMediaManager({ contentId }: ContentMediaManagerProps) {
  const [mediaList, setMediaList] = useState<ContentMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [signedUrlCache, setSignedUrlCache] = useState<Record<string, string | null>>({});
  const [uploading, setUploading] = useState(false);
  const [editTarget, setEditTarget] = useState<ContentMedia | null>(null);
  const [editForm] = Form.useForm<UpdateContentMediaDto>();

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentService.listMedia(contentId);
      setMediaList(data);
      data.forEach((item) => {
        const fa = item.fileAsset;
        if (fa && fa.fileType === 'IMAGE' && !(fa.id in signedUrlCache)) {
          fileAssetService
            .getSignedUrl(fa.id)
            .then((url) => setSignedUrlCache((prev) => ({ ...prev, [fa.id]: url })))
            .catch(() => setSignedUrlCache((prev) => ({ ...prev, [fa.id]: null })));
        }
      });
    } catch {
      message.error('加载媒体失败');
    } finally {
      setLoading(false);
    }
  }, [contentId, signedUrlCache]);

  useEffect(() => {
    loadMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId]);

  const handleUpload = async (file: File) => {
    if (!file) return;
    const dto: CreateContentMediaDto = {
      type: file.type.startsWith('image/') ? 'IMAGE' : 'ATTACHMENT',
    };
    setUploading(true);
    try {
      await contentService.createMediaWithUpload(contentId, file, dto);
      message.success('媒体上传成功');
      loadMedia();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '上传失败';
      message.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const openEdit = (media: ContentMedia) => {
    setEditTarget(media);
    editForm.setFieldsValue({
      type: media.type,
      caption: media.caption || undefined,
      altText: media.altText || undefined,
      sortOrder: media.sortOrder,
    });
  };

  const handleEditSubmit = async (values: UpdateContentMediaDto) => {
    if (!editTarget) return;
    try {
      await contentService.updateMedia(contentId, editTarget.id, values);
      message.success('媒体已更新');
      setEditTarget(null);
      loadMedia();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '更新失败';
      message.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contentService.removeMedia(contentId, id);
      message.success('媒体已删除');
      loadMedia();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '删除失败';
      message.error(msg);
    }
  };

  const columns: ColumnsType<ContentMedia> = [
    {
      title: '预览',
      key: 'preview',
      width: 80,
      render: (_: unknown, record: ContentMedia) => {
        const fa = record.fileAsset ?? null;
        if (!fa) return getFileTypeIcon('OTHER');
        if (record.type === 'IMAGE') {
          const url = signedUrlCache[fa.id];
          return (
            <Image
              alt={fa.fileName}
              src={url || ''}
              width={48}
              height={48}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              preview={url ? { mask: <EyeOutlined /> } : false}
              fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iMjQiIHk9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSI4Ij5JbWc8L3RleHQ+PC9zdmc+"
            />
          );
        }
        return getFileTypeIcon('DOCUMENT');
      },
    },
    {
      title: '文件名',
      key: 'fileName',
      ellipsis: true,
      render: (_: unknown, record: ContentMedia) => {
        const fa = record.fileAsset ?? null;
        if (fa) {
          return (
            <div>
              <Text>{fa.fileName}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {formatFileSize(fa.fileSize)} · {fa.mimeType}
              </Text>
            </div>
          );
        }
        return <Text type="secondary" italic>未附加文件</Text>;
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: ContentMediaType) => (
        <Tag color={type === 'IMAGE' ? 'blue' : 'green'}>
          {MEDIA_TYPE_LABEL_MAP[type] || type}
        </Tag>
      ),
    },
    {
      title: '说明',
      dataIndex: 'caption',
      key: 'caption',
      render: (caption?: string) => caption || '-',
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      render: (_: unknown, record: ContentMedia) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此媒体吗？"
            description="此操作将同时删除关联文件，无法撤销。"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          内容媒体
        </Typography.Title>
        <Upload
          accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,text/plain,text/csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          showUploadList={false}
          beforeUpload={(file) => {
            handleUpload(file);
            return false;
          }}
        >
          <Button type="primary" icon={<UploadOutlined />} loading={uploading}>
            上传媒体
          </Button>
        </Upload>
      </div>

      <Table<ContentMedia>
        columns={columns}
        dataSource={mediaList}
        rowKey="id"
        loading={loading}
        size="small"
        locale={{ emptyText: '暂无媒体，点击「上传媒体」添加文件。' }}
      />

      <Modal
        title="编辑媒体"
        open={!!editTarget}
        onCancel={() => setEditTarget(null)}
        onOk={() => editForm.submit()}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item name="type" label="类型">
            <Select
              options={[
                { value: 'IMAGE', label: '图片' },
                { value: 'ATTACHMENT', label: '附件' },
              ]}
            />
          </Form.Item>
          <Form.Item name="caption" label="说明">
            <Input placeholder="用于图集/附件列表展示的说明文字" />
          </Form.Item>
          <Form.Item name="altText" label="Alt 文本">
            <Input placeholder="无障碍与 SEO 描述（图片）" />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}