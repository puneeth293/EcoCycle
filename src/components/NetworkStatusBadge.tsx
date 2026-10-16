import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Zap, 
  Signal, 
  Settings2, 
  Check, 
  Layers,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import { useNetworkQuality, QualityPreference } from '../hooks/useNetworkQuality';

interface NetworkStatusBadgeProps {
  className?: string;
  compact?: boolean;
}

export const NetworkStatusBadge: React.FC<NetworkStatusBadgeProps> = ({
  className = '',
  compact = false,
}) => {
  const { isOnline, speedTier, preference, setPreference, networkInfo } = useNetworkQuality();
  const [modalOpen, setModalOpen] = useState(false);

  const getTierDisplay = () => {
    if (!isOnline) {
      return {
        label: 'Offline',
        subtext: 'Using Cached Data',
        color: 'bg-rose-100 text-rose-800 border-rose-200',
        dotColor: 'bg-rose-500',
        icon: WifiOff
      };
    }

    switch (speedTier) {
      case '5g':
        return {
          label: '5G / Ultra Fast',
          subtext: 'High Bandwidth HD',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dotColor: 'bg-emerald-500 animate-pulse',
          icon: Zap
        };
      case '4g':
        return {
          label: '4G Fast',
          subtext: 'Standard High Speed',
          color: 'bg-teal-100 text-teal-900 border-teal-300',
          dotColor: 'bg-teal-500',
          icon: Signal
        };
      case '3g':
        return {
          label: '3G / Data Saver',
          subtext: 'Compressed Stream',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          dotColor: 'bg-amber-500',
          icon: Wifi
        };
      default:
        return {
          label: '2G Lite',
          subtext: 'Ultra Lite Mode',
          color: 'bg-orange-100 text-orange-900 border-orange-300',
          dotColor: 'bg-orange-500',
          icon: Wifi
        };
    }
  };

  const currentTier = getTierDisplay();
  const TierIcon = currentTier.icon;

  const options: { id: QualityPreference; label: string; desc: string; icon: any }[] = [
    {
      id: 'auto',
      label: 'Adaptive Auto',
      desc: 'Automatically tunes video, media, and caching to match your 4G/5G signal.',
      icon: Sparkles
    },
    {
      id: '5g',
      label: '5G & WiFi Ultra',
      desc: 'Full HD continuous loop videos, high-res assets, and aggressive preloading.',
      icon: Zap
    },
    {
      id: '4g',
      label: '4G Balanced Fast',
      desc: 'Optimized fast loading with compressed streaming and fast page transitions.',
      icon: Signal
    },
    {
      id: 'saver',
      label: 'Data Saver (3G / Low Bandwidth)',
      desc: 'Lightweight compressed video (~990KB) and instant cached responses.',
      icon: Layers
    }
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`hidden ${className}`}
        style={{ display: 'none' }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <span className={`w-2 h-2 rounded-full ${currentTier.dotColor}`} />
        <TierIcon className="w-3.5 h-3.5" />
        <span className="truncate">{compact ? (speedTier === '5g' ? '5G' : speedTier === '4g' ? '4G' : '3G') : currentTier.label}</span>
      </button>

      {/* Network & Speed Optimization Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-emerald-100 text-[#063B32] relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#063B32]">
                  Network Speed & 4G/5G Optimization
                </h3>
                <p className="text-xs text-[#365A52] font-semibold">
                  Speed mode tuned for 3G, 4G, 5G & offline environments
                </p>
              </div>
            </div>

            {/* Live Connection Diagnostics */}
            <div className="bg-emerald-50/80 rounded-2xl p-3.5 border border-emerald-200/80 mb-4">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-emerald-900 flex items-center gap-1.5">
                  <Signal className="w-3.5 h-3.5 text-emerald-700" />
                  Live Network Telemetry
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-200/80 text-emerald-900 text-[11px] font-black uppercase">
                  {isOnline ? `${speedTier.toUpperCase()} Active` : 'Offline'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white/90 p-2 rounded-xl border border-emerald-100 shadow-2xs">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Effective Type</div>
                  <div className="text-xs font-black text-emerald-800 uppercase">{networkInfo.effectiveType || speedTier}</div>
                </div>
                <div className="bg-white/90 p-2 rounded-xl border border-emerald-100 shadow-2xs">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Bandwidth</div>
                  <div className="text-xs font-black text-emerald-800">
                    {networkInfo.downlink ? `${networkInfo.downlink} Mbps` : '~10 Mbps'}
                  </div>
                </div>
                <div className="bg-white/90 p-2 rounded-xl border border-emerald-100 shadow-2xs">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Latency (RTT)</div>
                  <div className="text-xs font-black text-emerald-800">
                    {networkInfo.rtt ? `${networkInfo.rtt} ms` : '< 50 ms'}
                  </div>
                </div>
              </div>
            </div>

            {/* Speed Mode Selection */}
            <div className="space-y-2 mb-4">
              <label className="block text-xs font-black text-[#063B32] uppercase tracking-wider mb-1">
                Select Speed Preference
              </label>

              {options.map((opt) => {
                const Icon = opt.icon;
                const isSelected = preference === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setPreference(opt.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                      isSelected ? 'bg-emerald-600' : 'bg-slate-300 text-slate-700'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#063B32]">{opt.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-[#365A52] font-semibold mt-0.5 leading-snug">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Acceleration Technologies */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-[#365A52] space-y-1.5">
              <div className="flex items-center gap-1.5 font-black text-[#063B32]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Built-in Speed Engines Active:</span>
              </div>
              <ul className="text-[11px] space-y-1 pl-5 list-disc font-medium">
                <li><strong>HTTP Gzip Compression</strong>: Transferred payloads reduced by up to 80%.</li>
                <li><strong>Service Worker Cache</strong>: Instantaneous navigation without network roundtrips.</li>
                <li><strong>Adaptive Bitrate Video</strong>: Seamless 480p/720p streams for 3G/4G stability.</li>
                <li><strong>Range-Request Streaming</strong>: Buffer-free byte-chunk video seek.</li>
              </ul>
            </div>

            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-500 shadow-md transition-all"
            >
              Apply & Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
