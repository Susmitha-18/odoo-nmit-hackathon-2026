import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import CheckEmail from '../pages/auth/CheckEmail';

// Employee pages
import EmployeeLayout from '../components/layout/EmployeeLayout';
import Dashboard from '../pages/employee/Dashboard';
import Profile from '../pages/employee/Profile';
import Attendance from '../pages/employee/Attendance';
import Leave from '../pages/employee/Leave';
import Payroll from '../pages/employee/Payroll';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"       element={<Login />} />
      <Route path="/register"    element={<Register />} />
      <Route path="/check-email" element={<CheckEmail />} />

      {/* Employee protected routes */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute role="employee">
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index             element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"  element={<Dashboard />} />
        <Route path="profile"    element={<Profile />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave"      element={<Leave />} />
        <Route path="payroll"    element={<Payroll />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
            <p className="text-6xl font-bold text-gray-200">404</p>
            <p className="text-lg font-medium text-gray-700">Page not found</p>
            <a href="/login" className="btn-primary btn">Go to Login</a>
          </div>
        }
      />
    </Routes>
  );
}
