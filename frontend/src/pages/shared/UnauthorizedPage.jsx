import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/employee/dashboard', { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="rounded-2xl bg-rose-50 p-4 text-rose-600 mb-4 border border-rose-100 shadow-inner">
        <ShieldAlert size={40} />
      </div>
      <h1 className="text-2xl font-black text-slate-805 tracking-tight">Access Denied</h1>
      <p className="text-xs text-slate-450 font-medium max-w-xs mt-2 leading-relaxed">
        You do not have the required administrative permissions to access the requested HR operations page.
      </p>
      <button
        onClick={handleGoHome}
        className="mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition-colors"
      >
        Go to Portal Dashboard
      </button>
    </div>
  );
};

export default UnauthorizedPage;
