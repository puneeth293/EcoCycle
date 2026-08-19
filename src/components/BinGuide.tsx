import React from 'react';
import { Info } from 'lucide-react';

export const BinGuide: React.FC = () => {
  const bins = [
    {
      colorName: 'Green Bin 🟢',
      colorCode: '#22C55E',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      title: 'Wet / Organic Waste',
      desc: 'Biodegradable kitchen food scraps, vegetable & fruit peels, tea bags, garden leaves.',
      doText: 'Keep free from plastic wrap or aluminum foil. Suitable for home or municipal composting.'
    },
    {
      colorName: 'Blue Bin 🔵',
      colorCode: '#3B82F6',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
      title: 'Dry / Recyclable Waste',
      desc: 'Paper, cardboard shipping boxes, clean plastic packaging, PET bottles, glass jars, metal cans.',
      doText: 'Empty liquids and rinse food grease. Flatten cardboard boxes to save collection volume.'
    },
    {
      colorName: 'Red Bin 🔴',
      colorCode: '#EF4444',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
      title: 'Hazardous Waste',
      desc: 'Batteries, paint cans, chemicals, expired medicines, syringes, fluorescent lightbulbs.',
      doText: 'Seal in leak-proof containers. Hand over to authorized hazardous collection agents.'
    },
    {
      colorName: 'Black Bin ⚫',
      colorCode: '#1F2937',
      badgeBg: 'bg-slate-200 text-slate-900 border-slate-400',
      title: 'General / Non-Recyclable Waste',
      desc: 'Soiled napkins, sanitary waste, inert dust, heavily contaminated multi-layer plastic wrappers.',
      doText: 'Wrap sanitary items securely in paper. Sent to waste-to-energy or sanitary landfill.'
    },
    {
      colorName: 'Yellow Bin 🟡',
      colorCode: '#EAB308',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      title: 'E-Waste & Electronics',
      desc: 'Old smartphones, computer parts, charging cables, power adapters, circuit boards.',
      doText: 'Wipe personal data. Book an EcoCycle E-Waste pickup or drop at certified recycling kiosks.'
    }
  ];

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/85 text-emerald-800 border border-white/80 shadow-xs backdrop-blur-md">
            Color-Coded Sorting Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-md mt-2">
            Color-Coded Bin Reference Guide
          </h2>
          <p className="text-sm font-semibold text-emerald-50/90 mt-1 drop-shadow-xs">
            Understanding standard bin colors ensures clean material streams at recovery facilities.
          </p>
        </div>

        {/* Disclaimer Notice Box: White Glass */}
        <div className="glass-panel p-4.5 rounded-3xl mb-8 flex items-start gap-3.5 max-w-3xl mx-auto shadow-lg border border-amber-200/80 bg-amber-50/80">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs text-[#063B32] font-semibold leading-relaxed">
            <strong className="font-black text-[#063B32]">Important Notice:</strong> Actual bin color codes and municipal labels can vary depending on local city authorities, state pollution control boards, or private housing society standards. Always check and follow your local municipal guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bins.map((bin, idx) => (
            <div
              key={idx}
              className="glass-card glass-card-hover p-6 rounded-3xl border border-white/80 shadow-xl shadow-emerald-950/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide border shadow-xs ${bin.badgeBg}`}>
                    {bin.colorName}
                  </span>
                  <span
                    className="w-4 h-4 rounded-full shadow-inner border border-white"
                    style={{ backgroundColor: bin.colorCode }}
                  />
                </div>

                <h3 className="text-lg font-black text-[#063B32] mb-1.5">
                  {bin.title}
                </h3>

                <p className="text-xs text-[#365A52] font-semibold mb-4 leading-relaxed">
                  {bin.desc}
                </p>
              </div>

              <div className="glass-subcard p-3.5 rounded-2xl border border-emerald-100 text-[11px] text-[#063B32] font-medium">
                <span className="font-black text-emerald-800 block mb-0.5">Best Practice:</span>
                <span className="text-[#365A52] font-semibold">{bin.doText}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
