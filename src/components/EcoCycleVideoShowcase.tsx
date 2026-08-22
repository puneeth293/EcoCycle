import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Recycle, Truck, Trash2, Sparkles, Upload } from 'lucide-react';
import bgImage from '../assets/images/ecocycle_hero_bg_1787409279777.jpg';

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
  const [customVideoUrl, setCustomVideoUrl] = useState<string>(videoSrc || '');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const steps = [
    {
      id: 0,
      title: 'Segregate',
      subtitle: 'Sort Organic, Paper, Plastic & Hazard at Source',
      icon: Trash2,
      color: 'bg-emerald-600',
      time: '0:00 - 0:02'
    },
    {
      id: 1,
      title: 'Collect',
      subtitle: 'Municipal EV & Green Collection Fleet Logistics',
      icon: Truck,
      color: 'bg-teal-600',
      time: '0:02 - 0:04'
    },
    {
      id: 2,
      title: 'Recycle',
      subtitle: 'Material Recovery & Solar-Powered Processing',
      icon: Recycle,
      color: 'bg-emerald-700',
      time: '0:04 - 0:06'
    },
    {
      id: 3,
      title: 'Reuse',
      subtitle: 'Circular Economy & Clean Environmental Future',
      icon: Sparkles,
      color: 'bg-green-600',
      time: '0:06 - 0:07'
    }
  ];

  // Auto-cycle through step indicators if playing simulated preview
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
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

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setIsPlaying(true);
    }
  };

  return (
    <div className={`glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/80 overflow-hidden ${className}`}>
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <Recycle className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-[#063B32]">
                EcoCycle System in Action
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                HD Motion
              </span>
            </div>
            <p className="text-xs text-[#365A52] font-semibold">
              Segregate • Collect • Recycle • Reuse
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-[#063B32] border border-emerald-200 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all">
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Load Video File</span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-[#063B32] border border-emerald-200 text-xs font-bold shadow-xs transition-all"
          >
            {showUrlInput ? 'Close URL' : 'Video URL'}
          </button>
        </div>
      </div>

      {showUrlInput && (
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Paste direct MP4 or video stream URL..."
            value={customVideoUrl}
            onChange={(e) => setCustomVideoUrl(e.target.value)}
            className="flex-1 bg-white/90 border border-emerald-200 text-[#063B32] text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
          {customVideoUrl && (
            <button
              onClick={() => setCustomVideoUrl('')}
              className="px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100"
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* Video Container / Canvas */}
      <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 shadow-inner group border border-white/40">
        
        {customVideoUrl ? (
          <video
            ref={videoRef}
            src={customVideoUrl}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          /* Animated 3D Cinematic Visual Simulation */
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={bgImage}
              alt="EcoCycle 3D Simulation"
              className={`w-full h-full object-cover transition-transform duration-1000 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
            
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

            {/* Active Workflow Stage Overlay Card */}
            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-white p-3 rounded-2xl border border-white/20 shadow-xl max-w-[200px] sm:max-w-[240px]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                  Live Stage: {steps[activeStep].title}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-200 line-clamp-2">
                {steps[activeStep].subtitle}
              </p>
            </div>

            {/* Centered EcoCycle 3D Branding Crest */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-600/90 backdrop-blur-md border-2 border-white/90 shadow-2xl flex items-center justify-center text-white mb-3 animate-pulse">
                <Recycle className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg tracking-wider">
                EcoCycle
              </h2>
              <p className="text-xs sm:text-sm font-bold text-emerald-200 uppercase tracking-widest drop-shadow-md">
                Waste Segregation & Recycling System
              </p>
            </div>
          </div>
        )}

        {/* Video Overlay Playback Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-3 sm:p-4 flex items-center justify-between gap-3 text-white transition-opacity">
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LOOPING PLAYBACK</span>
            </div>
          </div>

          {/* Workflow Step Indicators */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  activeStep === step.id
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-white/15 text-slate-300 hover:bg-white/25'
                }`}
              >
                {step.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullScreen}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* 4-Step Interactive Timeline Bar */}
      {!compact && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const isSelected = activeStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`cursor-pointer p-3 rounded-2xl transition-all border ${
                  isSelected
                    ? 'bg-emerald-50/90 border-emerald-400 shadow-md transform -translate-y-0.5'
                    : 'bg-white/60 hover:bg-white/90 border-white/80'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-6 h-6 rounded-lg ${step.color} text-white flex items-center justify-center shrink-0 text-xs shadow-xs`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black text-[#063B32]">
                    {step.id + 1}. {step.title}
                  </span>
                </div>
                <p className="text-[11px] text-[#365A52] font-semibold line-clamp-2 leading-tight">
                  {step.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
