import { Typography, Card, Row, Col, Space, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  PictureOutlined,
  FileTextOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { VISNDT_COLORS } from '../components/design-system/tokens';

const { Title, Text, Paragraph } = Typography;

const MEDIA_ENTRIES = [
  {
    title: '产品媒体',
    description: '管理产品图片、证书、文档等附件，是产品详情展示的核心媒体资源',
    icon: <PictureOutlined style={{ fontSize: 32, color: '#2563eb' }} />,
    path: '/products',
    hint: '进入产品管理 → 选择产品 → 媒体管理',
  },
  {
    title: '内容媒体',
    description: '文章、知识、解决方案等内容中嵌入的图片和附件',
    icon: <FileTextOutlined style={{ fontSize: 32, color: VISNDT_COLORS.success }} />,
    path: '/content',
    hint: '进入内容管理 → 编辑内容 → 上传媒体',
  },
  {
    title: '孤立文件清理',
    description: '查看和清理没有关联到任何产品/内容的孤立文件，释放存储空间',
    icon: <WarningOutlined style={{ fontSize: 32, color: VISNDT_COLORS.warning }} />,
    path: '/files/orphans',
    hint: '进入孤立文件管理 → 批量清理',
  },
];

export default function MediaList() {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ width: 4, height: 20, borderRadius: 2, background: '#2563eb' }} />
        <Title level={4} style={{ margin: 0 }}>
          媒体中心
        </Title>
      </div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16, marginLeft: 12, fontSize: 13 }}>
        统一管理平台所有上传的媒体文件。媒体文件按所属实体（产品、内容等）分散管理，请通过下方入口进入对应模块
      </Text>

      <Alert
        type="info"
        message="媒体中心说明"
        description="平台媒体文件采用分散管理模式 — 产品图片归属于产品管理模块，内容插图归属于内容管理模块。媒体中心提供统一的入口导航，方便快速定位。"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]}>
        {MEDIA_ENTRIES.map((entry) => (
          <Col key={entry.path} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              onClick={() => navigate(entry.path)}
              style={{ height: '100%', cursor: 'pointer' }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>{entry.icon}</div>
                <div>
                  <Title level={5} style={{ margin: 0, textAlign: 'center' }}>
                    {entry.title}
                  </Title>
                  <Paragraph
                    type="secondary"
                    style={{ textAlign: 'center', margin: '8px 0 0', fontSize: 13 }}
                  >
                    {entry.description}
                  </Paragraph>
                  <Text
                    type="secondary"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      marginTop: 8,
                      fontSize: 12,
                      fontStyle: 'italic',
                    }}
                  >
                    {entry.hint}
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}