import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const PAGE_TITLES = {
  '/employee/dashboard':  'Dashboard',
  '/employee/profile':    'My Profile',
  '/employee/attendance': 'Attendance',
  '/employee/leave':      'Leave',
  '/employee/payroll':    'Payroll',
};

/**
 * EmployeeLayout — persistent shell for all employee pages.
 * Uses React Router's <Outlet /> to render the active page.
 */
export default function EmployeeLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const pageTitle = PAGE_TITLES[pathname] ?? 'Dayflow';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          onMenuToggle={() => setSidebarOpen(true)}
          pageTitle={pageTitle}
        />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
