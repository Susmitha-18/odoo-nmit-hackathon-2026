import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardCheck, CalendarClock,
  Banknote, X, Briefcase, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const NAV_ITEMS = [
  { to: '/admin/dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/admin/employees',  label: 'Employees',   icon: Users },
  { to: '/admin/attendance', label: 'Attendance',  icon: ClipboardCheck },
  { to: '/admin/leaves',     label: 'Leave Requests', icon: CalendarClock },
  { to: '/admin/payroll',    label: 'Payroll',     icon: Banknote },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-neutral-200 z-30
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      {/* Logo + close button (mobile) */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-neutral-900">Dayflow</span>
            <span className="block text-xs text-indigo-600 font-medium -mt-0.5">HR Admin</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
          Main Menu
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-neutral-400'}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User profile + logout */}
      <div className="px-3 py-4 border-t border-neutral-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-neutral-50 mb-2">
          <Avatar
            firstName={user?.firstName || 'Admin'}
            lastName={user?.lastName || ''}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 truncate">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.email || 'HR Admin')}
            </p>
            <p className="text-xs text-indigo-600 font-medium">Admin / HR</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4 text-neutral-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
