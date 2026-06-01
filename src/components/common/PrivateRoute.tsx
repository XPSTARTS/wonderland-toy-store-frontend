// components/common/PrivateRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

interface PrivateRouteProps {
  adminOnly?: boolean;
}

const PrivateRoute = ({ adminOnly = false }: PrivateRouteProps) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  
  if (!isAuthenticated) {
    // Save the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;