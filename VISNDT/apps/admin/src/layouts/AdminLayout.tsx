import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Breadcrumb, Dropdown, Avatar, Badge, Space, Drawer, Tag } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
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
  LogoutOutlined,
  PictureOutlined,
  HomeOutlined,
  MenuOutlined,
  BarChartOutlined,
  RiseOutlined,
  MonitorOutlined,
  GlobalOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  TeamOutlined,
  ExperimentOutlined,
  BookOutlined,
  FundOutlined,
} from '@ant-design/icons';
import { authStore } from '../stores/auth.store';

const { Header, Sider, Content } = Layout;

// ============================================
// Sectioned Menu Configuration
// ============================================
type MenuGroup = 'core' | 'business' | 'system';

const menuGroups: Record<MenuGroup, { label: string; items: MenuProps['items'] }> = {
  core: {
    label: '核心运营',
    items: [
      { key: '/home', icon: <DashboardOutlined />, label: '运营仪表盘' },
      { key: '/operation-center', icon: <FundOutlined />, label: '运营中心' },
      { key: '/analytics', icon: <BarChartOutlined />, label: '数据分析' },
      { key: '/business-analytics', icon: <RiseOutlined />, label: '业务分析' },
      { key: '/monitoring', icon: <MonitorOutlined />, label: '运营监控' },
      { key: '/audit-intelligence', icon: <SafetyOutlined />, label: '审计智能' },
      { key: '/products', icon: <AppstoreOutlined />, label: '产品管理' },
      { key: '/content', icon: <FileTextOutlined />, label: '内容管理' },
      { key: '/content/tags', icon: <TagsOutlined />, label: '标签管理' },
      { key: '/knowledge/domains', icon: <BookOutlined />, label: '知识分类' },
      { key: '/knowledge/entries', icon: <FileTextOutlined />, label: '知识条目' },
      { key: '/media', icon: <PictureOutlined />, label: '媒体中心' },
    ],
  },
  business: {
    label: '商业运营',
    items: [
      { key: '/inquiries', icon: <MailOutlined />, label: '询价管理' },
      { key: '/demands', icon: <FileTextOutlined />, label: '需求管理' },
      { key: '/rfqs', icon: <SnippetsOutlined />, label: 'RFQ管理' },
      { key: '/offers', icon: <TagsOutlined />, label: '报价管理' },
      { key: '/matching', icon: <NodeIndexOutlined />, label: '匹配管理' },
    ],
  },
  system: {
    label: '系统管理',
    items: [
      { key: '/users', icon: <TeamOutlined />, label: '用户管理' },
      { key: '/organizations', icon: <BankOutlined />, label: '组织管理' },
      {
        key: 'parameters',
        icon: <SettingOutlined />,
        label: '参数管理',
        children: [
          { key: '/parameter-groups', label: '参数组' },
          { key: '/parameter-definitions', label: '参数定义' },
          { key: '/product-categories', label: '分类管理' },
          { key: '/product-category-knowledge-mappings', label: '知识分类映射' },
        ],
      },
      { key: '/notifications', icon: <BellOutlined />, label: '通知管理' },
      { key: '/audit-logs', icon: <AuditOutlined />, label: '审计日志' },
      { key: '/embedding', icon: <ExperimentOutlined />, label: 'AI 数据准备' },
    ],
  },
};

// Breadcrumb route mapping
const breadcrumbMap: Record<string, string> = {
  '/home': '运营仪表盘',
  '/operation-center': '运营中心',
  '/analytics': '数据分析',
  '/business-analytics': '业务分析',
  '/monitoring': '运营监控',
  '/audit-intelligence': '审计智能',
  '/products': '产品管理',
  '/content': '内容管理',
  '/content/tags': '标签管理',
  '/inquiries': '询价管理',
  '/demands': '需求管理',
  '/rfqs': 'RFQ管理',
  '/offers': '报价管理',
  '/matching': '匹配管理',
  '/users': '用户管理',
  '/organizations': '组织管理',
  '/parameter-groups': '参数组',
  '/parameter-definitions': '参数定义',
  '/product-categories': '分类管理',
  '/notifications': '通知管理',
  '/audit-logs': '审计日志',
  '/media': '媒体中心',
  '/embedding': 'AI 数据准备',
  '/knowledge/domains': '知识分类',
  '/knowledge/categories': '知识分类',
};

