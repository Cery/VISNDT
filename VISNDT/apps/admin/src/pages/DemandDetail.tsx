import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Spin,
  Alert,
  Button,
  Space,
  Table,
  Empty,
  Typography,
  Modal,
  message,
} from 'antd';
import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { demandService, rfqService } from '../api';
import type { Demand, DemandParameter, DemandMatch } from '../types';
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { StatusTag } from '../components/design-system';
import { BusinessIdentityBadge, WorkflowTimeline, buildDemandTimeline } from '@visndt/design-system';
import { PageHeader } from '../components/common';

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Demand };

const STATUS_LABEL_MAP: Record<string, string> = {
  DRAFT: '草稿',
  PUBLISHED: '已发布',
  SUBMITTED: '已提交',
  PROCESSING: '处理中',
  CLOSED: '已关闭',
  CANCELLED: '已取消',
};

const RFQ_STATUS_LABEL_MAP: Record<string, string> = {
  DRAFT: '草稿',
  OPEN: '开放',
  RESPONDING: '响应中',
  CLOSED: '已关闭',
  CANCELLED: '已取消',
};

const MATCH_SCORE_COLOR = (score: number): string => {
  if (score >= 80) return VISNDT_COLORS.success;
  if (score >= 60) return VISNDT_COLORS.warning;
  return VISNDT_COLORS.error;
};

const PARAM_COLUMNS = [
  {
    title: '名称',
    dataIndex: ['parameterDefinition', 'name'],
    key: 'name',
  },
  {
    title: '代码',
    dataIndex: ['parameterDefinition', 'code'],
    key: 'code',
  },
  {
    title: '值',
    key: 'value',
    render: (_: unknown, record: DemandParameter) => {
      if (record.value !== undefined && record.value !== null) {
        // ENUM 参数展示用户可读 label（后端详情投影已返回 options）
        if (record.parameterDefinition?.dataType === 'ENUM') {
          const option = (record.parameterDefinition.options ?? []).find(
            (o) => o.value === record.value,
          );
          if (option?.label) return option.label;
        }
        return record.value;
      }
      if (record.valueMin !== undefined && record.valueMax !== undefined) {
        return `${record.valueMin} - ${record.valueMax}`;
      }
      if (record.valueMin !== undefined) return `≥ ${record.valueMin}`;
      if (record.valueMax !== undefined) return `≤ ${record.valueMax}`;
      return '-';
    },
  },
  {
    title: '单位',
    dataIndex: ['parameterDefinition', 'unit'],
    key: 'unit',
    width: 100,
    render: (v: string | undefined) => v || '-',
  },
];

