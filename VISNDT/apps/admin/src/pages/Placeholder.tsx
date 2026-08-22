import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

function Placeholder() {
  return (
    <div style={{ textAlign: 'center', paddingTop: 60 }}>
      <Title level={3}>即将上线</Title>
      <Paragraph type="secondary">此页面正在开发中。</Paragraph>
    </div>
  );
}

export default Placeholder;