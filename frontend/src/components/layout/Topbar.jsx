import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getGreeting } from '../../utils/dateUtils';

/**
 * Topbar — page header with mobile menu toggle, greeting, and user info.
 *
 * Props:
 *   onMenuToggle   func   — opens mobile sidebar
 *   pageTitle      string — current page name
 */
export default function Topbar({ onMenuToggle, pageTitle }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 flex items-center gap-4">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Open menu"
        id="topbar-menu-toggle"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-base font-semibold text-gray-900">{pageTitle || 'Dayflow'}</h1>
        <p className="text-xs text-gray-400 hidden sm:block">
          {getGreeting()}, {user?.email?.split('@')[0] ?? 'Employee'} 👋
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Switch to Admin View */}
        <a
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors"
          title="Switch to HR / Admin View"
        >
          <span>👑 Switch to HR Portal</span>
        </a>

        {/* Notification bell */}
        <button
          className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
          id="topbar-notifications-btn"
        >
          <Bell size={18} />
          {/* Dot indicator */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-600 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
          {user?.email?.[0]?.toUpperCase() ?? 'E'}
        </div>
      </div>
    </header>
  );
}
