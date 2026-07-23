import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

function Placeholder() {
  return (
    <div style={{ textAlign: 'center', paddingTop: 60 }}>
      <Title level={3}>Coming Soon</Title>
      <Paragraph type="secondary">This page is under development.</Paragraph>
    </div>
  );
}

export default Placeholder;