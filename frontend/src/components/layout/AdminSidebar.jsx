import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, CalendarCheck,
  CalendarOff, Wallet, X, LogOut, ShieldCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin/dashboard',  label: 'Dashboard',    Icon: LayoutDashboard },
  { to: '/admin/employees',  label: 'Employees',    Icon: Users           },
  { to: '/admin/attendance', label: 'Attendance',   Icon: CalendarCheck   },
  { to: '/admin/leave',      label: 'Leave Approvals', Icon: CalendarOff  },
  { to: '/admin/payroll',    label: 'Payroll',      Icon: Wallet          },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => navigate('/login');

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-40
        flex flex-col transition-transform duration-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-base block">Dayflow</span>
              <span className="text-[10px] text-indigo-600 font-medium uppercase tracking-wide">HR Portal</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-700" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        {/* Role badge */}
        <div className="mx-3 mt-3 mb-1 flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg">
          <ShieldCheck size={14} className="text-indigo-600" />
          <span className="text-xs font-semibold text-indigo-700">Admin / HR Officer</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-400">hr@dayflow.io</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            id="admin-sidebar-logout-btn"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-danger-50 hover:text-danger-700 transition-colors"
          >
            <LogOut size={18} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}
