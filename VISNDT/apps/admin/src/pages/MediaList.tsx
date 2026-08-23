import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Alert,
  Tag,
  Typography,
  Space,
  Select,
  Input,
  message,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { fileAssetService } from '../api/file-asset.service';
import { organizationService } from '../api/organization.service';
import type { FileAssetListItem } from '../types/file-asset.types';
import type { Organization } from '../types/organization.types';
import { getFileTypeIcon, formatFileSize } from '../utils/file-utils';
import { VISNDT_COLORS } from '../components/design-system/tokens';
import {
  BusinessIdentityBadge,
  MediaGovernanceBadge,
  MediaFileCard,
  RuleResultDisplay,
  deriveMediaGovernanceState,
} from '@visndt/design-system';
import type { MediaGovernanceState } from '@visndt/design-system';
import { mediaCompletenessRule } from '@visndt/rule-engine-contract';

const { Title, Text } = Typography;

const FILE_TYPE_COLOR: Record<string, string> = {
  IMAGE: 'blue',
  DOCUMENT: 'green',
  CERTIFICATE: 'gold',
  SPEC_SHEET: 'purple',
  ILLUSTRATION: 'cyan',
  OTHER: 'default',
};

const FILE_TYPE_LABEL: Record<string, string> = {
  IMAGE: '图片',
  DOCUMENT: '文档',
  CERTIFICATE: '资质证书',
  SPEC_SHEET: '规格书',
  ILLUSTRATION: '插图',
  OTHER: '其他',
};

const FILE_STATUS_LABEL: Record<string, string> = {
  DRAFT: '草稿',
  ACTIVE: '在用',
  ARCHIVED: '已归档',
};

const FILE_STATUS_COLOR: Record<string, string> = {
  DRAFT: 'orange',
  ACTIVE: 'green',
  ARCHIVED: 'default',
};

const ENTITY_TYPE_LABEL: Record<string, string> = {
  PRODUCT: '产品',
  SUPPLIER_PRODUCT: '供应商型号',
  ORGANIZATION: '组织',
  DEMAND: '需求',
  RFQ: 'RFQ',
  RFQ_RESPONSE: 'RFQ 应答',
  CONTENT: '内容',
};

const FILE_TYPE_OPTIONS = [
  { value: '', label: '全部类型' },
  { value: 'IMAGE', label: '图片' },
  { value: 'DOCUMENT', label: '文档' },
  { value: 'CERTIFICATE', label: '资质证书' },
  { value: 'SPEC_SHEET', label: '规格书' },
  { value: 'ILLUSTRATION', label: '插图' },
  { value: 'OTHER', label: '其他' },
];

const ENTITY_TYPE_OPTIONS = [
  { value: '', label: '全部实体' },
  { value: 'PRODUCT', label: '产品' },
  { value: 'SUPPLIER_PRODUCT', label: '供应商型号' },
  { value: 'ORGANIZATION', label: '组织' },
  { value: 'DEMAND', label: '需求' },
  { value: 'RFQ', label: 'RFQ' },
  { value: 'RFQ_RESPONSE', label: 'RFQ 应答' },
  { value: 'CONTENT', label: '内容' },
];

const GOVERNANCE_ORDER: MediaGovernanceState[] = ['active', 'unused', 'incomplete', 'legacy'];
const GOVERNANCE_LABEL: Record<MediaGovernanceState, string> = {
  active: '正常引用',
  unused: '未引用',
  incomplete: '缺少信息',
  legacy: '历史资源',
};

/** 由既有 FileAsset 列表字段确定性推导治理展示状态（纯展示，不写库） */
function governanceStateOf(r: FileAssetListItem): MediaGovernanceState {
  return deriveMediaGovernanceState({
    status: r.status,
    deletedAt: r.deletedAt,
    fileName: r.fileName,
    mimeType: r.mimeType,
    fileSize: r.fileSize,
    productRefCount: r.productMediaCount,
    contentRefCount: r.contentMediaCount,
  });
}

interface QueryParams {
  page: number;
  pageSize: number;
  fileType?: string;
  entityType?: string;
  organizationId?: string;
  search?: string;
}

