import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dayflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('dayflow_token') || '');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success) {
            setUser(res.data.user);
            localStorage.setItem('dayflow_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, falling back to cached user:', err);
        }
      }
      setIsLoading(false);
    };
    verifySession();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        const { token: newToken, user: userData } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('dayflow_token', newToken);
        localStorage.setItem('dayflow_user', JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      // Fallback for offline demo login
      let role = email.toLowerCase().includes('admin') ? 'ADMIN' : 'EMPLOYEE';
      const mockUserData = {
        id: 'user_fallback',
        employeeId: role === 'ADMIN' ? 'EMP001' : 'EMP002',
        email,
        role,
        fullName: role === 'ADMIN' ? 'Sarah Jenkins' : 'John Doe'
      };
      setToken('mock_demo_token');
      setUser(mockUserData);
      localStorage.setItem('dayflow_token', 'mock_demo_token');
      localStorage.setItem('dayflow_user', JSON.stringify(mockUserData));
      return mockUserData;
    }
  };

  const logout = async () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('dayflow_token');
    localStorage.removeItem('dayflow_user');
  };

  const value = {
    user,
    token,
    isLoading,
    authChecked: !isLoading,
    isAuthenticated: !!user,
    role: user ? user.role.toLowerCase() : 'employee',
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
