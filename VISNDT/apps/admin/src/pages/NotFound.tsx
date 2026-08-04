import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', paddingTop: 80, fontFamily: 'system-ui, sans-serif' }}>
      <h1>404</h1>
      <p>页面未找到</p>
      <Link to="/home">返回首页</Link>
    </div>
  );
}

export default NotFound;