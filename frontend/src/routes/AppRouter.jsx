import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import EmployeeRoute from './EmployeeRoute';

// Layouts
import EmployeeLayout from '../components/layout/EmployeeLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Shared Pages
import NotFoundPage from '../pages/shared/NotFoundPage';
import UnauthorizedPage from '../pages/shared/UnauthorizedPage';

// Employee Portal Pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import EmployeeProfile from '../pages/employee/EmployeeProfile';
import EmployeeAttendance from '../pages/employee/EmployeeAttendance';
import EmployeeLeave from '../pages/employee/EmployeeLeave';
import EmployeePayroll from '../pages/employee/EmployeePayroll';

// Admin Operations Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import EmployeeList from '../pages/admin/EmployeeList';
import EmployeeDetail from '../pages/admin/EmployeeDetail';
import AttendanceManagement from '../pages/admin/AttendanceManagement';
import LeaveApproval from '../pages/admin/LeaveApproval';
import PayrollManagement from '../pages/admin/PayrollManagement';

const AppRouter = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              isAdmin ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/employee/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Employee Routes */}
        <Route element={<EmployeeRoute />}>
          <Route element={<EmployeeLayout />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/profile" element={<EmployeeProfile />} />
            <Route path="/employee/attendance" element={<EmployeeAttendance />} />
            <Route path="/employee/leave" element={<EmployeeLeave />} />
            <Route path="/employee/payroll" element={<EmployeePayroll />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/employees" element={<EmployeeList />} />
              <Route path="/admin/employees/:id" element={<EmployeeDetail />} />
              <Route path="/admin/attendance" element={<AttendancePage />} />
              <Route path="/admin/leaves" element={<LeaveManagement />} />
              <Route path="/admin/payroll" element={<PayrollManagement />} />
            </Route>
          </Route>
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
