import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Menu, Bell } from 'lucide-react';

const PAGE_TITLES = {
  '/admin/dashboard':  'HR Dashboard',
  '/admin/employees':  'Employee Directory',
  '/admin/attendance': 'Attendance Records',
  '/admin/leave':      'Leave Approvals',
  '/admin/payroll':    'Payroll & Compensation',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const pageTitle = PAGE_TITLES[pathname] || (pathname.startsWith('/admin/employees/') ? 'Employee Details' : 'HR Management');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base font-semibold text-gray-900">{pageTitle}</h1>
              <span className="text-xs text-indigo-600 font-medium">Administrator View</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Switch to Employee View for easy demo */}
            <Link
              to="/employee/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              title="Switch to Employee View"
            >
              <span>👤 Switch to Employee Portal</span>
            </Link>

            <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
            </button>

            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
              HR
            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
