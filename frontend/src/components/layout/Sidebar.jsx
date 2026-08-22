import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  CalendarOff,
  Wallet,
  X,
  LogOut,
  ShieldCheck,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const EMPLOYEE_ITEMS = [
  { to: '/employee/dashboard',  label: 'Dashboard',   Icon: LayoutDashboard },
  { to: '/employee/profile',    label: 'My Profile',  Icon: User            },
  { to: '/employee/attendance', label: 'Attendance',  Icon: CalendarCheck   },
  { to: '/employee/leave',      label: 'Leave Requests', Icon: CalendarOff   },
  { to: '/employee/payroll',    label: 'Payroll',     Icon: Wallet          },
];

const ADMIN_ITEMS = [
  { to: '/admin/dashboard',  label: 'Dashboard',    Icon: LayoutDashboard },
  { to: '/admin/employees',  label: 'Employees',    Icon: Users           },
  { to: '/admin/attendance', label: 'Attendance',   Icon: CalendarCheck   },
  { to: '/admin/leave',      label: 'Leave Approvals', Icon: CalendarOff  },
  { to: '/admin/payroll',    label: 'Payroll',      Icon: Wallet          },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const isAdmin = user?.role === 'ADMIN';
  const navItems = isAdmin ? ADMIN_ITEMS : EMPLOYEE_ITEMS;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? isAdmin 
          ? 'bg-indigo-50 text-indigo-700 font-semibold' 
          : 'bg-primary-50 text-primary-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/45 z-30 lg:hidden backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-40
          flex flex-col transition-transform duration-250 ease-in-out
          ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo and Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-50">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${isAdmin ? 'bg-indigo-600' : 'bg-primary-600'}`}>
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-base block tracking-tight">Dayflow</span>
              <span className={`text-[10px] font-semibold uppercase tracking-wide ${isAdmin ? 'text-indigo-600' : 'text-primary-600'}`}>
                {isAdmin ? 'Management Portal' : 'Employee Self-Service'}
              </span>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-50"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Role Badge Indicator */}
        <div className="mx-3 mt-3.5 mb-1.5 flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg">
          <ShieldCheck size={14} className={isAdmin ? 'text-indigo-600' : 'text-primary-600'} />
          <span className={`text-xs font-semibold ${isAdmin ? 'text-indigo-700' : 'text-primary-700'}`}>
            {isAdmin ? 'HR & Admin Officer' : 'Staff Employee'}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User profile section at the bottom */}
        <div className="px-3 py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shadow-inner ${
              isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-primary-100 text-primary-700'
            }`}>
              {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName || 'User Session'}</p>
              <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
