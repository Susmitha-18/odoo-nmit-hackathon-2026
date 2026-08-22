import { Menu, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import { useLocation } from 'react-router-dom';

const ROUTE_TITLES = {
  '/admin/dashboard':  { title: 'Dashboard',      subtitle: 'Welcome back! Here\'s what\'s happening today.' },
  '/admin/employees':  { title: 'Employees',       subtitle: 'Manage your team members.' },
  '/admin/attendance': { title: 'Attendance',      subtitle: 'Track daily and weekly attendance records.' },
  '/admin/leaves':     { title: 'Leave Requests',  subtitle: 'Review and action employee leave requests.' },
  '/admin/payroll':    { title: 'Payroll',         subtitle: 'Manage employee salary structures.' },
};

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const routeKey = Object.keys(ROUTE_TITLES).find((k) => pathname === k || pathname.startsWith(k + '/'));
  const { title, subtitle } = ROUTE_TITLES[routeKey] || { title: 'Admin', subtitle: '' };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: hamburger + page title */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-neutral-900 truncate">{title}</h2>
            <p className="text-xs text-neutral-400 hidden sm:block">{today}</p>
          </div>
        </div>

        {/* Right: user info */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200">
            <Avatar
              firstName={user?.firstName || 'Admin'}
              lastName={user?.lastName || ''}
              size="sm"
            />
            <div className="text-left">
              <p className="text-xs font-semibold text-neutral-800 leading-none">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'HR Admin'}
              </p>
              <p className="text-[10px] text-indigo-600 font-medium mt-0.5">Admin / HR</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
