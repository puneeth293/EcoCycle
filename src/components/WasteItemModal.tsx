import React from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_WASTE_ITEMS, CATEGORY_DETAILS } from '../data/wasteData';
import { X, CheckCircle2, Recycle, Award, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

export const WasteItemModal: React.FC = () => {
  const { activeWasteItemModal, setActiveWasteItemModal, addSegregationRecord } = useApp();

  if (!activeWasteItemModal) return null;

  const item = INITIAL_WASTE_ITEMS.find((w) => w.id === activeWasteItemModal) || INITIAL_WASTE_ITEMS[0];
  const catDetails = CATEGORY_DETAILS[item.category];

  const handleLogSegregation = () => {
    addSegregationRecord(item.name, item.category, item.ecoPoints);
    setActiveWasteItemModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={() => setActiveWasteItemModal(null)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-emerald-900/60 text-slate-600 dark:text-emerald-300 hover:bg-slate-200 dark:hover:bg-emerald-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-4 rounded-2xl ${catDetails.badgeBg} ${catDetails.badgeText} border ${catDetails.cardBorder}`}>
            <Recycle className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-1.5" style={{ backgroundColor: `${catDetails.binColor}20`, color: catDetails.binColor }}>
              {item.category}
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{item.name}</h2>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Recommended: {item.binName}</p>
          </div>
        </div>

        {/* Grid info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/40 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Action Steps
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-emerald-200 font-medium">
              {item.actionSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-800/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              Recycling Tip
            </h4>
            <p className="text-xs text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
              {item.recyclingTip}
            </p>
            <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
              <span>Eco Points Reward:</span>
              <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-900 rounded-lg">+{item.ecoPoints} Points</span>
            </div>
          </div>
        </div>

        {/* Environmental Impact Banner */}
        <div className="bg-slate-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-slate-200 dark:border-emerald-800/60 mb-6">
          <p className="text-xs font-bold text-slate-500 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-500" />
            Environmental Impact
          </p>
          <p className="text-xs font-medium text-slate-700 dark:text-emerald-200">
            {item.environmentalImpact}
          </p>
        </div>

        {/* Notice */}
        <p className="text-[11px] text-slate-500 dark:text-emerald-400 mb-6 italic">
          * Note: Municipal bin color schemes may vary slightly depending on your local city authority guidelines. Always follow local municipal notices.
        </p>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogSegregation}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 hover:from-emerald-500 hover:to-green-500 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            Log as Segregated (+{item.ecoPoints} Points)
          </button>
          <button
            onClick={() => setActiveWasteItemModal(null)}
            className="py-3 px-5 rounded-2xl bg-slate-100 dark:bg-emerald-900/60 text-slate-700 dark:text-emerald-200 font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
