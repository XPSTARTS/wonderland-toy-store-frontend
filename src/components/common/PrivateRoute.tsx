import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

interface PrivateRouteProps {
  adminOnly?: boolean;
}

export default function PrivateRoute({ adminOnly = false }: PrivateRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}