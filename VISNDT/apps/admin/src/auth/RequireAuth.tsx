import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from 'zustand';
import { authStore } from '../stores/auth.store';

interface RequireAuthProps {
  children: ReactNode;
}

function RequireAuth({ children }: RequireAuthProps) {
  const isAuthenticated = useStore(authStore, (s) => s.isAuthenticated);
  const checkTokenExpiry = useStore(authStore, (s) => s.checkTokenExpiry);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      checkTokenExpiry();
    }
  }, [isAuthenticated, checkTokenExpiry]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

export default RequireAuth;