function MediaList() {
  const navigate = useNavigate();
  const [query, setQuery] = useState<QueryParams>({ page: 1, pageSize: 20 });
  const [items, setItems] = useState<FileAssetListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  /** 当前页治理状态汇总（页面级展示提示） */
  const governanceCounts = useMemo(() => {
    const counts: Record<MediaGovernanceState, number> = {
      active: 0,
      unused: 0,
      incomplete: 0,
      legacy: 0,
    };
    for (const it of items) counts[governanceStateOf(it)] += 1;
    return counts;
  }, [items]);

  /** 当前页媒体完整性评估（L0 确定性规则，只读，不自动修复） */
  const completenessResults = useMemo(
    () =>
      items.map((it) =>
        mediaCompletenessRule.evaluate({
          trigger: 'ON_DEMAND',
          data: {
            fileName: it.fileName,
            mimeType: it.mimeType,
            fileSize: it.fileSize,
            referenced: it.productMediaCount + it.contentMediaCount > 0,
            deletedAt: it.deletedAt,
          },
        }),
      ),
    [items],
  );
  const completenessPass = completenessResults.filter((r) => r.passed).length;

  /** 行展开：媒体资产治理详情（Identity + FileInfo + Usage + Lifecycle + Hint） */
  const expandedRowRender = (r: FileAssetListItem) => (
    <div style={{ padding: '4px 0 12px' }}>
      <MediaFileCard
        assetId={r.id}
        status={r.status}
        deletedAt={r.deletedAt}
        fileName={r.fileName}
        mimeType={r.mimeType}
        fileSize={r.fileSize}
        productRefCount={r.productMediaCount}
        contentRefCount={r.contentMediaCount}
        entityLabel={ENTITY_TYPE_LABEL[r.entityType] || r.entityType}
        organizationName={r.organizationName}
        uploaderName={r.uploaderName || r.uploaderEmail}
        createdAt={r.createdAt}
        updatedAt={r.updatedAt}
      />
    </div>
  );

  const orgOptions = useMemo(
    () => [
      { value: '', label: '全部组织' },
      ...organizations.map((o) => ({ value: o.id, label: o.name })),
    ],
    [organizations],
  );

  const loadOrganizations = useCallback(async () => {
    try {
      const result = await organizationService.getList({ page: 1, pageSize: 1000 });
      setOrganizations(result.data ?? []);
    } catch {
      // 组织下拉加载失败不影响主列表
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fileAssetService.getFiles({
        page: query.page,
        pageSize: query.pageSize,
        fileType: query.fileType || undefined,
        entityType: query.entityType || undefined,
        organizationId: query.organizationId || undefined,
        search: query.search || undefined,
      });
      setItems(result.items ?? []);
      setTotal(result.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载媒体列表失败');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setQuery((prev) => ({
      ...prev,
      page: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? 20,
    }));
  };

  const handleReset = () => {
    setQuery({ page: 1, pageSize: query.pageSize });
  };

  const handleDownload = async (record: FileAssetListItem) => {
    try {
      const url = await fileAssetService.getSignedUrl(record.id);
      const link = document.createElement('a');
      link.href = url;
      link.download = record.fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      message.error('文件下载失败');
    }
  };

  const columns: ColumnsType<FileAssetListItem> = [
    {
      title: '文件',
      dataIndex: 'fileName',
      key: 'fileName',
      width: 260,
      fixed: 'left',
      render: (name: string, record: FileAssetListItem) => (
        <Space>
          {getFileTypeIcon(record.fileType)}
          <Text style={{ wordBreak: 'break-all' }}>{name}</Text>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'fileType',
      key: 'fileType',
      width: 110,
      render: (type: string) => (
        <Tag color={FILE_TYPE_COLOR[type] || 'default'}>
          {FILE_TYPE_LABEL[type] || type}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={FILE_STATUS_COLOR[status] || 'default'}>
          {FILE_STATUS_LABEL[status] || status}
        </Tag>
      ),
    },
    {
      title: '治理',
      key: 'governance',
      width: 120,
      render: (_: unknown, record: FileAssetListItem) => (
        <MediaGovernanceBadge state={governanceStateOf(record)} />
      ),
    },
    {
      title: '所属实体',
      dataIndex: 'entityType',
      key: 'entityType',
      width: 110,
      render: (type: string) => ENTITY_TYPE_LABEL[type] || type,
    },
    {
      title: '所属组织',
      dataIndex: 'organizationName',
      key: 'organizationName',
      width: 180,
      ellipsis: true,
      render: (name: string | null) =>
        name ? (
          name
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>
            未分配
          </Text>
        ),
    },
    {
      title: '上传者',
      dataIndex: 'uploaderName',
      key: 'uploaderName',
      width: 150,
      ellipsis: true,
      render: (name: string | null, record: FileAssetListItem) =>
        name || record.uploaderEmail,
    },
    {
      title: '引用',
      key: 'usage',
      width: 140,
      render: (_: unknown, record: FileAssetListItem) => {
        const product = record.productMediaCount ?? 0;
        const content = record.contentMediaCount ?? 0;
        if (product === 0 && content === 0) {
          return <Text type="secondary">无引用</Text>;
        }
        const parts: string[] = [];
        if (product > 0) parts.push(`产品 ${product}`);
        if (content > 0) parts.push(`内容 ${content}`);
        return parts.join(' / ');
      },
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 100,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '资产编号',
      key: 'assetIdentity',
      width: 210,
      render: (_: unknown, record: FileAssetListItem) => (
        <BusinessIdentityBadge
          type="ASSET"
          id={record.id}
          createdAt={record.createdAt}
          variant="tag"
          label
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_: unknown, record: FileAssetListItem) => (
        <Button
          type="link"
          size="small"
          icon={<DownloadOutlined />}
          onClick={() => handleDownload(record)}
        >
          下载
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: VISNDT_COLORS.primary }} />
          <Title level={4} style={{ margin: 0 }}>
            媒体中心
          </Title>
        </div>
        <Alert
          type="error"
          message="加载媒体列表失败"
          description={error}
          showIcon
          action={
            <Button type="primary" onClick={fetchData}>
              重试
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: VISNDT_COLORS.primary }} />
          <Title level={4} style={{ margin: 0 }}>
            媒体中心
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            统一管理平台所有上传的文件资产，按类型 / 实体 / 组织分开浏览
          </Text>
        </div>
        <Button icon={<DeleteOutlined />} onClick={() => navigate('/files/orphans')}>
          孤立文件清理
        </Button>
      </div>

      <Space
        wrap
        style={{ marginBottom: 16 }}
        size={12}
      >
        <Input.Search
          placeholder="搜索文件名..."
          allowClear
          value={query.search}
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, search: e.target.value, page: 1 }))
          }
          onSearch={(value) =>
            setQuery((prev) => ({ ...prev, search: value, page: 1 }))
          }
          prefix={<SearchOutlined />}
          style={{ width: 220 }}
        />
        <Select
          placeholder="文件类型"
          allowClear
          value={query.fileType || undefined}
          onChange={(value) =>
            setQuery((prev) => ({ ...prev, fileType: value || undefined, page: 1 }))
          }
          options={FILE_TYPE_OPTIONS}
          style={{ width: 140 }}
        />
        <Select
          placeholder="所属实体"
          allowClear
          value={query.entityType || undefined}
          onChange={(value) =>
            setQuery((prev) => ({ ...prev, entityType: value || undefined, page: 1 }))
          }
          options={ENTITY_TYPE_OPTIONS}
          style={{ width: 140 }}
        />
        <Select
          placeholder="所属组织"
          allowClear
          showSearch
          optionFilterProp="label"
          value={query.organizationId || undefined}
          onChange={(value) =>
            setQuery((prev) => ({ ...prev, organizationId: value || undefined, page: 1 }))
          }
          options={orgOptions}
          style={{ width: 200 }}
        />
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          重置
        </Button>
        <Button onClick={fetchData}>刷新</Button>
      </Space>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {GOVERNANCE_ORDER.map((g) => (
          <div
            key={g}
            style={{
              background: VISNDT_COLORS.layoutBg,
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 13, color: '#475569' }}>{GOVERNANCE_LABEL[g]}</span>
            <MediaGovernanceBadge state={g} label={`${governanceCounts[g]}`} variant="badge" />
          </div>
        ))}
      </div>
      {items.length > 0 && (
        <>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
            「治理」列与行展开为媒体资产治理视图（Asset Identity + File Info + Usage Reference + Lifecycle + Governance Hint）——当前页 {items.length} 项，仅展示，不触发删除/迁移。
          </Text>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              background: VISNDT_COLORS.layoutBg,
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>
              媒体完整性（L0 规则 · 只读评估）
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              当前页 {items.length} 项，通过 {completenessPass} 项
            </Text>
          </div>
          {(() => {
            const firstIssue = completenessResults.find((r) => !r.passed);
            return firstIssue ? (
              <div
                style={{
                  background: VISNDT_COLORS.layoutBg,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '10px 14px',
                  marginBottom: 8,
                }}
              >
                <RuleResultDisplay result={firstIssue} />
              </div>
            ) : null;
          })()}
        </>
      )}

      <Table<FileAssetListItem>
        rowKey="id"
        columns={columns}
        dataSource={items}
        loading={loading}
        onChange={handleTableChange}
        expandable={{ expandedRowRender, rowExpandable: () => true }}
        pagination={{
          current: query.page,
          pageSize: query.pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 个文件`,
        }}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: '暂无媒体文件' }}
      />
    </div>
  );
}

export default MediaList;