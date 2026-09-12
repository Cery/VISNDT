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
  Form,
} from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { supplierProductService } from '../api';
import type { SupplierProduct } from '../types';
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { StatusTag } from '../components/design-system';
import { PageHeader } from '../components/common';

const { Text } = Typography;

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
  const [editOpen, setEditOpen] = useState(false);
  const [editForm] = Form.useForm();

  const fetchData = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await supplierProductService.getById(id);
      setPageState({ status: 'success', data });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '加载产品型号失败';
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
      title: '提交产品型号',
      content: '确认提交（DRAFT → SUBMITTED）？',
      okText: '提交',
      onOk: () => runAction(() => supplierProductService.submit(id!), '产品型号已提交'),
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
      onOk: () => runAction(() => supplierProductService.approve(id!), '产品型号已通过'),
    });
  };

  const handlePublish = () => {
    Modal.confirm({
      title: '发布产品型号',
      content: '确认发布（APPROVED → PUBLISHED）？',
      okText: '发布',
      onOk: () => runAction(() => supplierProductService.publish(id!), '产品型号已发布'),
    });
  };

  const handleReject = () => {
    if (!rejectNote.trim()) {
      message.warning('请填写拒绝原因（reviewedNote）');
      return;
    }
    runAction(() => supplierProductService.reject(id!, rejectNote.trim()), '产品型号已拒绝')
      .then(() => setRejectOpen(false))
      .catch(() => undefined);
  };

  const handleEditSave = () => {
    editForm.validateFields().then((values: Record<string, unknown>) => {
      if (!id) return;
      setActionLoading(true);
      supplierProductService
        .update(id, {
          brand: values.brand as string,
          series: (values.series as string) || null,
          modelNumber: values.modelNumber as string,
          slug: (values.slug as string) || null,
          description: (values.description as string) || null,
          technicalDescription: (values.technicalDescription as string) || null,
          applicationInfo: (values.applicationInfo as string) || null,
        })
        .then(() => {
          message.success('产品型号已更新');
          setEditOpen(false);
          fetchData();
        })
        .catch((err) => {
          const msg = err instanceof Error ? err.message : '更新失败';
          message.error(msg);
        })
        .finally(() => setActionLoading(false));
    });
  };

  const handleUnpublish = () => {
    Modal.confirm({
      title: '下架产品型号',
      content: '确认下架（PUBLISHED → APPROVED）？下架后将从公开发现中移除。',
      okText: '下架',
      okType: 'danger',
      onOk: () => runAction(() => supplierProductService.unpublish(id!), '产品型号已下架'),
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: '删除产品型号',
      content: '确认删除该产品型号？若存在关联 Offer，删除将被依赖保护阻止。',
      okText: '删除',
      okType: 'danger',
      okButtonProps: { id: `delete-${id}` },
      onOk: async () => {
        if (!id) return;
        setActionLoading(true);
        try {
          await supplierProductService.remove(id);
          message.success('产品型号已删除');
          navigate('/supplier-products');
        } catch (err) {
          const msg = err instanceof Error ? err.message : '删除失败';
          message.error(msg);
        } finally {
          setActionLoading(false);
        }
      },
    });
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
        message="加载产品型号失败"
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
      <PageHeader
        title="产品型号详情"
        subtitle="产品型号审核详情 — 审核 / 通过 / 发布 / 治理"
        extra={
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/supplier-products')}>
            返回列表
          </Button>
        }
      />

      {/* Card: SupplierProduct Identity */}
      <Card title="产品型号身份" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="品牌">{sp.brand}</Descriptions.Item>
          <Descriptions.Item label="系列">{sp.series || '-'}</Descriptions.Item>
          <Descriptions.Item label="型号">{sp.modelNumber}</Descriptions.Item>
          <Descriptions.Item label="Slug">{sp.slug || '-'}</Descriptions.Item>
          <Descriptions.Item label="所属组织">
            {sp.organization?.name || sp.organizationId}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <StatusTag status={status} label={STATUS_LABEL_MAP[status] || '未知状态'} />
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
        <Card title="平台产品绑定" style={{ marginBottom: 16 }}>
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
            <>
              <Button type="primary" loading={actionLoading} onClick={handleSubmit}>
                提交（DRAFT → SUBMITTED）
              </Button>
              <Button icon={<EditOutlined />} loading={actionLoading} onClick={() => { editForm.setFieldsValue({ brand: sp.brand, series: sp.series ?? '', modelNumber: sp.modelNumber, slug: sp.slug ?? '', description: sp.description ?? '', technicalDescription: sp.technicalDescription ?? '', applicationInfo: sp.applicationInfo ?? '' }); setEditOpen(true); }}>
                编辑（草稿）
              </Button>
              <Button danger icon={<DeleteOutlined />} loading={actionLoading} onClick={handleDelete}>
                删除
              </Button>
            </>
          )}
          {status === 'SUBMITTED' && (
            <>
              <Button type="primary" loading={actionLoading} onClick={handleReview}>
                开始审核（SUBMITTED → REVIEWING）
              </Button>
              <Button danger icon={<DeleteOutlined />} loading={actionLoading} onClick={handleDelete}>
                删除
              </Button>
            </>
          )}
          {status === 'REVIEWING' && (
            <>
              <Button type="primary" loading={actionLoading} onClick={handleApprove}>
                通过（REVIEWING → APPROVED）
              </Button>
              <Button danger loading={actionLoading} onClick={() => setRejectOpen(true)}>
                拒绝（REVIEWING → REJECTED）
              </Button>
              <Button icon={<DeleteOutlined />} loading={actionLoading} onClick={handleDelete}>
                删除
              </Button>
            </>
          )}
          {status === 'APPROVED' && (
            <>
              <Button type="primary" loading={actionLoading} onClick={handlePublish}>
                发布（APPROVED → PUBLISHED）
              </Button>
              <Button icon={<EditOutlined />} loading={actionLoading} onClick={() => { editForm.setFieldsValue({ brand: sp.brand, series: sp.series ?? '', modelNumber: sp.modelNumber, slug: sp.slug ?? '', description: sp.description ?? '', technicalDescription: sp.technicalDescription ?? '', applicationInfo: sp.applicationInfo ?? '' }); setEditOpen(true); }}>
                编辑（已批准，未公开）
              </Button>
              <Button danger icon={<DeleteOutlined />} loading={actionLoading} onClick={handleDelete}>
                删除
              </Button>
            </>
          )}
          {status === 'PUBLISHED' && (
            <>
              <Button type="primary" danger loading={actionLoading} onClick={handleUnpublish}>
                下架（PUBLISHED → APPROVED）
              </Button>
              <Button danger icon={<DeleteOutlined />} loading={actionLoading} onClick={handleDelete}>
                删除
              </Button>
            </>
          )}
          {status === 'REJECTED' && (
            <Button danger icon={<DeleteOutlined />} loading={actionLoading} onClick={handleDelete}>
              删除
            </Button>
          )}
        </Space>
      </Card>

      <Modal
        title="编辑产品型号"
        open={editOpen}
        okText="保存"
        cancelText="取消"
        confirmLoading={actionLoading}
        onOk={handleEditSave}
        onCancel={() => setEditOpen(false)}
        destroyOnHidden
      >
        <Form
          form={editForm}
          layout="vertical"
          initialValues={{ brand: '', series: '', modelNumber: '', slug: '', description: '', technicalDescription: '', applicationInfo: '' }}
          style={{ marginTop: 8 }}
        >
          <Form.Item name="brand" label="品牌（Brand）" rules={[{ required: true, message: '请输入品牌' }]}>
            <Input maxLength={255} />
          </Form.Item>
          <Form.Item name="series" label="系列（Series）">
            <Input maxLength={255} />
          </Form.Item>
          <Form.Item name="modelNumber" label="型号（Model Number）" rules={[{ required: true, message: '请输入型号' }]}>
            <Input maxLength={255} />
          </Form.Item>
          <Form.Item name="slug" label="Slug（可选）" tooltip="唯一标识；修改必须唯一。">
            <Input maxLength={255} />
          </Form.Item>
          <Form.Item name="description" label="描述（Description）">
            <Input.TextArea rows={2} maxLength={2000} />
          </Form.Item>
          <Form.Item name="technicalDescription" label="技术描述（Technical Description）">
            <Input.TextArea rows={2} maxLength={2000} />
          </Form.Item>
          <Form.Item name="applicationInfo" label="应用信息（Application Info）">
            <Input.TextArea rows={2} maxLength={2000} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="拒绝产品型号"
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