import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { navigate, setSelectedSearchItem } = useApp();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSelectedSearchItem(searchInput.trim());
      navigate('segregation');
    }
  };

  const sampleQuickSearches = ['Plastic Bottle', 'Banana Peel', 'Old Mobile', 'Cardboard Box', 'Battery'];

  return (
    <div className="relative text-[#063B32] pt-8 pb-16 overflow-hidden min-h-[500px] flex items-center justify-center">
      {/* Main Content Layer */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 border border-white/70 text-[#063B32] text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md shadow-emerald-950/5">
          <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Smart AI Waste Segregation Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white font-sans drop-shadow-md">
          Sort Smart. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-green-100">
            Recycle Better.
          </span> <br />
          <span className="text-white">Build a Greener Tomorrow.</span>
        </h1>

        <p className="text-base sm:text-lg text-emerald-50/95 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
          EcoCycle helps you identify waste categories instantly, locate verified municipal recycling centers, schedule doorstep pickups, and earn rewards for sustainability.
        </p>

        {/* Quick Waste Lookup Input */}
        <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl mx-auto">
          <div className="relative flex items-center shadow-xl rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 p-2 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Search className="w-5 h-5 text-emerald-700 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="What item to segregate? (e.g. Battery, Cardboard)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent border-none text-[#063B32] placeholder-[#365A52]/70 text-sm sm:text-base px-3 py-2 focus:outline-none font-bold"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shrink-0 shadow-md shadow-emerald-600/25 transition-all transform hover:scale-[1.02]"
            >
              <span>Identify</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Sample Quick Search Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5 text-xs">
            <span className="font-black text-white drop-shadow-xs">Quick Check:</span>
            {sampleQuickSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSelectedSearchItem(item);
                  navigate('segregation');
                }}
                className="px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white text-[#063B32] border border-white/80 hover:border-emerald-400 transition-all shadow-sm font-bold backdrop-blur-md"
              >
                {item}
              </button>
            ))}
          </div>
        </form>

      </div>
    </div>
  );
};
