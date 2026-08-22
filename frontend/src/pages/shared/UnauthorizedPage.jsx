import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6">
          <ShieldOff className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Access Denied</h1>
        <p className="text-sm text-neutral-500 mb-8">
          You don't have permission to access this page. This area is restricted to HR Administrators only.
        </p>
        <button
          onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/dashboard')}
          className="flex items-center gap-2 mx-auto px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to My Dashboard
        </button>
      </div>
    </div>
  );
}
