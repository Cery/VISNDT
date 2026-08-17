import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Select, Space, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { knowledgeService, type KnowledgeCategory, type KnowledgeDomain } from '../../api/knowledge.service';

const { Title } = Typography;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: KnowledgeCategory[] };

export default function KnowledgeCategoryList() {
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>({ status: 'loading' });
  const [domains, setDomains] = useState<KnowledgeDomain[]>([]);
  const [filterDomainId, setFilterDomainId] = useState<string | undefined>();

  const fetchCategories = async () => {
    setState({ status: 'loading' });
    try {
      const [data, domainData] = await Promise.all([
        knowledgeService.getCategories(filterDomainId),
        knowledgeService.getDomains(),
      ]);
      setDomains(domainData);
      setState({ status: 'success', data });
    } catch {
      setState({ status: 'error', message: '加载知识分类列表失败' });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [filterDomainId]);

  const handleDelete = async (id: string) => {
    try {
      await knowledgeService.deleteCategory(id);
      message.success('知识分类已删除');
      fetchCategories();
    } catch (e: any) {
      message.error(e?.response?.data?.message || '删除知识分类失败');
    }
  };

  const columns: ColumnsType<KnowledgeCategory> = [
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
      title: '所属领域',
      dataIndex: 'domain',
      key: 'domain',
      width: 150,
      render: (domain: KnowledgeCategory['domain']) => domain?.name || '-',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc: string | null) => desc || '-',
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
            onClick={() => navigate(`/knowledge/categories/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除此分类？"
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
          <Title level={4} style={{ margin: 0 }}>知识分类管理</Title>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            知识分类是知识领域下的二级分类（如：超声探伤原理、仪器操作规范），用于给知识条目进行精细归类
          </Typography.Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchCategories}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/knowledge/categories/create')}>
            新建分类
          </Button>
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="按领域筛选"
          style={{ width: 240 }}
          value={filterDomainId}
          onChange={setFilterDomainId}
          options={domains.map((d) => ({ label: d.name, value: d.id }))}
        />
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