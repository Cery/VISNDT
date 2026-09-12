import { useState, useEffect, useCallback } from 'react';
import { Card, Statistic, Row, Col, Button, Alert, Progress, Modal, Spin, Typography, Tag, Space, Descriptions } from 'antd';
import { ReloadOutlined, ThunderboltOutlined, ClusterOutlined, FileTextOutlined, ShoppingOutlined, WarningOutlined } from '@ant-design/icons';
import { embeddingService, type EmbeddingStatus } from '../api/embedding.service';
import { PageHeader } from '../components/common';

const { Text, Paragraph } = Typography;

export default function EmbeddingManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<EmbeddingStatus | null>(null);
  const [operationLoading, setOperationLoading] = useState<string | null>(null);
  const [resultModal, setResultModal] = useState<{ title: string; content: string } | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await embeddingService.getStatus();
      setStatus(result);
    } catch {
      setError('加载 Embedding 状态失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleOperation = async (
    key: string,
    label: string,
    fn: () => Promise<unknown>,
  ) => {
    try {
      setOperationLoading(key);
      const result = await fn();
      setResultModal({
        title: `${label} - 完成`,
        content: JSON.stringify(result, null, 2),
      });
      await fetchStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '操作失败';
      setResultModal({
        title: `${label} - 失败`,
        content: msg,
      });
    } finally {
      setOperationLoading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, color: '#999' }}>加载 Embedding 状态...</div>
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} showIcon action={<Button onClick={fetchStatus}>重试</Button>} />;
  }

  if (!status) return null;

  const contentPct = status.contentStats.total > 0
    ? Math.round((status.contentStats.withEmbedding / status.contentStats.total) * 100)
    : 0;
  const productPct = status.productStats.total > 0
    ? Math.round((status.productStats.withEmbedding / status.productStats.total) * 100)
    : 0;
  const chunkPct = status.chunkStats.totalContent > 0
    ? Math.round((status.chunkStats.contentWithChunks / status.chunkStats.totalContent) * 100)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHeader
        title={<><ThunderboltOutlined /> AI Data Preparation - Embedding 管理</>}
        subtitle="Embedding 生成使用 OpenAI text-embedding-3-small 模型（1536 维）"
        extra={
          <Space>
            <Tag color={status.providerAvailable ? 'green' : 'red'}>
              {status.providerAvailable ? 'Provider: ' + status.providerName : '未配置 Provider'}
            </Tag>
            <Button icon={<ReloadOutlined />} onClick={fetchStatus} loading={loading}>
              刷新
            </Button>
          </Space>
        }
      />

      {!status.providerAvailable && (
        <Alert
          type="warning"
          icon={<WarningOutlined />}
          message="OpenAI API Key 未配置"
          description="请在 .env 中设置 OPENAI_API_KEY 以启用 Embedding 生成功能。当前可查看状态，但无法生成 Embedding。"
          showIcon
        />
      )}

      <Text type="secondary">
        Embedding 生成使用 OpenAI text-embedding-3-small 模型（1536 维）。
        当前为手动触发模式，选择对应操作后系统将逐个处理并保存向量数据。
      </Text>

      <Descriptions bordered size="small" column={3}>
        <Descriptions.Item label="Provider">{status.providerName}</Descriptions.Item>
        <Descriptions.Item label="向量维度">1536</Descriptions.Item>
        <Descriptions.Item label="触发模式">Admin Manual</Descriptions.Item>
      </Descriptions>

      {/* Content Embedding */}
      <Card
        title={<><FileTextOutlined /> 内容 Embedding</>}
        extra={
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            loading={operationLoading === 'content-all'}
            disabled={!status.providerAvailable}
            onClick={() => handleOperation('content-all', '批量生成内容 Embedding', () => embeddingService.generateAllContentEmbeddings())}
          >
            批量生成
          </Button>
        }
      >
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="内容总数" value={status.contentStats.total} />
          </Col>
          <Col span={8}>
            <Statistic title="已生成 Embedding" value={status.contentStats.withEmbedding} />
          </Col>
          <Col span={8}>
            <Statistic title="待生成" value={status.contentStats.withoutEmbedding} />
          </Col>
        </Row>
        <div style={{ marginTop: 12 }}>
          <Progress percent={contentPct} status={contentPct === 100 ? 'success' : 'active'} />
        </div>
      </Card>

      {/* Product Embedding */}
      <Card
        title={<><ShoppingOutlined /> 产品 Embedding</>}
        extra={
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            loading={operationLoading === 'product-all'}
            disabled={!status.providerAvailable}
            onClick={() => handleOperation('product-all', '批量生成产品 Embedding', () => embeddingService.generateAllProductEmbeddings())}
          >
            批量生成
          </Button>
        }
      >
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="产品总数" value={status.productStats.total} />
          </Col>
          <Col span={8}>
            <Statistic title="已生成 Embedding" value={status.productStats.withEmbedding} />
          </Col>
          <Col span={8}>
            <Statistic title="待生成" value={status.productStats.withoutEmbedding} />
          </Col>
        </Row>
        <div style={{ marginTop: 12 }}>
          <Progress percent={productPct} status={productPct === 100 ? 'success' : 'active'} />
        </div>
      </Card>

      {/* Content Chunking */}
      <Card
        title={<><ClusterOutlined /> 内容切片 (Content Chunk)</>}
        extra={
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            loading={operationLoading === 'chunk-all'}
            disabled={!status.providerAvailable}
            onClick={() => handleOperation('chunk-all', '批量生成内容切片', () => embeddingService.generateAllContentChunks())}
          >
            批量切片
          </Button>
        }
      >
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="内容总数" value={status.chunkStats.totalContent} />
          </Col>
          <Col span={8}>
            <Statistic title="切片总数" value={status.chunkStats.totalChunks} />
          </Col>
          <Col span={8}>
            <Statistic title="已切片内容" value={status.chunkStats.contentWithChunks} />
          </Col>
        </Row>
        <div style={{ marginTop: 12 }}>
          <Progress percent={chunkPct} status={chunkPct === 100 ? 'success' : 'active'} />
        </div>
        <Paragraph style={{ marginTop: 12, color: '#999', fontSize: 12 }}>
          切片策略：按段落分割（最大 1000 字符/块），小块合并。每个切片独立生成 Embedding，为未来 RAG 和语义搜索提供数据基础。
        </Paragraph>
      </Card>

      <Modal
        title={resultModal?.title}
        open={!!resultModal}
        onOk={() => setResultModal(null)}
        onCancel={() => setResultModal(null)}
        width={600}
      >
        <pre style={{ maxHeight: 300, overflow: 'auto', background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
          {resultModal?.content}
        </pre>
      </Modal>
    </div>
  );
}