import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EnvironmentalReportRecord, ReportCategory } from '../types';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Leaf, 
  ArrowRight, 
  Trash2, 
  History, 
  Wind, 
  Droplets, 
  Sprout, 
  RotateCcw
} from 'lucide-react';

const SAMPLE_REPORTS = [
  {
    name: 'PET Beverage Bottle',
    type: 'waste' as ReportCategory,
    categoryName: 'Recyclable Waste',
    hint: 'PET plastic beverage bottle',
    url: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Organic Kitchen Peels',
    type: 'waste' as ReportCategory,
    categoryName: 'Wet Waste',
    hint: 'Banana peel and organic vegetable scraps',
    url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'E-Waste & Batteries',
    type: 'waste' as ReportCategory,
    categoryName: 'E-Waste',
    hint: 'Discarded mobile circuit and lithium battery',
    url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Industrial Smoke & Smog',
    type: 'air-pollution' as ReportCategory,
    categoryName: 'Air Pollution',
    hint: 'Dense smoke plume from factory chimney stack',
    url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Chemical Runoff in Lake',
    type: 'water-pollution' as ReportCategory,
    categoryName: 'Water Pollution',
    hint: 'Chemical foam and plastic trash choking municipal river',
    url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Illegal Landfill & Toxic Dump',
    type: 'soil-pollution' as ReportCategory,
    categoryName: 'Soil Pollution',
    hint: 'Open dumpsite with synthetic waste and leachate on soil',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
  }
];

