import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PAGE_TITLES = {
  '/employee/dashboard': 'My Dashboard',
  '/employee/profile': 'My Personal Profile',
  '/employee/attendance': 'Attendance Records',
  '/employee/leave': 'Leave Applications',
  '/employee/payroll': 'Salary & Payroll',
  '/admin/dashboard': 'HR Overview & Analytics',
  '/admin/employees': 'Employee Directory',
  '/admin/attendance': 'Workforce Attendance Log',
  '/admin/leave': 'Leave Approval Queue',
  '/admin/payroll': 'Compensation & Payroll Manager',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pageTitle = PAGE_TITLES[pathname] || 
    (pathname.startsWith('/admin/employees/') ? 'Employee Detailed Profile' : 'Dayflow Portal');

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Dynamic Navigation Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger menu toggle button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none"
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">{pageTitle}</h1>
              <span className={`text-[10px] font-semibold tracking-wider uppercase ${isAdmin ? 'text-indigo-600' : 'text-primary-600'}`}>
                {isAdmin ? 'HR & Administration Access' : 'Personal Staff Access'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">


            {/* Notification Bell */}
            <button className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors focus:outline-none" aria-label="Notifications">
              <Bell size={18} />
              <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${isAdmin ? 'bg-indigo-600' : 'bg-primary-600'}`} />
            </button>

            {/* Horizontal Divider */}
            <div className="w-px h-6 bg-gray-100 hidden sm:block" />

            {/* Quick Profile Dropdown trigger */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-inner select-none ${
                isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-primary-100 text-primary-700'
              }`}>
                {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-gray-800 leading-none">{user?.fullName || 'User Session'}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">{user?.role?.toLowerCase()}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Body content wrapper */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-[#FAFBFC]">
          <div className="animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
