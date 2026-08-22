import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import EmployeeList from '../pages/admin/EmployeeList';
import EmployeeDetail from '../pages/admin/EmployeeDetail';
import AttendancePage from '../pages/admin/AttendancePage';
import LeaveManagement from '../pages/admin/LeaveManagement';
import PayrollManagement from '../pages/admin/PayrollManagement';

// Shared / error pages
import NotFoundPage from '../pages/shared/NotFoundPage';
import UnauthorizedPage from '../pages/shared/UnauthorizedPage';

function RootRedirect() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin routes — protected by AdminRoute */}
        <Route
          path="/admin/dashboard"
          element={<AdminRoute><AdminDashboard /></AdminRoute>}
        />
        <Route
          path="/admin/employees"
          element={<AdminRoute><EmployeeList /></AdminRoute>}
        />
        <Route
          path="/admin/employees/:id"
          element={<AdminRoute><EmployeeDetail /></AdminRoute>}
        />
        <Route
          path="/admin/attendance"
          element={<AdminRoute><AttendancePage /></AdminRoute>}
        />
        <Route
          path="/admin/leaves"
          element={<AdminRoute><LeaveManagement /></AdminRoute>}
        />
        <Route
          path="/admin/payroll"
          element={<AdminRoute><PayrollManagement /></AdminRoute>}
        />

        {/* Employee routes — Member 2 will add these */}
        {/* <Route path="/dashboard" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} /> */}

        {/* Shared error pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
