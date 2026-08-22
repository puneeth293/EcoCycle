import React from 'react';
import { 
  Target, 
  Globe2, 
  Award, 
  Leaf,
  Sparkles
} from 'lucide-react';
import { EcoCycleVideoShowcase } from '../components/EcoCycleVideoShowcase';

export const AboutView: React.FC = () => {
  return (
    <div className="py-12 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 text-emerald-800 border border-white/80 text-xs font-black uppercase tracking-wider shadow-xs backdrop-blur-md">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>About EcoCycle Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white mt-3 leading-tight drop-shadow-md">
            Pioneering Digital Solutions for Municipal Waste Segregation
          </h1>
          <p className="text-base font-semibold text-emerald-50/90 mt-3 drop-shadow-xs">
            EcoCycle connects citizens, municipal authorities, and authorized recyclers into a single, unified circular economy platform.
          </p>
        </div>

        {/* Video Operational Workflow Showcase */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2 border border-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Operational Lifecycle In Motion</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
              The EcoCycle 4-Stage Operational System
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-emerald-50/90 mt-1 drop-shadow-xs">
              Watch how our smart municipal platform manages waste from doorstep segregation to clean industrial reuse.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <EcoCycleVideoShowcase />
          </div>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="glass-panel rounded-3xl p-8 shadow-2xl">
            <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-700 w-fit mb-4 shadow-xs">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#063B32] mb-2">Our Core Mission</h2>
            <p className="text-sm text-[#365A52] font-semibold leading-relaxed">
              To eliminate unsegregated waste dumping, educate households on scientific sorting, and optimize doorstep collection logistics to maximize material recovery across urban and rural municipalities.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-8 shadow-2xl">
            <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-700 w-fit mb-4 shadow-xs">
              <Globe2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#063B32] mb-2">Our Vision</h2>
            <p className="text-sm text-[#365A52] font-semibold leading-relaxed">
              A zero-landfill future where 100% of organic waste is composted locally, recyclable plastics and metals are continuously remanufactured, and e-waste is safely processed.
            </p>
          </div>

        </div>

        {/* The 3 R's Framework */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-black text-[#063B32]">The 3 R's Pillar Philosophy</h2>
            <p className="text-xs text-[#365A52] font-bold mt-1">
              Every action on EcoCycle aligns with international sustainable material management standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-subcard p-6 rounded-2xl border border-emerald-100 text-center shadow-xs">
              <div className="text-3xl mb-2">🔻</div>
              <h3 className="text-lg font-black text-[#063B32] mb-1">1. REDUCE</h3>
              <p className="text-xs text-[#365A52] font-semibold">
                Minimize single-use plastics, excessive packaging, and food waste at the consumer origin.
              </p>
            </div>

            <div className="glass-subcard p-6 rounded-2xl border border-emerald-100 text-center shadow-xs">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="text-lg font-black text-[#063B32] mb-1">2. REUSE</h3>
              <p className="text-xs text-[#365A52] font-semibold">
                Repurpose glass containers, cloth bags, and electronics before discarding into waste streams.
              </p>
            </div>

            <div className="glass-subcard p-6 rounded-2xl border border-emerald-100 text-center shadow-xs">
              <div className="text-3xl mb-2">♻️</div>
              <h3 className="text-lg font-black text-[#063B32] mb-1">3. RECYCLE</h3>
              <p className="text-xs text-[#365A52] font-semibold">
                Segregate clean dry materials into designated color bins for industrial re-processing.
              </p>
            </div>
          </div>
        </div>

        {/* Platform Architecture Note */}
        <div className="glass-panel rounded-3xl p-8 shadow-2xl max-w-3xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-[#063B32]">
            Built with Environmental Technology Standards
          </h3>
          <p className="text-xs text-[#365A52] font-semibold leading-relaxed">
            Designed and developed as an open-access environmental web utility. Integrated with Gemini AI for instant real-time material classification, React SPA routing, and local persistent logistics tracking.
          </p>
        </div>

      </div>
    </div>
  );
};
