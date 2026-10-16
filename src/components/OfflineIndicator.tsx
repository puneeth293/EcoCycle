import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useNetworkQuality } from '../hooks/useNetworkQuality';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = useNetworkQuality();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center justify-between gap-3 rounded-2xl bg-slate-900/95 text-white px-4 py-3 shadow-2xl border border-amber-500/40 backdrop-blur-md animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
        <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
        <div>
          <p className="text-xs font-black text-white">Offline Mode Active</p>
          <p className="text-[11px] text-slate-300 font-medium">Recynova is running fast from offline cache.</p>
        </div>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
        title="Retry connection"
      >
        <RefreshCw className="w-3 h-3" />
        <span>Retry</span>
      </button>
    </div>
  );
};
