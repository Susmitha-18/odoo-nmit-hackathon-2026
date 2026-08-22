import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Users,
  Clock,
  CalendarDays,
  CreditCard,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, isAdmin, logout } = useAuth();

  const employeeLinks = [
    { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/employee/profile', icon: User },
    { name: 'Attendance', path: '/employee/attendance', icon: Clock },
    { name: 'Leave', path: '/employee/leave', icon: CalendarDays },
    { name: 'Payroll', path: '/employee/payroll', icon: CreditCard },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/admin/employees', icon: Users },
    { name: 'Attendance Logs', path: '/admin/attendance', icon: Clock },
    { name: 'Leave Requests', path: '/admin/leaves', icon: CalendarDays },
    { name: 'Payroll Mgmt', path: '/admin/payroll', icon: CreditCard },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <img src="/dayflow_logo.jpg" alt="Dayflow Logo" className="h-9 w-9 rounded-xl object-cover shadow-sm" />
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Dayflow<span className="text-indigo-600 font-extrabold font-sans">.</span>
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Card (Quick View) */}
        <div className="p-4 mx-4 my-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
          <img
            src={user?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
            alt="User Avatar"
            className="h-10 w-10 rounded-full object-cover border border-white shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user?.fullName || 'User'}
            </p>
            <p className="text-xs text-slate-500 truncate capitalize font-medium">
              {user?.role === 'ADMIN' ? 'HR Administrator' : user?.designation || 'Employee'}
            </p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-3 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center space-x-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-5 w-5 transition-transform duration-200 ${
                        isActive ? 'text-indigo-600 scale-105' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{link.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={logout}
            className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
