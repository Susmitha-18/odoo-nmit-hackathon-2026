import { useNavigate } from 'react-router-dom';
import { MapPin, Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="text-8xl font-black text-neutral-200 mb-4 select-none">404</div>
        <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-2xl mb-5">
          <MapPin className="w-7 h-7 text-indigo-500" />
        </div>
        <h1 className="text-xl font-bold text-neutral-900 mb-2">Page Not Found</h1>
        <p className="text-sm text-neutral-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mx-auto px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  );
}
