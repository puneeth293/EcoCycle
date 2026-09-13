import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink, 
  Compass, 
  Navigation,
  Building2,
  CheckCircle2,
  Video,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Trash2,
  Sparkles,
  Layers,
  Sliders,
  Check,
  RotateCcw
} from 'lucide-react';

const CONTACT_BG_STORAGE_KEY = 'recynova_contact_bg_video';
const LEGACY_BG_STORAGE_KEY = 'ecocycle_contact_bg_video';
const PERMANENT_WEBSITE_VIDEO_KEY = 'recynova_permanent_video_url';
const PLACEMENT_STORAGE_KEY = 'recynova_video_placement';

// High-definition sample loops for immediate preview
const SAMPLE_VIDEOS = [
  {
    id: 'eco-nature',
    name: '🌿 Eco Nature Park',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: 'clean-green',
    name: '♻️ Clean Recycling Facility',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  }
];

interface ContactLocationDetailsCardProps {
  className?: string;
}

export const ContactLocationDetailsCard: React.FC<ContactLocationDetailsCardProps> = ({
  className = ''
}) => {
  // Video state initialization from localStorage for permanent persistence
  const [videoUrl, setVideoUrl] = useState<string>(() => {
    return (
      localStorage.getItem(CONTACT_BG_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_BG_STORAGE_KEY) ||
      localStorage.getItem(PERMANENT_WEBSITE_VIDEO_KEY) ||
      ''
    );
  });

  const [placement, setPlacement] = useState<'background' | 'featured'>(() => {
    const saved = localStorage.getItem(PLACEMENT_STORAGE_KEY);
    return saved === 'featured' ? 'featured' : 'background';
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(80); // 80% opacity for optimal text readability
  const [showControlsPanel, setShowControlsPanel] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>('');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync placement setting to localStorage
  useEffect(() => {
    localStorage.setItem(PLACEMENT_STORAGE_KEY, placement);
  }, [placement]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Handle Mute/Unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const showNotice = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => {
      setStatusNotification(null);
    }, 4500);
  };

  // Video Upload Handler (Permanent)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a valid video format
    if (!file.type.startsWith('video/')) {
      showNotice('Please select a valid video file (MP4, WebM, etc.)');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
    setIsPlaying(true);

    // Attempt permanent storage via base64 data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      try {
        localStorage.setItem(CONTACT_BG_STORAGE_KEY, dataUrl);
        localStorage.setItem(LEGACY_BG_STORAGE_KEY, dataUrl);
        localStorage.setItem(PERMANENT_WEBSITE_VIDEO_KEY, dataUrl);
        showNotice('Video uploaded and permanently saved to website!');
      } catch (err) {
        // In case of large video file exceeding quota, save URL reference
        showNotice('Video active for this session! (Tip: use direct URL for cross-device permanent caching)');
      }
    };
    reader.readAsDataURL(file);
  };

  // Apply custom URL
  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    const url = urlInput.trim();
    setVideoUrl(url);
    setIsPlaying(true);
    localStorage.setItem(CONTACT_BG_STORAGE_KEY, url);
    localStorage.setItem(LEGACY_BG_STORAGE_KEY, url);
    localStorage.setItem(PERMANENT_WEBSITE_VIDEO_KEY, url);
    setUrlInput('');
    showNotice('Permanent background video URL updated!');
  };

  // Dedicated "Remove Background Video Only" Handler
  const handleRemoveBackgroundVideoOnly = () => {
    setVideoUrl('');
    localStorage.removeItem(CONTACT_BG_STORAGE_KEY);
    localStorage.removeItem(LEGACY_BG_STORAGE_KEY);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showNotice('Background video removed. Contact and location details preserved.');
  };

  // Set sample video
  const handleSelectSample = (sampleUrl: string) => {
    setVideoUrl(sampleUrl);
    setIsPlaying(true);
    localStorage.setItem(CONTACT_BG_STORAGE_KEY, sampleUrl);
    localStorage.setItem(LEGACY_BG_STORAGE_KEY, sampleUrl);
    localStorage.setItem(PERMANENT_WEBSITE_VIDEO_KEY, sampleUrl);
    showNotice('Sample environmental video applied permanently!');
  };

  return (
    <div 
      id="contact-location-card" 
      className={`glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 transition-all flex flex-col justify-between relative overflow-hidden group ${className}`}
    >
      {/* Background Video Layer when placement is 'background' */}
      {videoUrl && placement === 'background' && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover scale-105 transition-transform duration-1000"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          {/* Dynamic accessibility glass overlay: ensures text contrast remains crisp */}
          <div 
            className="absolute inset-0 transition-opacity duration-300 backdrop-blur-[1.5px]"
            style={{ 
              backgroundColor: `rgba(255, 255, 255, ${overlayOpacity / 100})`
            }}
          />
        </div>
      )}

      {/* Content wrapper with higher z-index to sit on top of video */}
      <div className="relative z-10">
        
        {/* Header with Video Options & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#063B32]/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#063B32] tracking-tight">
                  Contact & Location Details
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  HQ Central Hub
                </span>
              </div>
              <p className="text-xs text-[#365A52] font-semibold">
                Recynova Central Material Recovery Operations
              </p>
            </div>
          </div>

          {/* Interactive Video Options Toolbar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="toggle-video-options-btn"
              onClick={() => setShowControlsPanel(!showControlsPanel)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs ${
                videoUrl 
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                  : 'bg-white/80 hover:bg-white text-[#063B32] border border-emerald-200'
              }`}
              title="Configure Background Video"
            >
              <Video className="w-3.5 h-3.5" />
              <span>{videoUrl ? 'Video Options' : 'Add Background Video'}</span>
            </button>

            {/* Quick Remove Background Video Only Button */}
            {videoUrl && (
              <button
                type="button"
                id="remove-background-video-btn"
                onClick={handleRemoveBackgroundVideoOnly}
                className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black flex items-center gap-1 transition-all shadow-xs"
                title="Remove the background video only"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Remove Video Only</span>
              </button>
            )}
          </div>
        </div>

        {/* Temporary Notification Alert */}
        {statusNotification && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusNotification}</span>
          </div>
        )}

        {/* Video Control & Upload Panel */}
        {showControlsPanel && (
          <div className="mt-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-300 shadow-xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black text-[#063B32] uppercase tracking-wider">
                  Background Video & Placement Controls
                </h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Permanent Storage
              </span>
            </div>

            {/* Placement Options */}
            <div>
              <label className="block text-[11px] font-black text-[#063B32] mb-1.5">
                Place Video in Any Valid Option:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPlacement('background')}
                  className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                    placement === 'background'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white text-[#365A52] border border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Card Background</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlacement('featured')}
                  className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                    placement === 'featured'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white text-[#365A52] border border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Featured Video Card</span>
                </button>
              </div>
            </div>

            {/* Upload MP4 / WebM File */}
            <div>
              <label className="block text-[11px] font-black text-[#063B32] mb-1.5">
                Upload Your Video File (MP4, WebM):
              </label>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="contact-video-file-input"
                />
                <label
                  htmlFor="contact-video-file-input"
                  className="cursor-pointer flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Video File from Device</span>
                </label>
              </div>
            </div>

            {/* Direct Web URL Input */}
            <div>
              <label className="block text-[11px] font-black text-[#063B32] mb-1">
                Or Paste Video Direct URL (Permanent):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/ambient-video.mp4"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-emerald-200 text-[#063B32] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2 bg-[#063B32] hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-xs"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Quick Sample Environmental Loops */}
            <div>
              <span className="block text-[11px] font-black text-[#063B32] mb-1.5">
                Quick Sample Video Loops:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_VIDEOS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample.url)}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100/80 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 transition-colors"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Playback & Transparency Controls if Video is Loaded */}
            {videoUrl && (
              <div className="pt-2 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                    title={isPlaying ? 'Pause Video' : 'Play Video'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Overlay Opacity Dimmer */}
                {placement === 'background' && (
                  <div className="flex items-center gap-2 text-xs font-bold text-[#063B32]">
                    <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Overlay Tint: {overlayOpacity}%</span>
                    <input
                      type="range"
                      min="40"
                      max="95"
                      value={overlayOpacity}
                      onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                      className="w-24 accent-emerald-600 cursor-pointer"
                    />
                  </div>
                )}

                {/* Single-Click Remove Background Video Only */}
                <button
                  type="button"
                  onClick={handleRemoveBackgroundVideoOnly}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Video Only</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Featured Video Player Box when placement is 'featured' */}
        {videoUrl && placement === 'featured' && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-emerald-300 shadow-xl bg-slate-950 relative aspect-video group">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted={isMuted}
              playsInline
            />
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-bold">
              <button onClick={togglePlay} className="hover:text-emerald-400">
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button onClick={toggleMute} className="hover:text-emerald-400">
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={handleRemoveBackgroundVideoOnly} 
                className="hover:text-rose-400 text-rose-300 ml-1"
                title="Remove Video"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 bg-emerald-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-emerald-200 uppercase tracking-wider border border-emerald-500/30">
              Recynova Operational Live Feed
            </div>
          </div>
        )}

        {/* Details List */}
        <div className="space-y-4 pt-6">
          
          {/* Address */}
          <div className="flex items-start gap-3.5 bg-white/75 backdrop-blur-md p-4 rounded-2xl border border-emerald-100 shadow-xs hover:bg-white/90 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <strong className="block text-[#063B32] font-black text-sm">
                  Central Operational Facility:
                </strong>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Karnataka Zone
                </span>
              </div>
              <p className="text-xs text-[#365A52] font-semibold mt-0.5 leading-relaxed">
                12th Cross, Green Tech Hub, SS Puram, Tumkur, Karnataka 572102, India
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-emerald-800 font-mono flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  GPS: 13.3409° N, 77.1010° E
                </span>
              </div>
            </div>
          </div>

          {/* Helpline */}
          <div className="flex items-start gap-3.5 bg-white/75 backdrop-blur-md p-4 rounded-2xl border border-emerald-100 shadow-xs hover:bg-white/90 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <strong className="block text-[#063B32] font-black text-sm">
                Toll-Free Helpline & Dispatch:
              </strong>
              <p className="text-xs text-[#365A52] font-semibold mt-0.5">
                1800-123-RECYNOVA • (+91 80 2345 6789)
              </p>
              <a
                href="tel:1800123326"
                className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 hover:text-emerald-900 mt-1 underline underline-offset-2"
              >
                <span>Click to Call Dispatch Helpline</span>
              </a>
            </div>
          </div>

          {/* Email & Hours Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-white/75 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-emerald-600" />
                <strong className="text-[#063B32] font-black text-xs">Official Email</strong>
              </div>
              <p className="text-xs text-[#365A52] font-semibold truncate">
                support@recynova.org
              </p>
              <a
                href="mailto:support@recynova.org"
                className="text-[11px] text-emerald-700 font-bold hover:underline mt-1 inline-block"
              >
                Write to Support →
              </a>
            </div>

            <div className="bg-white/75 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-emerald-600" />
                <strong className="text-[#063B32] font-black text-xs">Operating Hours</strong>
              </div>
              <p className="text-xs text-[#365A52] font-semibold">
                Mon – Sat: 08:00 AM – 06:00 PM
              </p>
              <span className="text-[11px] text-amber-700 font-bold inline-block mt-1">
                Closed on Sundays
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Actions */}
      <div className="relative z-10 pt-6 mt-6 border-t border-[#063B32]/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-[#063B32]">
            Facility Open for Drop-offs & Collections
          </span>
        </div>

        <a
          href="https://maps.google.com/?q=SS+Puram+Tumkur+Karnataka"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-md transition-all hover:scale-105"
        >
          <Navigation className="w-4 h-4" />
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
