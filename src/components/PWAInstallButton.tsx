import React, { useState } from 'react';
import { Download, Smartphone, Check, X, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  compact = false,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as an installed standalone PWA, return null so no extra badge is displayed
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 4000);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={handleInstallClick}
        className={`hidden ${className}`}
        style={{ display: 'none' }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{compact ? 'Install' : 'Install App'}</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <button
        type="button"
        onClick={() => setShowIOSGuide(true)}
        className={`hidden ${className}`}
        style={{ display: 'none' }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>{compact ? 'Install' : 'Install on iOS'}</span>
      </button>
    );
  }

  // Fallback
  return (
    <button
      type="button"
      className={`hidden ${className}`}
      style={{ display: 'none' }}
      aria-hidden="true"
      tabIndex={-1}
    >
      <Download className="w-3 h-3" />
      <span>Install App</span>
    </button>
  );
};
