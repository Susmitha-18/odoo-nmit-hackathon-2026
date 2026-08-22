import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * - Shows loading spinner while session is being verified
 * - Redirects unauthenticated users to /login (preserves intended path)
 * - Redirects authenticated users who access wrong role portal to their own portal
 */
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Verifying session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve the intended URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Strict role enforcement — compare uppercase from backend
  const requiredRole = role?.toUpperCase();
  if (requiredRole && user?.role !== requiredRole) {
    // Send them to their own portal dashboard
    const redirectTo = user?.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
