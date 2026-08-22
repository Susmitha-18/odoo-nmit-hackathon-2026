import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem('dayflow_token') || '');
  const [isLoading, setIsLoading] = useState(true);

  // ── Clear everything and go to login ───────────────────────────────────────
  const clearSession = useCallback(() => {
    setToken('');
    setUser(null);
    localStorage.removeItem('dayflow_token');
    localStorage.removeItem('dayflow_user');
  }, []);

  // ── Verify token on mount / token change ───────────────────────────────────
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem('dayflow_token');
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data?.success) {
          // Build user from auth/me + employee sub-document returned by backend
          const u = res.data.user;
          const emp = u.employee || {};
          const userData = {
            id:            u.id || u._id,
            employeeId:    u.employeeId,
            email:         u.email,
            role:          u.role,              // Always uppercase: 'ADMIN' | 'EMPLOYEE'
            fullName:      emp.fullName || u.fullName || u.email,
            department:    emp.department || '',
            designation:   emp.designation || '',
            profilePicture: emp.profilePicture || '',
          };
          setUser(userData);
          setToken(savedToken);
          localStorage.setItem('dayflow_user', JSON.stringify(userData));
        } else {
          clearSession();
        }
      } catch (err) {
        // Token is invalid / expired — clear and force re-login
        console.warn('Session invalid, clearing credentials:', err.response?.status);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (!res.data?.success) {
      throw new Error(res.data?.message || 'Login failed');
    }

    const { token: newToken, user: rawUser } = res.data;
    const userData = {
      id:            rawUser.id || rawUser._id,
      employeeId:    rawUser.employeeId,
      email:         rawUser.email,
      role:          rawUser.role,       // 'ADMIN' | 'EMPLOYEE' — from backend
      fullName:      rawUser.fullName || rawUser.email,
      department:    rawUser.department || '',
      designation:   rawUser.designation || '',
      profilePicture: rawUser.profilePicture || '',
    };

    setToken(newToken);
    setUser(userData);
    localStorage.setItem('dayflow_token', newToken);
    localStorage.setItem('dayflow_user', JSON.stringify(userData));
    return userData;
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    clearSession();
  };

  const value = {
    user,
    token,
    isLoading,
    // Only authenticated if we have BOTH a valid token AND a verified user object
    isAuthenticated: !!token && !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
