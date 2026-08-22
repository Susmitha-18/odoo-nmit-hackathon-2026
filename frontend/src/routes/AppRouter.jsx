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

// Admin / HR pages
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import EmployeeList from '../pages/admin/EmployeeList';
import EmployeeDetail from '../pages/admin/EmployeeDetail';
import AttendanceManagement from '../pages/admin/AttendanceManagement';
import LeaveApproval from '../pages/admin/LeaveApproval';
import PayrollManagement from '../pages/admin/PayrollManagement';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/check-email" element={<CheckEmail />} />

      {/* Employee Experience (Self-service Portal) */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute role="employee">
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave" element={<Leave />} />
        <Route path="payroll" element={<Payroll />} />
      </Route>

      {/* Admin / HR Officer Experience (Management Portal) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />
        <Route path="attendance" element={<AttendanceManagement />} />
        <Route path="leave" element={<LeaveApproval />} />
        <Route path="payroll" element={<PayrollManagement />} />
      </Route>

      {/* Default root goes to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500 bg-gray-50 p-6">
            <p className="text-6xl font-bold text-gray-200">404</p>
            <p className="text-lg font-medium text-gray-700">Page not found</p>
            <div className="flex gap-3">
              <a href="/employee/dashboard" className="btn-primary btn btn-sm">Employee Portal</a>
              <a href="/admin/dashboard" className="btn-secondary btn btn-sm">Admin Portal</a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
