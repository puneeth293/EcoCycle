import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_WASTE_ITEMS, CATEGORY_DETAILS } from '../data/wasteData';
import { 
  Search, 
  Sparkles, 
  Recycle, 
  CheckCircle2, 
  Award, 
  Filter, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Video,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { EcoCycleVideoShowcase } from '../components/EcoCycleVideoShowcase';

export const SegregationView: React.FC = () => {
  const { selectedSearchItem, setSelectedSearchItem, addSegregationRecord, setActiveWasteItemModal } = useApp();
  
  const [queryItem, setQueryItem] = useState(selectedSearchItem || '');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [loadingAi, setLoadingAi] = useState(false);
  const [showVideoGuide, setShowVideoGuide] = useState(false);
  
  // Active classification output
  const [classificationResult, setClassificationResult] = useState<any | null>(null);

  useEffect(() => {
    if (selectedSearchItem) {
      setQueryItem(selectedSearchItem);
      handleClassifyItem(selectedSearchItem);
    }
  }, [selectedSearchItem]);

  const handleClassifyItem = async (itemName: string) => {
    const term = itemName.trim();
    if (!term) return;

    setLoadingAi(true);

    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: term })
      });

      if (res.ok) {
        const data = await res.json();
        setClassificationResult(data);
      } else {
        throw new Error('Fallback to client lookup');
      }
    } catch (err) {
      console.log('Using local matching fallback:', err);
      const matched = INITIAL_WASTE_ITEMS.find((w) => w.name.toLowerCase().includes(term.toLowerCase()));
      if (matched) {
        setClassificationResult({
          itemName: matched.name,
          category: matched.category,
          binColor: matched.binColor,
          binName: matched.binName,
          actionSteps: matched.actionSteps,
          recyclingTip: matched.recyclingTip,
          ecoPoints: matched.ecoPoints,
          environmentalImpact: matched.environmentalImpact,
          source: 'local'
        });
      } else {
        setClassificationResult({
          itemName: term,
          category: 'Recyclable Waste',
          binColor: 'Blue',
          binName: 'Blue Bin 🔵',
          actionSteps: [
            'Rinse and dry the item if needed.',
            'Check for recyclable resin code symbol or metal composition.',
            'Place in the dry recyclable collection stream.'
          ],
          recyclingTip: 'Keeping recyclables clean prevents contamination of entire collection batches.',
          ecoPoints: 15,
          environmentalImpact: 'Diverts solid materials from landfills into energy-efficient remanufacturing.',
          source: 'local'
        });
      }
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryItem) {
      handleClassifyItem(queryItem);
    }
  };

  const handleLogPoints = () => {
    if (classificationResult) {
      addSegregationRecord(
        classificationResult.itemName,
        classificationResult.category,
        classificationResult.ecoPoints || 15
      );
    }
  };

  // Filter local waste database items
  const filteredDatabaseItems = INITIAL_WASTE_ITEMS.filter((item) => {
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(queryItem.toLowerCase()) ||
      item.examples.some((ex) => ex.toLowerCase().includes(queryItem.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sampleQuickButtons = [
    'Plastic Bottle',
    'Banana Peel',
    'Newspaper',
    'Glass Bottle',
    'Battery',
    'Mobile Phone',
    'Food Leftovers',
    'Cardboard',
    'Metal Can'
  ];

  return (
    <div className="py-12 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/85 text-emerald-800 border border-white/80 shadow-xs backdrop-blur-md">
            Smart Waste Segregation Assistant
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-md mt-2.5">
            Identify Waste & Find Recommended Bin
          </h1>
          <p className="text-sm font-semibold text-emerald-50/90 mt-1.5 drop-shadow-xs">
            Enter any household item to get real-time categorization, color-coded bin recommendations, preparation steps, and eco-points!
          </p>

          {/* Quick Action to Open Video Showcase */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowVideoGuide(!showVideoGuide)}
              className="px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-[#063B32] font-black text-xs flex items-center gap-2 shadow-lg border border-white/80 backdrop-blur-md transition-all hover:scale-105"
            >
              <Video className="w-4 h-4 text-emerald-600" />
              <span>{showVideoGuide ? 'Hide 4-Stage Lifecycle Video' : 'Watch 4-Stage EcoCycle Video (Segregate • Collect • Recycle • Reuse)'}</span>
              {showVideoGuide ? <ChevronUp className="w-3.5 h-3.5 text-emerald-600" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          </div>
        </div>

        {/* Collapsible Video Showcase */}
        {showVideoGuide && (
          <div className="max-w-5xl mx-auto mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
            <EcoCycleVideoShowcase />
          </div>
        )}

        {/* Assistant Input Form Card: White Glass Panel */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto mb-12">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-black text-[#063B32]">
              Enter or Select Waste Item:
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-emerald-600 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Plastic Bottle, Battery, Food scraps..."
                  value={queryItem}
                  onChange={(e) => {
                    setQueryItem(e.target.value);
                    setSelectedSearchItem(e.target.value);
                  }}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-emerald-200 text-[#063B32] placeholder-[#365A52]/60 font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={loadingAi || !queryItem.trim()}
                className="py-3 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
              >
                {loadingAi ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Check Waste Type</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Sample Items */}
            <div className="pt-2">
              <p className="text-xs font-black text-[#365A52] mb-2">
                Quick Check Sample Items:
              </p>
              <div className="flex flex-wrap gap-2">
                {sampleQuickButtons.map((btn) => (
                  <button
                    key={btn}
                    type="button"
                    onClick={() => {
                      setQueryItem(btn);
                      handleClassifyItem(btn);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-[#063B32] hover:bg-emerald-100 border border-emerald-200 shadow-xs transition-all"
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Classification Result Display */}
          {classificationResult && (
            <div className="mt-8 pt-8 border-t border-emerald-100 space-y-6 animate-in fade-in duration-300">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between glass-subcard p-5 rounded-2xl border border-emerald-100 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Result
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">
                      Source: {classificationResult.source === 'gemini' ? 'Gemini AI Engine ⚡' : 'Verified Database'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#063B32] mt-1.5">
                    {classificationResult.itemName}
                  </h3>
                </div>

                <div className="text-left sm:text-right bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs">
                  <p className="text-xs text-[#365A52] font-bold">Waste Category:</p>
                  <p className="text-base font-black text-emerald-700">
                    {classificationResult.category} ♻️
                  </p>
                  <p className="text-sm font-bold text-[#063B32] mt-0.5">
                    Recommended: <span className="text-emerald-600 font-black">{classificationResult.binName}</span>
                  </p>
                </div>
              </div>

              {/* Action Steps & Tip */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-subcard p-5 rounded-2xl border border-emerald-100">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Recommended Segregation Action
                  </h4>
                  <ul className="space-y-2 text-xs text-[#365A52] font-semibold">
                    {classificationResult.actionSteps?.map((step: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-subcard p-5 rounded-2xl border border-amber-200 bg-amber-50/70">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 mb-2.5 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    Recycling & Environmental Tip
                  </h4>
                  <p className="text-xs text-amber-900 font-semibold leading-relaxed">
                    {classificationResult.recyclingTip}
                  </p>
                  <p className="text-xs text-[#365A52] font-semibold mt-3 pt-2 border-t border-amber-200/60">
                    <strong className="text-[#063B32]">Environmental Impact:</strong> {classificationResult.environmentalImpact}
                  </p>
                </div>
              </div>

              {/* Award button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleLogPoints}
                  className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md flex items-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Log to History & Claim +{classificationResult.ecoPoints || 15} Eco Points</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Searchable Waste Database Section: White Glass Panel */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#063B32]">
                Searchable Waste Items Database
              </h2>
              <p className="text-xs font-semibold text-[#365A52]">
                Browse our verified database of common household items and materials.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-black text-[#063B32] mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filter:
              </span>
              {['ALL', 'Wet Waste', 'Dry Waste', 'Recyclable Waste', 'Hazardous Waste', 'E-Waste'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    categoryFilter === cat
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/80 text-[#063B32] hover:bg-white border border-emerald-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Database Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDatabaseItems.map((item) => {
              const catInfo = CATEGORY_DETAILS[item.category];
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveWasteItemModal(item.id)}
                  className="glass-card glass-card-hover p-4.5 rounded-2xl border border-white/80 hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${catInfo.badgeBg} ${catInfo.badgeText}`}>
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        {item.binName}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-[#063B32] group-hover:text-emerald-600 transition-colors">
                      {item.name}
                    </h4>

                    <p className="text-xs text-[#365A52] font-semibold line-clamp-2 mt-1">
                      {item.recyclingTip}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span className="font-black">+{item.ecoPoints} Points</span>
                    <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDatabaseItems.length === 0 && (
            <div className="text-center py-12">
              <Recycle className="w-12 h-12 text-emerald-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-[#063B32]">No matching waste items found.</p>
              <p className="text-xs text-[#365A52] mt-1">Try entering the item name above to run the AI classifier!</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
