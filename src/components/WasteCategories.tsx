import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORY_DETAILS } from '../data/wasteData';
import { WasteCategoryType } from '../types';
import { Apple, FileText, Recycle, AlertTriangle, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';

export const WasteCategories: React.FC = () => {
  const { navigate, setSelectedSearchItem } = useApp();

  const iconMap: Record<WasteCategoryType, any> = {
    'Wet Waste': Apple,
    'Dry Waste': FileText,
    'Recyclable Waste': Recycle,
    'Hazardous Waste': AlertTriangle,
    'E-Waste': Smartphone,
  };

  const categories = Object.values(CATEGORY_DETAILS);

  const handleCategoryClick = (type: WasteCategoryType) => {
    setSelectedSearchItem(type);
    navigate('segregation');
  };

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/85 text-emerald-800 border border-white/80 shadow-xs backdrop-blur-md">
              Waste Stream Classification
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-md mt-2">
              Primary Waste Categories
            </h2>
            <p className="text-sm font-semibold text-emerald-50/90 mt-1 max-w-xl drop-shadow-xs">
              Proper segregation at source is the most vital step in environmental material recovery.
            </p>
          </div>

          <button
            onClick={() => navigate('segregation')}
            className="self-start md:self-auto px-5 py-2.5 rounded-2xl bg-white/85 hover:bg-white text-[#063B32] font-black text-xs flex items-center gap-2 transition-all border border-white/80 shadow-md backdrop-blur-md hover:border-emerald-300"
          >
            <span>Explore All Items Database</span>
            <ArrowRight className="w-4 h-4 text-emerald-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const IconComp = iconMap[cat.type];
            return (
              <div
                key={cat.type}
                className="glass-card glass-card-hover rounded-3xl p-6 shadow-xl shadow-emerald-950/5 border border-white/80 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:scale-110 transition-transform shadow-xs">
                      <IconComp className="w-7 h-7 stroke-[2.2]" />
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-xs border border-white/60"
                      style={{ backgroundColor: `${cat.binColor}18`, color: cat.binColor }}
                    >
                      {cat.binName}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#063B32] mb-1.5">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-[#365A52] font-semibold mb-4 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="space-y-1.5 mb-6 glass-subcard p-3.5 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">
                      Key Examples:
                    </p>
                    <ul className="space-y-1.5 pt-1">
                      {cat.examples.slice(0, 4).map((ex, idx) => (
                        <li key={idx} className="text-xs font-bold text-[#063B32] flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => handleCategoryClick(cat.type)}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                >
                  <span>Learn More & Filter Items</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
