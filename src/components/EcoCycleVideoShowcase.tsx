import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  Recycle, 
  Truck, 
  Trash2, 
  Sparkles, 
  Upload,
  Sun,
  Wind,
  Layers,
  Repeat
} from 'lucide-react';
import ecocycleLoopVideo from '../assets/videos/ecocycle_loop.mp4';

const STORAGE_KEY = 'recynova_permanent_video_url';

interface EcoCycleVideoShowcaseProps {
  videoSrc?: string;
  className?: string;
  compact?: boolean;
}

export const EcoCycleVideoShowcase: React.FC<EcoCycleVideoShowcaseProps> = ({
  videoSrc,
  className = '',
  compact = false
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(8.3);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>(() => {
    return (
      videoSrc || 
      localStorage.getItem(STORAGE_KEY) || 
      ecocycleLoopVideo || 
      '/videos/ecocycle_loop.mp4'
    );
  });
  const [showUrlInput, setShowUrlInput] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const steps = [
    {
      id: 0,
      title: 'Recynova System',
      badge: 'Introduction',
      timestamp: 0.0,
      subtitle: 'Smart Circular Economy & Eco-Park Infrastructure',
      icon: Recycle,
      color: 'bg-emerald-600',
      time: '0:00 - 0:01',
      details: 'Lush eco-park infrastructure with solar panels and wind turbines powering decentralized waste processing.'
    },
    {
      id: 1,
      title: 'Segregate',
      badge: 'Step 1: Source Sorting',
      timestamp: 1.6,
      subtitle: 'Organic (Green), Paper (Blue), Plastic (Yellow), Metal (Red)',
      icon: Trash2,
      color: 'bg-emerald-700',
      time: '0:01 - 0:03',
      details: 'Food scraps, paper, plastic bottles, and metal cans segregated into distinct color-coded receptacles.'
    },
    {
      id: 2,
      title: 'Collect',
      badge: 'Step 2: Clean Sorting',
      timestamp: 3.2,
      subtitle: 'Dry Recyclables & High-Value Resource Segregation',
      icon: Layers,
      color: 'bg-amber-600',
      time: '0:03 - 0:04',
      details: 'Household recyclables sorted cleanly at the source to prevent contamination.'
    },
    {
      id: 3,
      title: 'Recycle',
      badge: 'Step 3: EV Logistics',
      timestamp: 4.8,
      subtitle: 'Zero-Emission Municipal EV Collection Fleet',
      icon: Truck,
      color: 'bg-teal-600',
      time: '0:04 - 0:06',
      details: 'Green municipal electric garbage trucks navigate solar-powered collection routes with GPS live tracking.'
    },
    {
      id: 4,
      title: 'Reuse',
      badge: 'Step 4: Circular Loop',
      timestamp: 6.4,
      subtitle: 'Segregate • Collect • Recycle • Reuse Closed Loop',
      icon: Sparkles,
      color: 'bg-green-600',
      time: '0:06 - 0:08',
      details: '100% recovered materials transformed into clean compost, energy offsets, and new goods in a closed loop.'
    }
  ];

  // Try auto-playing video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy might require user interaction if unmuted
        setIsPlaying(false);
      });
    }
  }, [activeVideoUrl]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 8.3;
      setCurrentTime(cur);
      setDuration(dur);

      // Determine active step from current playback time
      if (cur < 1.6) {
        setActiveStep(0);
      } else if (cur < 3.2) {
        setActiveStep(1);
      } else if (cur < 4.8) {
        setActiveStep(2);
      } else if (cur < 6.4) {
        setActiveStep(3);
      } else {
        setActiveStep(4);
      }
    }
  };

  const jumpToStep = (stepId: number) => {
    setActiveStep(stepId);
    if (videoRef.current) {
      const targetTime = steps[stepId]?.timestamp ?? 0;
      videoRef.current.currentTime = targetTime;
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    setActiveStep(0);
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      const elem = document.getElementById('ecocycle-video-container');
      if (elem && elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setActiveVideoUrl(url);
      try {
        localStorage.setItem(STORAGE_KEY, url);
      } catch {}
      setIsPlaying(true);
    }
  };

  const handleResetToPermanentVideo = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setActiveVideoUrl(ecocycleLoopVideo || '/videos/ecocycle_loop.mp4');
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/80 overflow-hidden ${className}`}>
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <Recycle className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-[#063B32]">
                Recynova System Video
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <Repeat className="w-3 h-3 text-emerald-700 animate-spin-slow" />
                <span>Continuous Loop</span>
              </span>
            </div>
            <p className="text-xs text-[#365A52] font-semibold">
              Segregate • Collect • Recycle • Reuse Closed Loop
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeVideoUrl !== ecocycleLoopVideo && activeVideoUrl !== '/videos/ecocycle_loop.mp4' && (
            <button
              onClick={handleResetToPermanentVideo}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-all shadow-xs"
            >
              Reset to Default Loop
            </button>
          )}

          <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-[#063B32] border border-emerald-200 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all hover:scale-105">
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Upload MP4</span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-[#063B32] border border-emerald-200 text-xs font-bold shadow-xs transition-all"
          >
            {showUrlInput ? 'Close' : 'Web URL'}
          </button>
        </div>
      </div>

      {showUrlInput && (
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Paste direct MP4 or video stream URL..."
            value={activeVideoUrl}
            onChange={(e) => {
              setActiveVideoUrl(e.target.value);
              try {
                localStorage.setItem(STORAGE_KEY, e.target.value);
              } catch {}
            }}
            className="flex-1 bg-white/90 border border-emerald-200 text-[#063B32] text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
          <button
            onClick={handleResetToPermanentVideo}
            className="px-3.5 py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100"
          >
            Use System Loop
          </button>
        </div>
      )}

      {/* Video Container with HTML5 video player and seamless loop */}
      <div 
        id="ecocycle-video-container"
        className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 shadow-2xl group border border-white/40 select-none"
      >
        {/* HTML5 Loop Video */}
        <video
          ref={videoRef}
          src={activeVideoUrl}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => {
            const dur = e.currentTarget.duration;
            if (dur && !isNaN(dur)) setDuration(dur);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Top Left Floating Status Badges */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 text-white pointer-events-none">
          <div className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/20 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold">
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>Solar Powered</span>
          </div>
          <div className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/20 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold">
            <Wind className="w-3.5 h-3.5 text-emerald-400" />
            <span>Wind Turbines Active</span>
          </div>
          <div className="hidden sm:flex px-2.5 py-1 rounded-xl bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-emerald-300">
            <Repeat className="w-3 h-3 text-emerald-400 animate-spin-slow" />
            <span>Looping</span>
          </div>
        </div>

        {/* Top Right Current Step Badge */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-slate-950/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/20 shadow-xl text-left pointer-events-none">
          <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{steps[activeStep]?.badge || 'Recynova System'}</span>
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-white truncate max-w-[160px] sm:max-w-[200px]">
            {steps[activeStep]?.title}
          </p>
        </div>

        {/* Center Play Overlay when Paused */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Video Overlay Playback Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-3 sm:p-4 text-white transition-opacity">
          
          {/* Timeline Scrubber Bar */}
          <div className="mb-2.5 flex items-center gap-2">
            <input
              type="range"
              min="0"
              max={duration || 8.3}
              step="0.05"
              value={currentTime}
              onChange={handleScrubberChange}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
            />
            <span className="text-[10px] font-mono font-bold text-slate-300 shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={togglePlay}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={restartVideo}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                title="Restart loop"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="hidden md:flex items-center gap-1.5 text-[11px] font-bold text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>PERMANENT VIDEO IN MOTION (LOOP)</span>
              </div>
            </div>

            {/* Workflow Step Quick Jumps */}
            <div className="flex items-center gap-1">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => jumpToStep(step.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    activeStep === step.id
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-white/15 text-slate-300 hover:bg-white/25'
                  }`}
                  title={step.subtitle}
                >
                  {step.title}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleFullScreen}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                title="Fullscreen"
              >
                <Maximize className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* 5-Step Interactive Timeline Cards */}
      {!compact && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mt-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const isSelected = activeStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => jumpToStep(step.id)}
                className={`cursor-pointer p-3 rounded-2xl transition-all border ${
                  isSelected
                    ? 'bg-emerald-50/90 border-emerald-400 shadow-md transform -translate-y-0.5 ring-2 ring-emerald-500/20'
                    : 'bg-white/60 hover:bg-white/90 border-white/80'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-5 h-5 rounded-lg ${step.color} text-white flex items-center justify-center shrink-0 text-xs shadow-xs`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-black text-[#063B32] truncate">
                    {step.title}
                  </span>
                </div>
                <p className="text-[10px] text-[#365A52] font-semibold line-clamp-2 leading-tight">
                  {step.subtitle}
                </p>
                <span className="inline-block mt-1 text-[9px] font-mono text-emerald-700 font-bold">
                  {step.time}
                </span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
