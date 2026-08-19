import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  if (!toast.visible) return null;

  const bgColors = {
    success: 'bg-emerald-900/90 text-emerald-100 border-emerald-500/50',
    error: 'bg-red-900/90 text-red-100 border-red-500/50',
    info: 'bg-emerald-950/90 text-emerald-200 border-emerald-600/50'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-emerald-400 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce-short px-4">
      <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl ${bgColors[toast.type]}`}>
        {icons[toast.type]}
        <p className="text-sm font-medium flex-1">{toast.message}</p>
        <button
          onClick={hideToast}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
