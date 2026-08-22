import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.api';

const AuthContext = createContext(null);

/**
 * Normalize user object from backend.
 * Backend returns role as 'ADMIN' or 'EMPLOYEE' (uppercase).
 * We normalize to lowercase for consistent UI checks.
 */
function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    role: user.role?.toLowerCase() || 'employee',
    // Map backend 'designation' to 'jobTitle' for UI compatibility
    jobTitle: user.jobTitle || user.designation || '',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('dayflow_token');
    const storedUser = localStorage.getItem('dayflow_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser)); // already normalized when stored
      } catch {
        localStorage.removeItem('dayflow_token');
        localStorage.removeItem('dayflow_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authApi.login(email, password);
    const { token: newToken, user: rawUser } = result;
    const normalized = normalizeUser(rawUser);
    localStorage.setItem('dayflow_token', newToken);
    localStorage.setItem('dayflow_user', JSON.stringify(normalized));
    setToken(newToken);
    setUser(normalized);
    return normalized;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dayflow_token');
    localStorage.removeItem('dayflow_user');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    // Backend sends 'ADMIN' — normalized to lowercase 'admin'
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
