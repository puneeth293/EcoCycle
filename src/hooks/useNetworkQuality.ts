import { useState, useEffect, useCallback } from 'react';

export type NetworkSpeedTier = '5g' | '4g' | '3g' | '2g' | 'offline';
export type QualityPreference = 'auto' | '5g' | '4g' | 'saver';

interface NetworkConnectionInfo {
  effectiveType?: string;
  downlink?: number; // Mb/s
  rtt?: number; // ms
  saveData?: boolean;
}

const PREF_STORAGE_KEY = 'recynova_network_quality_pref';

export function useNetworkQuality() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const [preference, setPreferenceState] = useState<QualityPreference>(() => {
    try {
      const saved = localStorage.getItem(PREF_STORAGE_KEY) as QualityPreference;
      if (saved && ['auto', '5g', '4g', 'saver'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'auto';
  });

  const [networkInfo, setNetworkInfo] = useState<NetworkConnectionInfo>(() => {
    if (typeof navigator !== 'undefined') {
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (conn) {
        return {
          effectiveType: conn.effectiveType,
          downlink: conn.downlink,
          rtt: conn.rtt,
          saveData: conn.saveData,
        };
      }
    }
    return { effectiveType: '4g', downlink: 10, rtt: 50, saveData: false };
  });

  // Calculate actual effective speed tier
  const detectTier = useCallback((): NetworkSpeedTier => {
    if (!isOnline) return 'offline';

    // If user explicitly forced a tier
    if (preference === '5g') return '5g';
    if (preference === '4g') return '4g';
    if (preference === 'saver') return '3g';

    // Auto detection
    if (networkInfo.saveData) return '3g';

    const downlink = networkInfo.downlink ?? 10;
    const rtt = networkInfo.rtt ?? 50;
    const effectiveType = networkInfo.effectiveType ?? '4g';

    if (effectiveType === '4g' && (downlink >= 15 || rtt < 40)) {
      return '5g'; // High-throughput 4G/5G/Broadband
    }
    if (effectiveType === '4g' || (downlink >= 4 && rtt < 100)) {
      return '4g';
    }
    if (effectiveType === '3g' || downlink >= 1) {
      return '3g';
    }
    return '2g';
  }, [isOnline, preference, networkInfo]);

  const [speedTier, setSpeedTier] = useState<NetworkSpeedTier>(detectTier);

  useEffect(() => {
    setSpeedTier(detectTier());
  }, [detectTier]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const updateConnectionStatus = () => {
      if (conn) {
        setNetworkInfo({
          effectiveType: conn.effectiveType,
          downlink: conn.downlink,
          rtt: conn.rtt,
          saveData: conn.saveData,
        });
      }
    };

    if (conn && conn.addEventListener) {
      conn.addEventListener('change', updateConnectionStatus);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (conn && conn.removeEventListener) {
        conn.removeEventListener('change', updateConnectionStatus);
      }
    };
  }, []);

  const setPreference = (pref: QualityPreference) => {
    setPreferenceState(pref);
    try {
      localStorage.setItem(PREF_STORAGE_KEY, pref);
    } catch {}
  };

  return {
    isOnline,
    speedTier,
    preference,
    setPreference,
    networkInfo,
    isDataSaver: preference === 'saver' || !!networkInfo.saveData,
  };
}
