import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, User as UserIcon, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Topbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm shadow-slate-100">
      {/* Mobile Toggler */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <span className="hidden text-sm font-semibold text-slate-500 md:inline-block">
          Dayflow HRMS Dashboard
        </span>
      </div>

      {/* Action Items */}
      <div className="flex items-center space-x-4">
        {/* Notifications Icon */}
        <button className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-2 ring-white"></span>
        </button>

        {/* Vertical Divider */}
        <span className="h-6 w-px bg-slate-200" aria-hidden="true" />

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 rounded-xl p-1.5 hover:bg-slate-50 transition-colors focus:outline-none"
          >
            <img
              src={user?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
              alt="Avatar"
              className="h-8 w-8 rounded-full object-cover border border-slate-200 shadow-sm"
            />
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-slate-800 leading-3">
                {user?.fullName || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 font-medium capitalize mt-0.5">
                {user?.role}
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay Backdrop to Close Dropdown */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2.5 w-52 origin-top-right rounded-2xl border border-slate-150 bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <Link
                  to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/employee/profile'}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <UserIcon size={16} className="text-slate-400" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to={user?.role === 'ADMIN' ? '/admin/payroll' : '/employee/payroll'}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings size={16} className="text-slate-400" />
                  <span>Payroll Settings</span>
                </Link>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center space-x-2.5 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} className="text-red-500" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
