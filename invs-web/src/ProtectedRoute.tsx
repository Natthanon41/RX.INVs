import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function ProtectedRoute() {
  const { token, loading } = useAuth();

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>กำลังโหลด...</div>;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