export default function DemandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [rematching, setRematching] = useState(false);
  const [generatingRfq, setGeneratingRfq] = useState(false);

  const fetchDemand = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await demandService.getById(id);
      setPageState({ status: 'success', data });
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载需求失败';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  useEffect(() => {
    fetchDemand();
  }, [fetchDemand]);

  const handleRematch = async () => {
    if (!id) return;
    try {
      setRematching(true);
      const { matchService } = await import('../api');
      await matchService.rematch(id);
      message.success('重新匹配成功');
      fetchDemand();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '重新匹配失败';
      message.error(msg);
    } finally {
      setRematching(false);
    }
  };

  const handleGenerateRfq = async () => {
    if (!id) return;
    try {
      setGeneratingRfq(true);
      await rfqService.create({ demandId: id });
      message.success('RFQ已创建成功');
      fetchDemand();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '创建RFQ失败';
      message.error(msg);
    } finally {
      setGeneratingRfq(false);
    }
  };

  const showGenerateRfqConfirm = () => {
    Modal.confirm({
      title: '确认生成RFQ',
      content: '将基于此需求创建RFQ（报价请求），是否继续？',
      okText: '确认生成',
      cancelText: '取消',
      onOk: handleGenerateRfq,
    });
  };

  const showRematchConfirm = () => {
    Modal.confirm({
      title: '确认重新匹配',
      content:
        '这将删除所有现有匹配并重新运行匹配引擎，是否继续？',
      okText: '确认重新匹配',
      cancelText: '取消',
      onOk: handleRematch,
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
        message="加载需求失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={fetchDemand}>重试</Button>
            <Button onClick={() => navigate('/demands')} icon={<ArrowLeftOutlined />}>
              返回列表
            </Button>
          </Space>
        }
      />
    );
  }

  const demand = pageState.data;
  const parameters = demand.parameters;
  const matches = demand.matches;

  const formatQuantity = () => {
    if (demand.quantity === undefined || demand.quantity === null) return '-';
    if (demand.quantityUnit) return `${demand.quantity} ${demand.quantityUnit}`;
    return String(demand.quantity);
  };

  const formatDate = (date: string | undefined) =>
    date ? new Date(date).toLocaleString() : '-';

  const formatContactDisplay = () => {
    if (!demand.contactName && !demand.contactEmail && !demand.contactPhone) return '未设置';
    const parts: string[] = [];
    if (demand.contactName) parts.push(demand.contactName);
    if (demand.contactEmail) parts.push(demand.contactEmail);
    if (demand.contactPhone) parts.push(demand.contactPhone);
    return parts.join(' / ');
  };

  const matchColumns = [
    {
      title: '能力',
      dataIndex: ['product', 'name'],
      key: 'product',
      render: (name: string, record: DemandMatch) => (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() => navigate(`/products/${record.productId}`)}
        >
          {name || '-'}
        </Button>
      ),
    },
    {
      title: '匹配度',
      dataIndex: 'matchScore',
      key: 'score',
      width: 100,
      render: (score: number) => (
        <span style={{ color: MATCH_SCORE_COLOR(score), fontWeight: 600 }}>
          {score}%
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'matchStatus',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <StatusTag status={status} />
      ),
    },
    {
      title: '匹配时间',
      dataIndex: 'matchedAt',
      key: 'matchedAt',
      render: (date: string | undefined) => formatDate(date),
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      render: (_: unknown, record: DemandMatch) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/products/${record.productId}`)}
          >
            查看能力
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() =>
              navigate(`/demands/${id}/matches/${record.id}`)
            }
          >
            匹配详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="需求详情"
        subtitle="买方发布的检测需求"
        extra={
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/demands')}>
            返回列表
          </Button>
        }
      />

      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="业务编号">
            <BusinessIdentityBadge type="DEMAND" id={demand.id} createdAt={demand.createdAt} />
          </Descriptions.Item>
          <Descriptions.Item label="标题">{demand.title}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <StatusTag status={demand.status} label={STATUS_LABEL_MAP[demand.status] || '未知状态'} />
          </Descriptions.Item>
          <Descriptions.Item label="分类">
            {demand.category?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="组织">
            {demand.organization?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建者">
            {demand.createdByUser?.name || demand.createdByUser?.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="联系方式">
            {formatContactDisplay()}
          </Descriptions.Item>
          <Descriptions.Item label="预算范围">
            {demand.budgetRange || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="数量">{formatQuantity()}</Descriptions.Item>
          <Descriptions.Item label="预计交付">
            {formatDate(demand.expectedDeliveryDate)}
          </Descriptions.Item>
          <Descriptions.Item label="关闭原因">
            {demand.closeReason || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {demand.description && (
        <Card title="描述" style={{ marginBottom: 16 }}>
          <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{demand.description}</p>
        </Card>
      )}

      <Card title="参数" style={{ marginBottom: 16 }}>
        {parameters && parameters.length > 0 ? (
          <Table
            dataSource={parameters}
            columns={PARAM_COLUMNS}
            rowKey="id"
            pagination={false}
            size="small"
          />
        ) : (
          <Empty description="暂无参数" />
        )}
      </Card>

      <Card
        title="匹配结果"
        style={{ marginBottom: 16 }}
        extra={
          <Space>
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={fetchDemand}
            >
              刷新
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={showGenerateRfqConfirm}
              loading={generatingRfq}
              disabled={!matches || matches.length === 0}
            >
              生成RFQ
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={showRematchConfirm}
              loading={rematching}
            >
              重新匹配
            </Button>
          </Space>
        }
      >
        {matches && matches.length > 0 ? (
          <Table
            dataSource={matches}
            columns={matchColumns}
            rowKey="id"
            pagination={false}
            size="small"
          />
        ) : (
          <Empty description="暂无匹配" />
        )}
      </Card>

      <Card title="关联RFQ" style={{ marginBottom: 16 }}>
        {demand.rfq ? (
          <Descriptions bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="RFQ状态">
              <StatusTag status={demand.rfq.status} label={RFQ_STATUS_LABEL_MAP[demand.rfq.status] || '未知状态'} />
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {formatDate(demand.rfq.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="操作">
              <Button
                type="primary"
                size="small"
                onClick={() => navigate(`/rfqs/${demand.rfq!.id}`)}
              >
                查看RFQ详情
              </Button>
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Empty description="暂无关联RFQ" />
        )}
      </Card>

      <Card title="时间线" style={{ marginBottom: 16 }}>
        <WorkflowTimeline
          title="业务流转"
          steps={buildDemandTimeline(demand.status, {
            createdAt: demand.createdAt,
            publishedAt: demand.publishedAt,
            closedAt: demand.closedAt,
          })}
        />
        <Descriptions bordered column={{ xs: 1, sm: 2 }} style={{ marginTop: 16 }}>
          <Descriptions.Item label="创建时间">
            {formatDate(demand.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {formatDate(demand.updatedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="发布时间">
            {formatDate(demand.publishedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="关闭时间">
            {formatDate(demand.closedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/demands')}>
        返回列表
      </Button>
    </div>
  );
}