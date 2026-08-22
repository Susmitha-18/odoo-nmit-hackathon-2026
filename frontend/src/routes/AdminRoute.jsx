import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingState from '../components/ui/LoadingState';

/**
 * Allows ONLY admin/hr role.
 * Employees are redirected to /unauthorized — NOT to /login.
 * This enforces frontend role-based routing on top of backend RBAC.
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingState fullScreen message="Verifying permissions..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/unauthorized" replace />;
  return children;
}
