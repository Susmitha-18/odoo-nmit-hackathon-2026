import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAPI, registerAPI, getMeAPI } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dayflow_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const storedToken = localStorage.getItem('dayflow_token');
      if (storedToken) {
        try {
          const data = await getMeAPI();
          if (data.success && data.user) {
            // Build full user profile
            const employee = data.user.employee || {};
            setUser({
              id: data.user.id,
              employeeId: data.user.employeeId,
              email: data.user.email,
              role: data.user.role,
              fullName: employee.fullName || '',
              department: employee.department || '',
              designation: employee.designation || '',
              profilePicture: employee.profilePicture || '',
              address: employee.address || '',
              phone: employee.phone || '',
              joiningDate: employee.joiningDate || '',
            });
          } else {
            logout();
          }
        } catch (error) {
          console.error("Session verification failed", error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginAPI(email, password);
      if (data.success && data.token) {
        localStorage.setItem('dayflow_token', data.token);
        localStorage.setItem('dayflow_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Invalid credentials';
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const data = await registerAPI(payload);
      if (data.success && data.token) {
        localStorage.setItem('dayflow_token', data.token);
        localStorage.setItem('dayflow_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registration failed';
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('dayflow_token');
    localStorage.removeItem('dayflow_user');
    setToken(null);
    setUser(null);
  };

  const updateCachedUser = (updatedEmployee) => {
    setUser((prev) => {
      if (!prev) return null;
      const newUser = {
        ...prev,
        fullName: updatedEmployee.fullName !== undefined ? updatedEmployee.fullName : prev.fullName,
        department: updatedEmployee.department !== undefined ? updatedEmployee.department : prev.department,
        designation: updatedEmployee.designation !== undefined ? updatedEmployee.designation : prev.designation,
        phone: updatedEmployee.phone !== undefined ? updatedEmployee.phone : prev.phone,
        address: updatedEmployee.address !== undefined ? updatedEmployee.address : prev.address,
        profilePicture: updatedEmployee.profilePicture !== undefined ? updatedEmployee.profilePicture : prev.profilePicture,
      };
      localStorage.setItem('dayflow_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateCachedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
