import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { knowledgeService, type KnowledgeDomain } from '../../api/knowledge.service';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: KnowledgeDomain[] };

export default function KnowledgeDomainList() {
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>({ status: 'loading' });

  const fetchDomains = async () => {
    setState({ status: 'loading' });
    try {
      const data = await knowledgeService.getDomains();
      setState({ status: 'success', data });
    } catch {
      setState({ status: 'error', message: '加载知识领域列表失败' });
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await knowledgeService.deleteDomain(id);
      message.success('知识领域已删除');
      fetchDomains();
    } catch (e: any) {
      message.error(e?.response?.data?.message || '删除知识领域失败');
    }
  };

  const columns: ColumnsType<KnowledgeDomain> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 200,
      render: (slug: string) => <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">{slug}</code>,
    },
    {
      title: '父领域',
      dataIndex: 'parent',
      key: 'parent',
      width: 150,
      render: (parent: KnowledgeDomain['parent']) => parent?.name || '-',
    },
    {
      title: '子领域数',
      dataIndex: 'children',
      key: 'children',
      width: 100,
      render: (children: KnowledgeDomain['children']) => children?.length || 0,
    },
    {
      title: '分类数',
      key: 'categoryCount',
      width: 100,
      render: (_, record) => record._count?.categories || 0,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (val: string) => new Date(val).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/knowledge/domains/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除此领域？"
            description="删除前请确保领域下无子领域和分类"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>知识领域管理</Title>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            知识领域是知识体系的最顶层分类（如：超声检测、射线检测），每个领域下可包含多个知识分类
          </Typography.Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchDomains}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/knowledge/domains/create')}>
            新建领域
          </Button>
        </Space>
      </div>

      {state.status === 'loading' && <Table loading columns={columns} dataSource={[]} rowKey="id" />}
      {state.status === 'error' && (
        <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>{state.message}</div>
      )}
      {state.status === 'success' && (
        <Table
          columns={columns}
          dataSource={state.data}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
        />
      )}
    </div>
  );
}