// Build flat menu items from groups
const allMenuItems: MenuProps['items'] = (Object.entries(menuGroups) as [MenuGroup, typeof menuGroups[MenuGroup]][]).flatMap(
  ([groupKey, group]) => [
    { type: 'group' as const, label: group.label, key: `group-${groupKey}` },
    ...(group.items ?? []),
  ],
);

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>(['parameters']);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authStore((s) => s.user);
  const clearAuth = authStore((s) => s.clearAuth);
  const isProd = import.meta.env.PROD;

  // Responsive detection
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Auto-collapse on tablet
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    }
  }, []);

  const handleLogout = useCallback(() => {
    clearAuth();
    navigate('/login');
  }, [clearAuth, navigate]);

  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      navigate(key);
      if (isMobile) setMobileDrawerOpen(false);
    },
    [navigate, isMobile],
  );

  // Breadcrumb generation
  const pathSnippets = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = [
    {
      title: (
        <span>
          <HomeOutlined style={{ marginRight: 4 }} />
          首页
        </span>
      ),
      key: 'home',
    },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const label = breadcrumbMap[url];
      if (!label) return null;
      return { title: label, key: url };
    }).filter(Boolean),
  ];

  // User dropdown
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 600 }}>{user?.name || user?.email}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{user?.role || 'ADMIN'}</div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'visit-site',
      icon: <GlobalOutlined />,
      label: '访问网站',
      onClick: () => window.open('/', '_blank'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: handleLogout,
    },
  ];

  const renderSiderMenu = () => (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      openKeys={collapsed ? [] : openKeys}
      onOpenChange={(keys) => setOpenKeys(keys)}
      items={allMenuItems}
      onClick={handleMenuClick}
    />
  );

  return (
    <Layout className="admin-layout" style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="dark"
          width={220}
          breakpoint="lg"
          onBreakpoint={(broken) => {
            if (broken) setCollapsed(true);
          }}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              padding: collapsed ? '0 8px' : '0 16px',
            }}
          >
            <span style={{
              fontSize: collapsed ? 14 : 20,
              fontWeight: 800,
              fontFamily: 'ui-monospace, monospace',
              letterSpacing: '0.02em',
              background: 'linear-gradient(135deg, #2563eb, #0891b2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {collapsed ? 'V' : 'VISNDT'}
            </span>
            {!collapsed && (
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                工业运营中心
              </span>
            )}
          </div>
          {renderSiderMenu()}
        </Sider>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <>
          {mobileDrawerOpen && (
            <div
              className="admin-mobile-overlay"
              onClick={() => setMobileDrawerOpen(false)}
            />
          )}
          <Drawer
            placement="left"
            width={220}
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            styles={{ body: { padding: 0 } }}
            title="VISNDT"
            closable
          >
            {renderSiderMenu()}
          </Drawer>
        </>
      )}

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
            height: 56,
            lineHeight: '56px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileDrawerOpen(true)}
                style={{ fontSize: 16, width: 40, height: 40 }}
              />
            ) : (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: 16, width: 40, height: 40 }}
              />
            )}
            <span className="admin-header-title" style={{ fontSize: 16, fontWeight: 600, whiteSpace: 'nowrap' }}>
              VISNDT 工业运营中心
            </span>
            <span className="admin-header-title" style={{ fontSize: 12, color: '#999', marginLeft: 8, borderLeft: '1px solid #e8e8e8', paddingLeft: 8 }}>
              工业检测能力发现平台
            </span>
            <Tag
              className="admin-header-title"
              color={isProd ? 'success' : 'processing'}
              style={{ marginLeft: 8, fontSize: 12 }}
            >
              {isProd ? '生产环境' : '开发环境'}
            </Tag>
          </div>

          <Space size={16}>
            <Badge count={0} size="small">
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: 18 }} />}
                onClick={() => navigate('/notifications')}
              />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#2563eb' }}
                />
                <span className="admin-header-title" style={{ fontSize: 14 }}>
                  {user?.name || user?.email || '管理员'}
                </span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Breadcrumb */}
        <div style={{ padding: '8px 24px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
          <Breadcrumb items={breadcrumbItems as { title: React.ReactNode; key?: string }[]} />
        </div>

        <Content
          style={{
            margin: 16,
            padding: 20,
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