import { Card, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DashboardResponse } from '../../types/analytics.types';

interface Props {
  data: DashboardResponse['topContent'];
}

export default function TopContentTable({ data }: Props) {
  const columns: ColumnsType<DashboardResponse['topContent'][0]> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: '内容标题',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '浏览量',
      dataIndex: 'views',
      key: 'views',
      width: 100,
      sorter: (a, b) => a.views - b.views,
      defaultSortOrder: 'descend',
    },
  ];

  return (
    <Card title="热门内容 Top 10">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        size="small"
        locale={{ emptyText: '暂无数据' }}
      />
    </Card>
  );
}