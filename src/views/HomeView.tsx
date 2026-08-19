import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { StatsSection } from '../components/StatsSection';
import { WasteCategories } from '../components/WasteCategories';
import { BinGuide } from '../components/BinGuide';
import { useApp } from '../context/AppContext';
import { Award } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="space-y-0 relative z-10">
      <HeroSection />
      
      <StatsSection />
      <WasteCategories />
      <BinGuide />

      {/* How EcoCycle Works Workflow Section: White Glass Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Glass Panel (7 cols) */}
            <div className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col justify-between">
              <div>
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                  Simple 3-Step Workflow
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#063B32] mt-3 leading-tight">
                  How You Can Make an Immediate Difference Today
                </h2>
                <p className="text-sm font-semibold text-[#365A52] mt-2">
                  Joining the EcoCycle platform takes less than 2 minutes and rewards every sustainable action.
                </p>

                <div className="space-y-4 mt-8">
                  <div className="flex items-start gap-4 glass-subcard p-4 rounded-2xl border border-emerald-100">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 shadow-md">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#063B32]">Identify & Segregate</h4>
                      <p className="text-xs text-[#365A52] font-semibold mt-0.5">Use our Smart Waste Assistant or search database to classify item bin colors accurately.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 glass-subcard p-4 rounded-2xl border border-emerald-100">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 shadow-md">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#063B32]">Book Doorstep Pickup or Drop Off</h4>
                      <p className="text-xs text-[#365A52] font-semibold mt-0.5">Schedule convenient collection for dry recyclables and E-waste, or visit local recycling centers.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 glass-subcard p-4 rounded-2xl border border-emerald-100">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 shadow-md">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#063B32]">Upload Waste & Pay Electricity Bills</h4>
                      <p className="text-xs text-[#365A52] font-semibold mt-0.5">Upload photos of waste or report pollution hotspots to earn points, then redeem your points for direct discounts on your power bills!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Rewards Glass Panel (5 cols) */}
            <div className="lg:col-span-5 glass-panel p-8 rounded-3xl shadow-2xl flex flex-col justify-center text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center mx-auto text-white font-black shadow-lg shadow-amber-500/20">
                <Award className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#063B32]">Ready to Earn Eco Rewards?</h3>
                <p className="text-xs text-[#365A52] font-semibold mt-1">
                  Upload waste photos, report air/water/soil pollution, and save directly on your electricity bills.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => navigate('upload-waste')}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all"
                >
                  📸 Upload Waste (+50 Pts)
                </button>
                <button
                  onClick={() => navigate('electricity-bill')}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-white/90 hover:bg-white text-[#063B32] border border-emerald-200 font-black text-xs transition-all shadow-sm"
                >
                  ⚡ Pay Electricity Bill
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
