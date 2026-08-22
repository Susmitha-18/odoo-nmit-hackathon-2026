import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="rounded-2xl bg-indigo-55 p-4 text-indigo-600 mb-4 border border-indigo-100 shadow-inner">
        <HelpCircle size={40} />
      </div>
      <h1 className="text-2xl font-black text-slate-800 tracking-tight">404 — Page Not Found</h1>
      <p className="text-xs text-slate-450 font-medium max-w-xs mt-2 leading-relaxed">
        The page you are looking for does not exist or has been moved to another location.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 rounded-xl bg-indigo-605 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFoundPage;
