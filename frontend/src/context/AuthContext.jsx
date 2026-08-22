import React, { createContext, useContext } from 'react';

const AuthContext = createContext(null);

// ── Mock user — no backend required ─────────────────────────────────────────
const MOCK_USER = {
  _id: 'user001',
  email: 'priya.sharma@dayflow.io',
  role: 'employee',
  employeeId: 'EMP-001',
};

export function AuthProvider({ children }) {
  const value = {
    user: MOCK_USER,
    token: 'mock_token',
    isLoading: false,
    authChecked: true,
    isAuthenticated: true,
    role: 'employee',
    login: async () => MOCK_USER,
    logout: async () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
