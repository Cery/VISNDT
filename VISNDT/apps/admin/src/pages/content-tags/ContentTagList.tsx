import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Tag, Space, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { contentTagService } from '../../api/content-tag.service';
import type { ContentTag, ContentTagType } from '../../types';

const { Title } = Typography;

const TAG_TYPE_LABEL: Record<ContentTagType, string> = {
  TOPIC: '主题',
  INDUSTRY: '行业',
  APPLICATION: '应用',
  TECHNOLOGY: '技术',
};

const TAG_TYPE_COLOR: Record<ContentTagType, string> = {
  TOPIC: 'blue',
  INDUSTRY: 'green',
  APPLICATION: 'orange',
  TECHNOLOGY: 'purple',
};

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: ContentTag[] };

export default function ContentTagList() {
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>({ status: 'loading' });

  const fetchTags = async () => {
    setState({ status: 'loading' });
    try {
      const data = await contentTagService.getList();
      setState({ status: 'success', data });
    } catch {
      setState({ status: 'error', message: '加载标签列表失败' });
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await contentTagService.delete(id);
      message.success('标签已删除');
      fetchTags();
    } catch {
      message.error('删除标签失败');
    }
  };

  const columns: ColumnsType<ContentTag> = [
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
      title: '分类',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: ContentTagType) => (
        <Tag color={TAG_TYPE_COLOR[type]}>{TAG_TYPE_LABEL[type]}</Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc: string | null) => desc || '-',
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
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/content/tags/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除此标签？"
            description="删除后所有关联内容将失去此标签"
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
        <Title level={4} style={{ margin: 0 }}>内容标签管理</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchTags}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/content/tags/create')}>
            新建标签
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
          pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
        />
      )}
    </div>
  );
}