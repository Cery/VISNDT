import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Spin,
  Alert,
  Button,
  Space,
  Typography,
  message,
  Modal,
  Input,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { supplierProductService } from '../api';
import type { SupplierProduct } from '../types';
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { StatusTag } from '../components/design-system';

const { Title, Text } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: SupplierProduct };

const STATUS_LABEL_MAP: Record<string, string> = {
  DRAFT: '草稿',
  SUBMITTED: '已提交',
  REVIEWING: '审核中',
  APPROVED: '已通过',
  PUBLISHED: '已发布',
  REJECTED: '已拒绝',
};

export default function SupplierProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await supplierProductService.getById(id);
      setPageState({ status: 'success', data });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载供应商产品失败';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const runAction = useCallback(
    async (action: () => Promise<unknown>, successMsg: string) => {
      if (!id) return;
      setActionLoading(true);
      try {
        await action();
        message.success(successMsg);
        fetchData();
      } catch (err) {
        const msg = err instanceof Error ? err.message : '操作失败';
        message.error(msg);
      } finally {
        setActionLoading(false);
      }
    },
    [id, fetchData],
  );

  const handleSubmit = () => {
    Modal.confirm({
      title: '提交供应商产品',
      content: '确认提交（DRAFT → SUBMITTED）？',
      okText: '提交',
      onOk: () => runAction(() => supplierProductService.submit(id!), '供应商产品已提交'),
    });
  };

  const handleReview = () => {
    Modal.confirm({
      title: '开始审核',
      content: '确认开始审核（SUBMITTED → REVIEWING）？',
      okText: '开始审核',
      onOk: () => runAction(() => supplierProductService.beginReview(id!), '已进入审核'),
    });
  };

  const handleApprove = () => {
    Modal.confirm({
      title: '通过审核',
      content: '确认通过（REVIEWING → APPROVED）？',
      okText: '通过',
      onOk: () => runAction(() => supplierProductService.approve(id!), '供应商产品已通过'),
    });
  };

  const handlePublish = () => {
    Modal.confirm({
      title: '发布供应商产品',
      content: '确认发布（APPROVED → PUBLISHED）？',
      okText: '发布',
      onOk: () => runAction(() => supplierProductService.publish(id!), '供应商产品已发布'),
    });
  };

  const handleReject = () => {
    if (!rejectNote.trim()) {
      message.warning('请填写拒绝原因（reviewedNote）');
      return;
    }
    runAction(() => supplierProductService.reject(id!, rejectNote.trim()), '供应商产品已拒绝')
      .then(() => setRejectOpen(false))
      .catch(() => undefined);
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
        message="加载供应商产品失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchData}>重试</Button>
            <Button onClick={() => navigate('/supplier-products')} icon={<ArrowLeftOutlined />}>
              返回列表
            </Button>
          </Space>
        }
      />
    );
  }

  const sp = pageState.data;
  const formatDate = (date?: string | null) =>
    date ? new Date(date).toLocaleString() : '-';

  const status = sp.status;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/supplier-products')}>
          返回列表
        </Button>
      </Space>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: VISNDT_COLORS.primary, flexShrink: 0 }} />
          <Title level={4} style={{ margin: 0 }}>Supplier Product Detail</Title>
        </div>
        <Text type="secondary" style={{ fontSize: 12, marginLeft: 12, display: 'block', marginTop: 4 }}>
          供应商型号审核详情 — Review / Approve / Publish / Govern
        </Text>
      </div>

      {/* Card: SupplierProduct Identity */}
      <Card title="供应商产品身份（SupplierProduct）" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="品牌">{sp.brand}</Descriptions.Item>
          <Descriptions.Item label="系列">{sp.series || '-'}</Descriptions.Item>
          <Descriptions.Item label="型号">{sp.modelNumber}</Descriptions.Item>
          <Descriptions.Item label="Slug">{sp.slug || '-'}</Descriptions.Item>
          <Descriptions.Item label="所属组织">
            {sp.organization?.name || sp.organizationId}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <StatusTag status={status} label={STATUS_LABEL_MAP[status] || status} />
          </Descriptions.Item>
        </Descriptions>
        {sp.description && (
          <p style={{ whiteSpace: 'pre-wrap', marginTop: 16, marginBottom: 0 }}>
            <b>描述：</b>
            {sp.description}
          </p>
        )}
        {sp.technicalDescription && (
          <p style={{ whiteSpace: 'pre-wrap', marginTop: 8, marginBottom: 0 }}>
            <b>技术描述：</b>
            {sp.technicalDescription}
          </p>
        )}
        {sp.applicationInfo && (
          <p style={{ whiteSpace: 'pre-wrap', marginTop: 8, marginBottom: 0 }}>
            <b>应用信息：</b>
            {sp.applicationInfo}
          </p>
        )}
      </Card>

      {/* Card: Platform Capability Binding */}
      {sp.platformProduct && (
        <Card title="平台能力绑定（Platform Capability Binding）" style={{ marginBottom: 16 }}>
          <Descriptions bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="能力节点">
              {sp.platformProduct.name}
            </Descriptions.Item>
            <Descriptions.Item label="Slug">
              {sp.platformProduct.slug || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="能力状态">
              {sp.platformProduct.status || '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Card: Parameters */}
      {sp.parameterValues && sp.parameterValues.length > 0 && (
        <Card title="参数值（Parameter Values）" style={{ marginBottom: 16 }}>
          <Descriptions bordered column={{ xs: 1, sm: 2 }}>
            {sp.parameterValues.map((pv) => (
              <Descriptions.Item
                key={pv.id || pv.parameterDefinitionId}
                label={pv.parameterDefinition?.name || pv.parameterDefinitionId}
              >
                {pv.value || '-'}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      )}

      {/* Card: Media */}
      {sp.media && sp.media.length > 0 && (
        <Card title="媒体（Media）" style={{ marginBottom: 16 }}>
          {sp.media.map((m) => (
            <div key={m.id} style={{ marginBottom: 4 }}>
              {m.title || m.mediaType || m.id}
            </div>
          ))}
        </Card>
      )}

      {/* Card: Governance History */}
      <Card title="审核状态与历史（Governance Status / Review History）" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="提交时间">
            {formatDate(sp.submittedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="审核时间">
            {formatDate(sp.reviewedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="审核人">
            {sp.reviewedBy || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="拒绝原因">
            {sp.reviewedNote || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="发布时间">
            {formatDate(sp.publishedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {formatDate(sp.createdAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Card: Approval Workflow Actions */}
      <Card title="审核工作流（Approval Workflow）" style={{ marginBottom: 16 }}>
        <Space wrap>
          {status === 'DRAFT' && (
            <Button type="primary" loading={actionLoading} onClick={handleSubmit}>
              提交（DRAFT → SUBMITTED）
            </Button>
          )}
          {status === 'SUBMITTED' && (
            <Button type="primary" loading={actionLoading} onClick={handleReview}>
              开始审核（SUBMITTED → REVIEWING）
            </Button>
          )}
          {status === 'REVIEWING' && (
            <>
              <Button type="primary" loading={actionLoading} onClick={handleApprove}>
                通过（REVIEWING → APPROVED）
              </Button>
              <Button danger loading={actionLoading} onClick={() => setRejectOpen(true)}>
                拒绝（REVIEWING → REJECTED）
              </Button>
            </>
          )}
          {status === 'APPROVED' && (
            <Button type="primary" loading={actionLoading} onClick={handlePublish}>
              发布（APPROVED → PUBLISHED）
            </Button>
          )}
          {['REJECTED', 'PUBLISHED'].includes(status) && (
            <Text type="secondary">当前为终态，无可执行审核操作。</Text>
          )}
        </Space>
      </Card>

      <Modal
        title="拒绝供应商产品"
        open={rejectOpen}
        okText="拒绝"
        okType="danger"
        cancelText="取消"
        confirmLoading={actionLoading}
        onOk={handleReject}
        onCancel={() => setRejectOpen(false)}
      >
        <Input.TextArea
          rows={4}
          placeholder="请输入拒绝原因（reviewedNote，必填）"
          value={rejectNote}
          onChange={(e) => setRejectNote(e.target.value)}
          maxLength={500}
          showCount
        />
      </Modal>
    </div>
  );
}