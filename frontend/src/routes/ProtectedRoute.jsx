import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/ui/States';

/**
 * ProtectedRoute — Enforces JWT presence and checks role permissions.
 * Redirects unauthorized requests to /login or role-appropriate root.
 */
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Verifying session authorizations..." fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Enforce server-matched role checking (ADMIN vs EMPLOYEE uppercase comparison)
  if (role && user?.role !== role.toUpperCase()) {
    console.warn(`Unauthorized role access attempt: user role ${user?.role} does not match required role ${role}`);
    return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard'} replace />;
  }

  return children;
}
