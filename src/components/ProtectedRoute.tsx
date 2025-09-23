import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = false,
  redirectTo = '/login'
}) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated and trying to access login page
  if (!requireAuth && isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/marketplace" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;