export const UploadWasteView: React.FC = () => {
  const { awardPoints, addSegregationRecord, navigate, showToast } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('waste');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userNote, setUserNote] = useState('');
  const [locationText, setLocationText] = useState('Indiranagar, Bangalore (Ward 112)');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [reportResult, setReportResult] = useState<EnvironmentalReportRecord | null>(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const [historyFilter, setHistoryFilter] = useState<'all' | ReportCategory>('all');

  const [reportHistory, setReportHistory] = useState<EnvironmentalReportRecord[]>(() => {
    const saved = localStorage.getItem('ecocycle_environmental_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'rep-01',
        reportType: 'waste',
        imageUrl: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=600&auto=format&fit=crop&q=80',
        detectedTitle: 'Crushed PET Water Bottle',
        categoryOrDomain: 'Recyclable Waste',
        binColor: 'Blue',
        binName: 'Blue Bin 🔵',
        confidenceScore: 98,
        severityLevel: 'Low',
        conditionNotes: 'Rinsed clean and flattened properly.',
        actionSteps: ['Rinsed residue', 'Crushed flat', 'Placed in Blue Bin'],
        remedialAdvice: 'Converted into recycled polyester fibers for eco-clothing.',
        pointsAwarded: 40,
        co2SavedKg: 0.65,
        timestamp: '2026-08-14'
      },
      {
        id: 'rep-02',
        reportType: 'air-pollution',
        imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&auto=format&fit=crop&q=80',
        detectedTitle: 'Industrial Chimney Heavy Smoke Plume',
        categoryOrDomain: 'Air Pollution',
        confidenceScore: 96,
        severityLevel: 'Severe',
        sourceOfPollution: 'Unfiltered furnace chimney combustion',
        aqiImpact: 'Estimated AQI Spike: 290 (Very Unhealthy)',
        contaminantsIdentified: ['PM2.5', 'Sulfur Dioxide (SO2)', 'Carbon Monoxide'],
        conditionNotes: 'Dense soot plume reported near residential zone.',
        actionSteps: ['Wear N95 protective mask', 'Seal windows', 'CPCB grievance filed'],
        remedialAdvice: 'Wet scrubber installation mandatory under Clean Air regulations.',
        pointsAwarded: 60,
        co2SavedKg: 2.10,
        ticketId: 'CPCB-AIR-88219',
        timestamp: '2026-08-15'
      }
    ];
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    localStorage.setItem('ecocycle_environmental_reports', JSON.stringify(reportHistory));
  }, [reportHistory]);

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera access denied or unavailable. You can upload an image file instead.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setSelectedImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzePhoto = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setScanStep(1);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 600);

    try {
      const res = await fetch('/api/scan-environmental-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: selectedImage,
          category: selectedCategory,
          userNote: userNote,
          location: locationText
        })
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        throw new Error('Analysis request failed');
      }

      const data = await res.json();

      const newRecord: EnvironmentalReportRecord = {
        id: `rep-${Date.now()}`,
        reportType: data.reportType || selectedCategory,
        imageUrl: selectedImage,
        detectedTitle: data.detectedTitle || data.detectedItem || 'Environmental Incident / Waste Item',
        categoryOrDomain: data.categoryOrDomain || data.category || 'Environmental Report',
        binColor: data.binColor,
        binName: data.binName,
        confidenceScore: data.confidenceScore || 95,
        severityLevel: data.severityLevel || 'Moderate',
        sourceOfPollution: data.sourceOfPollution,
        aqiImpact: data.aqiImpact,
        contaminantsIdentified: data.contaminantsIdentified || [],
        conditionNotes: data.conditionNotes || 'Inspected by EcoCycle Vision AI.',
        actionSteps: data.actionSteps || ['Segregate properly', 'Dispose in appropriate stream'],
        remedialAdvice: data.remedialAdvice || data.recyclingAdvice || 'Proper environmental mitigation preserves natural resources.',
        pointsAwarded: data.pointsAwarded || 45,
        co2SavedKg: data.co2SavedKg || 0.8,
        ticketId: data.ticketId || `EC-TKT-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString().split('T')[0],
        location: locationText
      };

      setReportResult(newRecord);
      setReportHistory((prev) => [newRecord, ...prev]);

      awardPoints(newRecord.pointsAwarded, `Reported ${newRecord.detectedTitle} (${newRecord.categoryOrDomain})`);
      if (newRecord.reportType === 'waste') {
        addSegregationRecord(newRecord.detectedTitle, (newRecord.categoryOrDomain as any) || 'Recyclable Waste', newRecord.pointsAwarded);
      }

      showToast(`+${newRecord.pointsAwarded} Eco Points Awarded!`, 'success');

    } catch (err: any) {
      console.error('Scan error:', err);
      clearInterval(stepInterval);
      showToast('Vision scan failed. Please try another clear photograph.', 'error');
    } finally {
      setIsScanning(false);
      setScanStep(0);
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setReportResult(null);
    setUserNote('');
    stopCamera();
  };

  const filteredHistory = reportHistory.filter((item) => {
    if (historyFilter === 'all') return true;
    return item.reportType === historyFilter;
  });

  return (
    <div className="py-10 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 text-emerald-800 border border-white/80 text-xs font-black uppercase tracking-wider shadow-xs backdrop-blur-md">
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>AI Environmental Vision & Rewards Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-3 font-sans tracking-tight drop-shadow-md">
            Upload Waste & Report Pollution
          </h1>

          <p className="text-base font-semibold text-emerald-50/90 mt-2 max-w-2xl mx-auto leading-relaxed drop-shadow-xs">
            Upload or snap photographs of your <strong>segregated waste</strong> or flag <strong>Air, Water, and Soil pollution</strong> in your neighborhood. AI vision verifies your submission and awards <strong className="text-white underline decoration-emerald-400 font-black">+35 to +75 Eco Points</strong>!
          </p>

          {/* Mode Selector Tabs: White Glass */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('waste')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border ${
                selectedCategory === 'waste'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-white/85 text-[#063B32] border-white/80 hover:bg-white backdrop-blur-md'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>🗑️ Solid Waste & Recycling</span>
            </button>

            <button
              onClick={() => setSelectedCategory('air-pollution')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border ${
                selectedCategory === 'air-pollution'
                  ? 'bg-sky-600 text-white border-sky-500 shadow-md'
                  : 'bg-white/85 text-[#063B32] border-white/80 hover:bg-white backdrop-blur-md'
              }`}
            >
              <Wind className="w-4 h-4" />
              <span>💨 Air Pollution</span>
            </button>

            <button
              onClick={() => setSelectedCategory('water-pollution')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border ${
                selectedCategory === 'water-pollution'
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                  : 'bg-white/85 text-[#063B32] border-white/80 hover:bg-white backdrop-blur-md'
              }`}
            >
              <Droplets className="w-4 h-4" />
              <span>🌊 Water Pollution</span>
            </button>

            <button
              onClick={() => setSelectedCategory('soil-pollution')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border ${
                selectedCategory === 'soil-pollution'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                  : 'bg-white/85 text-[#063B32] border-white/80 hover:bg-white backdrop-blur-md'
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>🌱 Soil & Land Pollution</span>
            </button>
          </div>
        </div>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Image Upload & Live Camera Zone */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl">
              
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-[#063B32] flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-600" />
                  <span>
                    {selectedCategory === 'waste' && 'Upload Segregated Waste Photo'}
                    {selectedCategory === 'air-pollution' && 'Report Air Pollution & Smoke'}
                    {selectedCategory === 'water-pollution' && 'Report River / Lake Water Pollution'}
                    {selectedCategory === 'soil-pollution' && 'Report Soil & Dumpsite Contamination'}
                  </span>
                </h2>
                
                {selectedImage && (
                  <button
                    onClick={resetScanner}
                    className="text-xs font-bold text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Upload Drop Zone / Camera Display */}
              {!selectedImage && !isCameraActive && (
                <div className="border-2 border-dashed border-emerald-300 rounded-3xl p-8 text-center bg-white/60 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
                    <Upload className="w-8 h-8" />
                  </div>
                  
                  <div>
                    <p className="text-sm font-black text-[#063B32]">
                      Drag & Drop photo here or select an option
                    </p>
                    <p className="text-xs text-[#365A52] font-semibold mt-1">
                      Supports JPG, PNG, WebP up to 10MB
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-transform active:scale-95 flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose File</span>
                    </button>

                    <button
                      onClick={startCamera}
                      className="px-5 py-2.5 rounded-2xl bg-[#063B32] hover:bg-[#063B32]/90 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Live Photo</span>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* Live Camera View */}
              {isCameraActive && (
                <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-emerald-500 shadow-2xl">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-4 flex justify-center items-center gap-4">
                    <button
                      onClick={capturePhoto}
                      className="w-14 h-14 rounded-full bg-white text-emerald-900 flex items-center justify-center shadow-2xl border-4 border-emerald-500 hover:scale-105 transition-transform"
                    >
                      <Camera className="w-6 h-6" />
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2 rounded-xl bg-slate-900/80 text-white text-xs font-bold hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Selected Image Preview & Controls */}
              {selectedImage && (
                <div className="space-y-4">
                  <div className="relative rounded-3xl overflow-hidden border border-emerald-200 max-h-96 bg-black flex items-center justify-center">
                    <img
                      src={selectedImage}
                      alt="Selected upload"
                      className="max-h-96 w-full object-contain"
                    />

                    {isScanning && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center animate-pulse">
                          <Sparkles className="w-7 h-7 text-emerald-300 animate-spin" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-black">AI Multimodal Vision Inspector</h3>
                          <p className="text-xs text-emerald-300 font-mono">
                            {scanStep === 1 && 'Extracting visual textures & contamination index...'}
                            {scanStep === 2 && 'Detecting pollutants & material classification...'}
                            {scanStep === 3 && 'Evaluating AQI / Toxicity & bin segregation...'}
                            {scanStep >= 4 && 'Generating municipal report & eco rewards...'}
                          </p>
                        </div>
                        <div className="w-48 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full transition-all duration-300"
                            style={{ width: `${(scanStep / 4) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes & Location Input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black text-[#063B32] uppercase tracking-wider mb-1">
                        Optional Details / Notes:
                      </label>
                      <input
                        type="text"
                        value={userNote}
                        onChange={(e) => setUserNote(e.target.value)}
                        placeholder="e.g. Clean bottle, or chimney smoke near school..."
                        className="w-full px-4 py-2.5 rounded-2xl bg-white border border-emerald-200 text-[#063B32] placeholder-[#365A52]/60 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-[#063B32] uppercase tracking-wider mb-1">
                        Incident Location / Ward:
                      </label>
                      <input
                        type="text"
                        value={locationText}
                        onChange={(e) => setLocationText(e.target.value)}
                        placeholder="e.g. Ward 112, Indiranagar..."
                        className="w-full px-4 py-2.5 rounded-2xl bg-white border border-emerald-200 text-[#063B32] placeholder-[#365A52]/60 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Scan & Reward Button */}
                  <button
                    disabled={isScanning}
                    onClick={handleAnalyzePhoto}
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                    <span>Analyze Photo & Claim Eco Rewards</span>
                  </button>
                </div>
              )}

              {/* Sample Photo Presets for Quick Testing */}
              <div className="mt-8 pt-6 border-t border-emerald-100">
                <p className="text-xs font-black text-[#063B32] uppercase tracking-wider mb-3">
                  Or Test with Real Sample Photos (1-Click):
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SAMPLE_REPORTS.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(sample.url);
                        setSelectedCategory(sample.type);
                        setUserNote(sample.hint);
                      }}
                      className="group relative rounded-2xl overflow-hidden border border-emerald-100 text-left hover:border-emerald-500 transition-all hover:scale-[1.02] shadow-xs"
                    >
                      <img
                        src={sample.url}
                        alt={sample.name}
                        className="h-20 w-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent p-2 flex flex-col justify-end">
                        <span className="text-[10px] font-black text-emerald-300 leading-tight truncate">
                          {sample.name}
                        </span>
                        <span className="text-[9px] text-slate-300 truncate">
                          {sample.categoryName}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: AI Analysis Results Card (White Glass) */}
          <div className="lg:col-span-5 space-y-6">
            
            {reportResult ? (
              <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 animate-in fade-in duration-300 border-2 border-emerald-400">
                
                {/* Reward Celebration Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white text-emerald-700 flex items-center justify-center text-2xl font-black shadow-md">
                      ✓
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">
                        {reportResult.reportType === 'waste' ? 'Segregation Verified' : 'Pollution Hazard Flagged'}
                      </span>
                      <h3 className="text-xl font-black font-mono">
                        +{reportResult.pointsAwarded} Eco Points
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full text-white">
                      {reportResult.confidenceScore}% AI Match
                    </span>
                  </div>
                </div>

                {/* Detected Item & Classification */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {reportResult.categoryOrDomain}
                      </span>

                      {reportResult.severityLevel && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          reportResult.severityLevel === 'Hazardous' || reportResult.severityLevel === 'Severe'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          Severity: {reportResult.severityLevel}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-black text-[#063B32] mt-1.5">
                      {reportResult.detectedTitle}
                    </h2>

                    {reportResult.ticketId && (
                      <p className="text-xs font-mono text-[#365A52] font-semibold mt-0.5">
                        Grievance Ticket: <strong className="text-emerald-700">{reportResult.ticketId}</strong>
                      </p>
                    )}
                  </div>

                  {/* Bin Assignment */}
                  {reportResult.reportType === 'waste' && reportResult.binName ? (
                    <div className="p-4 rounded-2xl glass-subcard border border-emerald-100 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black text-[#365A52] uppercase">
                          Correct Municipal Bin:
                        </span>
                        <div className="text-base font-black text-[#063B32]">
                          {reportResult.binName}
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg shadow-xs">
                        ♻️
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Environmental Hazard Metric:
                        </span>
                        <span className="text-xs font-black text-amber-400 font-mono">
                          {reportResult.aqiImpact || 'High Chemical Contamination'}
                        </span>
                      </div>
                      {reportResult.sourceOfPollution && (
                        <p className="text-xs text-slate-300">
                          <strong>Source:</strong> {reportResult.sourceOfPollution}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Steps */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-[#063B32] uppercase tracking-wider">
                      Immediate Action & Safety Protocol:
                    </span>
                    <div className="space-y-1.5">
                      {reportResult.actionSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#365A52] font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Remedial Advice */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Remedial & Upcycling Insight</span>
                    </span>
                    <p className="text-xs text-amber-950 font-medium">
                      {reportResult.remedialAdvice}
                    </p>
                  </div>

                  {/* Environmental Savings Metric */}
                  {reportResult.co2SavedKg && (
                    <div className="p-3.5 rounded-2xl glass-subcard border border-emerald-100 flex items-center justify-between text-xs font-black text-emerald-800">
                      <span className="flex items-center gap-1.5">
                        <Leaf className="w-4 h-4 text-emerald-600" />
                        <span>Carbon Impact Mitigated:</span>
                      </span>
                      <span className="font-mono font-black text-emerald-700">
                        ~{reportResult.co2SavedKg} kg CO2e
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={resetScanner}
                      className="flex-1 py-3 rounded-2xl bg-[#063B32] text-white font-bold text-xs hover:bg-[#063B32]/90 transition-colors"
                    >
                      Scan Another
                    </button>
                    <button
                      onClick={() => navigate('electricity-bill')}
                      className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors flex items-center gap-1.5 shadow-md"
                    >
                      <span>Pay Bill & Save</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            ) : (
              /* Waiting / Instructions Card (White Glass) */
              <div className="glass-panel rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
                
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-3xl font-black shadow-xs">
                  🌱
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                  <h3 className="text-lg font-black text-[#063B32]">
                    Instant Rewards for Environmental Action
                  </h3>
                  <p className="text-xs text-[#365A52] font-semibold leading-relaxed">
                    Upload photos of segregated dry, wet, or electronic waste to verify your recycling habit, or photograph community pollution hotspots (air smoke, river froth, soil dumping) to earn points and alert authorities.
                  </p>
                </div>

                {/* 4 Pillars Summary */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-3.5 rounded-2xl glass-subcard border border-emerald-100 space-y-1">
                    <span className="text-xs font-black text-[#063B32] block">🗑️ Waste Sorting</span>
                    <p className="text-[11px] text-[#365A52] font-semibold">Earn +35 to +50 pts per segregated photo.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl glass-subcard border border-emerald-100 space-y-1">
                    <span className="text-xs font-black text-[#063B32] block">💨 Air Pollution</span>
                    <p className="text-[11px] text-[#365A52] font-semibold">Flag smoke plumes & get CPCB tickets.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl glass-subcard border border-emerald-100 space-y-1">
                    <span className="text-xs font-black text-[#063B32] block">🌊 Water Pollution</span>
                    <p className="text-[11px] text-[#365A52] font-semibold">Report toxic chemical froth in lakes.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl glass-subcard border border-emerald-100 space-y-1">
                    <span className="text-xs font-black text-[#063B32] block">🌱 Soil Dump</span>
                    <p className="text-[11px] text-[#365A52] font-semibold">Report unauthorized dumpsites.</p>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* History of Reports Section: White Glass Panel */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-[#063B32] flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                <span>Your Environmental Verification & Report Log</span>
              </h2>
              <p className="text-xs text-[#365A52] font-semibold">
                All photos inspected and rewarded by EcoCycle AI
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setHistoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                  historyFilter === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-[#063B32] border border-emerald-100'
                }`}
              >
                All ({reportHistory.length})
              </button>
              <button
                onClick={() => setHistoryFilter('waste')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                  historyFilter === 'waste'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-[#063B32] border border-emerald-100'
                }`}
              >
                🗑️ Waste
              </button>
              <button
                onClick={() => setHistoryFilter('air-pollution')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                  historyFilter === 'air-pollution'
                    ? 'bg-sky-600 text-white'
                    : 'bg-white text-[#063B32] border border-emerald-100'
                }`}
              >
                💨 Air
              </button>
              <button
                onClick={() => setHistoryFilter('water-pollution')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                  historyFilter === 'water-pollution'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white text-[#063B32] border border-emerald-100'
                }`}
              >
                🌊 Water
              </button>
              <button
                onClick={() => setHistoryFilter('soil-pollution')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                  historyFilter === 'soil-pollution'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-[#063B32] border border-emerald-100'
                }`}
              >
                🌱 Soil
              </button>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-10 text-[#365A52] text-xs font-semibold">
              No reports in this category yet. Upload a photo above to log your first verified submission!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="glass-card glass-card-hover rounded-2xl border border-white/80 overflow-hidden flex flex-col justify-between shadow-md"
                >
                  <div className="relative h-36 bg-black">
                    <img
                      src={item.imageUrl}
                      alt={item.detectedTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-xs">
                      +{item.pointsAwarded} Pts
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono">
                      {item.categoryOrDomain}
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-[#063B32] line-clamp-1">
                        {item.detectedTitle}
                      </h4>
                      <p className="text-[11px] text-[#365A52] font-medium line-clamp-2 mt-0.5">
                        {item.conditionNotes}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[10px] text-[#365A52] font-mono">
                      <span>{item.timestamp}</span>
                      {item.ticketId && <span>{item.ticketId}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
