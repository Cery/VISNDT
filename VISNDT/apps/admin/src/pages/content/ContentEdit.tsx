import { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Alert, Button, Space, Card, Descriptions, Tag, Modal, message, Typography } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { contentService } from '../../api';
import type { Content, ContentStatus, ContentFormData } from '../../types';
import { ContentForm } from '../../components/content';

// Lazy-load the auxiliary Content Operation panels so the Content edit page
// ships a smaller initial bundle; each panel is only fetched when rendered.
const ContentMediaManager = lazy(() => import('../../components/content/ContentMediaManager'));
const ContentRevisionHistory = lazy(() => import('../../components/content/ContentRevisionHistory'));
const ContentScheduledPublish = lazy(() => import('../../components/content/ContentScheduledPublish'));
const ContentApprovalTimeline = lazy(() => import('../../components/content/ContentApprovalTimeline'));
const ContentSeoPanel = lazy(() => import('../../components/content/ContentSeoPanel'));

const panelFallback = (
  <div style={{ textAlign: 'center', padding: 24 }}>
    <Spin />
  </div>
);

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: Content };

const STATUS_COLOR_MAP: Record<string, string> = {
  DRAFT: 'default',
  REVIEW: 'orange',
  PUBLISHED: 'green',
  ARCHIVED: 'red',
};

const STATUS_LABEL_MAP: Record<string, string> = {
  DRAFT: '草稿',
  REVIEW: '审核中',
  PUBLISHED: '已发布',
  ARCHIVED: '已归档',
};

const TYPE_LABEL_MAP: Record<string, string> = {
  ARTICLE: '文章',
  KNOWLEDGE: '知识',
  SOLUTION: '解决方案',
  INSIGHT: '洞察',
};

export default function ContentEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [actionLoading, setActionLoading] = useState(false);

  const loadContent = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await contentService.getById(id);
      setPageState({ status: 'ready', data });
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载内容失败';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const runAction = useCallback(
    async (action: 'submit' | 'review' | 'publish' | 'archive', confirmText: string) => {
      if (!id) return;
      Modal.confirm({
        title: '确认操作',
        content: confirmText,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          try {
            setActionLoading(true);
            if (action === 'submit') await contentService.submit(id);
            else if (action === 'review') await contentService.review(id);
            else if (action === 'publish') await contentService.publish(id);
            else if (action === 'archive') await contentService.archive(id);
            message.success('操作成功');
            loadContent();
          } catch (err) {
            const msg = err instanceof Error ? err.message : '操作失败';
            message.error(msg);
          } finally {
            setActionLoading(false);
          }
        },
      });
    },
    [id, loadContent],
  );

  const handleSave = async (data: ContentFormData) => {
    if (!id) return;
    await contentService.update(id, {
      type: data.type,
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords,
    });
    await loadContent();
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
        message="加载内容失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadContent}>重试</Button>
            <Button onClick={() => navigate('/content')} icon={<ArrowLeftOutlined />}>
              返回列表
            </Button>
          </Space>
        }
      />
    );
  }

  const content = pageState.data;
  const status: ContentStatus = content.status;

  const renderLifecycleButtons = () => {
    const buttons: React.ReactNode[] = [];
    if (status === 'DRAFT') {
      buttons.push(
        <Button
          key="submit"
          type="primary"
          loading={actionLoading}
          onClick={() => runAction('submit', '提交审核后内容将进入审核中状态，是否继续？')}
        >
          提交审核
        </Button>,
      );
    }
    if (status === 'REVIEW') {
      buttons.push(
        <Button
          key="review"
          type="primary"
          loading={actionLoading}
          onClick={() => runAction('review', '审核通过后内容将进入已发布状态，是否继续？')}
        >
          审核通过
        </Button>,
      );
    }
    if (status === 'PUBLISHED') {
      buttons.push(
        <Button
          key="archive"
          danger
          loading={actionLoading}
          onClick={() => runAction('archive', '归档后内容将不再公开展示，是否继续？')}
        >
          归档
        </Button>,
      );
    }
    return buttons;
  };

  const initialValues: Partial<ContentFormData> = {
    type: content.type as 'ARTICLE' | 'KNOWLEDGE' | 'SOLUTION',
    title: content.title,
    slug: content.slug,
    summary: content.summary || undefined,
    content: content.content,
    seoTitle: content.seoTitle || undefined,
    seoDescription: content.seoDescription || undefined,
    seoKeywords: content.seoKeywords || undefined,
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/content')}>
          返回列表
        </Button>
        <Button icon={<ReloadOutlined />} onClick={loadContent}>
          刷新
        </Button>
      </Space>

      <Title level={3}>编辑内容</Title>

      <Card title="内容信息" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="标题">{content.title}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={STATUS_COLOR_MAP[status] || 'default'}>
              {STATUS_LABEL_MAP[status] || status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="类型">
            {TYPE_LABEL_MAP[content.type] || content.type}
          </Descriptions.Item>
          <Descriptions.Item label="Slug">{content.slug}</Descriptions.Item>
          <Descriptions.Item label="作者">
            {content.author?.name || content.author?.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(content.createdAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
        {renderLifecycleButtons().length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Space>{renderLifecycleButtons()}</Space>
          </div>
        )}
      </Card>

      <ContentForm
        initialValues={initialValues}
        onSubmit={handleSave}
        submitLabel="保存"
        title=""
      />

      <Card title="SEO 运营面板" style={{ marginTop: 16 }}>
        <Suspense fallback={panelFallback}>
          <ContentSeoPanel content={content} />
        </Suspense>
      </Card>

      <Card title="媒体管理" style={{ marginTop: 16 }}>
        <Suspense fallback={panelFallback}>
          <ContentMediaManager contentId={content.id} />
        </Suspense>
      </Card>

      <Card title="定时发布" style={{ marginTop: 16 }}>
        <Suspense fallback={panelFallback}>
          <ContentScheduledPublish content={content} onChanged={loadContent} />
        </Suspense>
      </Card>

      <Card title="审核时间线" style={{ marginTop: 16 }}>
        <Suspense fallback={panelFallback}>
          <ContentApprovalTimeline contentId={content.id} />
        </Suspense>
      </Card>

      <Card title="版本历史" style={{ marginTop: 16 }}>
        <Suspense fallback={panelFallback}>
          <ContentRevisionHistory contentId={content.id} />
        </Suspense>
      </Card>
    </div>
  );
}