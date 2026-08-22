import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          let styles = {
            bg: 'bg-white',
            border: 'border-slate-200',
            text: 'text-slate-800',
            icon: Info,
            iconColor: 'text-blue-500',
          };
          if (t.type === 'success') {
            styles = {
              bg: 'bg-emerald-55/95',
              border: 'border-emerald-200',
              text: 'text-emerald-900',
              icon: CheckCircle2,
              iconColor: 'text-emerald-600',
            };
          } else if (t.type === 'error') {
            styles = {
              bg: 'bg-rose-50/95',
              border: 'border-rose-200',
              text: 'text-rose-900',
              icon: AlertCircle,
              iconColor: 'text-rose-600',
            };
          }

          const Icon = styles.icon;

          return (
            <div
              key={t.id}
              className={`flex items-center space-x-3 rounded-2xl border px-4 py-3.5 shadow-md backdrop-blur-sm pointer-events-auto transition-all duration-300 transform translate-y-0 ${styles.bg} ${styles.border} ${styles.text}`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${styles.iconColor}`} />
              <p className="flex-1 text-xs font-semibold leading-relaxed">
                {t.message}
              </p>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
