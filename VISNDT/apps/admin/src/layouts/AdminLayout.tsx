import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  NodeIndexOutlined,
  UserOutlined,
  BankOutlined,
  BellOutlined,
  SnippetsOutlined,
  TagsOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  MailOutlined,
  AuditOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/home', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/products', icon: <ShoppingOutlined />, label: '产品管理' },
  { key: '/demands', icon: <FileTextOutlined />, label: '需求管理' },
  { key: '/rfqs', icon: <SnippetsOutlined />, label: 'RFQ管理' },
  { key: '/offers', icon: <TagsOutlined />, label: '报价管理' },
  { key: '/inquiries', icon: <MailOutlined />, label: '询价管理' },
  { key: '/matching', icon: <NodeIndexOutlined />, label: '匹配管理' },
  { key: '/users', icon: <UserOutlined />, label: '用户管理' },
  { key: '/organizations', icon: <BankOutlined />, label: '组织管理' },
  {
    key: 'parameters',
    icon: <SettingOutlined />,
    label: '参数管理',
    children: [
      { key: '/parameter-groups', label: '参数组' },
      { key: '/parameter-definitions', label: '参数定义' },
      { key: '/product-categories', label: '分类管理' },
    ],
  },
  { key: '/notifications', icon: <BellOutlined />, label: '通知管理' },
  { key: '/audit-logs', icon: <AuditOutlined />, label: '审计日志' },
  { key: '/content', icon: <FileTextOutlined />, label: '内容管理' },
];

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>(['parameters']);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: collapsed ? 14 : 18,
            fontWeight: 700,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {collapsed ? 'V' : 'VISNDT'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 48, height: 48 }}
          />
          <span style={{ marginLeft: 12, fontSize: 16, fontWeight: 600 }}>
            VISNDT 管理后台
          </span>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: '#fff',
            borderRadius: 8,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;