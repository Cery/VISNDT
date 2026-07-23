import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', paddingTop: 80, fontFamily: 'system-ui, sans-serif' }}>
      <h1>404</h1>
      <p>Page Not Found</p>
      <Link to="/home">Back to Home</Link>
    </div>
  );
}

export default NotFound;