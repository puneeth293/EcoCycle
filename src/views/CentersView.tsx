import React, { useState } from 'react';
import { COLLECTION_CENTERS } from '../data/centersData';
import { CollectionCenter, WasteCategoryType } from '../types';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation, 
  Search, 
  ExternalLink, 
  Building2 
} from 'lucide-react';

export const CentersView: React.FC = () => {
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [activeCenter, setActiveCenter] = useState<CollectionCenter>(COLLECTION_CENTERS[0]);

  const filteredCenters = COLLECTION_CENTERS.filter((center) => {
    const matchesCity = cityFilter === 'ALL' || center.city.toLowerCase() === cityFilter.toLowerCase();
    const matchesType = typeFilter === 'ALL' || center.acceptedTypes.includes(typeFilter as WasteCategoryType);
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCity && matchesType && matchesSearch;
  });

  return (
    <div className="py-12 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 text-emerald-800 border border-white/80 text-xs font-black uppercase tracking-wider shadow-xs backdrop-blur-md">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Recycling Infrastructure Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-3 font-sans tracking-tight drop-shadow-md">
            Find Nearby Collection Centers
          </h1>
          <p className="text-base font-semibold text-emerald-50/90 mt-2 max-w-2xl mx-auto leading-relaxed drop-shadow-xs">
            Locate authorized municipal material recovery facilities, drop-off kiosks, e-waste drop points, and composting yards across your city.
          </p>
        </div>

        {/* Search & Filter Bar (White Glass) */}
        <div className="glass-panel rounded-3xl p-6 shadow-2xl mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-4 items-center">
            
            {/* Search input */}
            <div className="lg:col-span-5 relative">
              <Search className="w-5 h-5 text-emerald-600 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search center name, area or landmark..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-emerald-200 text-[#063B32] placeholder-[#365A52]/60 font-semibold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* City Filter */}
            <div className="lg:col-span-3">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-emerald-200 text-[#063B32] font-black text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="ALL">All Cities (Tumkur, Bengaluru, Mysuru)</option>
                <option value="Tumkur">Tumkur City</option>
                <option value="Bengaluru">Bengaluru Metro</option>
                <option value="Mysuru">Mysuru City</option>
              </select>
            </div>

            {/* Waste Type Filter */}
            <div className="lg:col-span-4">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-emerald-200 text-[#063B32] font-black text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="ALL">All Accepted Waste Types</option>
                <option value="Wet Waste">Wet Waste / Organic Yard</option>
                <option value="Dry Waste">Dry Waste Recovery</option>
                <option value="Recyclable Waste">Recyclable Plastics & Glass</option>
                <option value="E-Waste">E-Waste & Electronics</option>
                <option value="Hazardous Waste">Hazardous Waste Facilities</option>
              </select>
            </div>

          </div>
        </div>

        {/* Split View: Center Cards + Interactive Map Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cards List Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-2">
              <p className="text-xs font-black text-white drop-shadow-xs uppercase tracking-wider">
                Showing {filteredCenters.length} Authorized Facilities
              </p>
            </div>

            {filteredCenters.map((center) => {
              const isSelected = activeCenter.id === center.id;
              return (
                <div
                  key={center.id}
                  onClick={() => setActiveCenter(center)}
                  className={`p-6 rounded-3xl transition-all cursor-pointer shadow-xl ${
                    isSelected
                      ? 'glass-panel border-2 border-emerald-500 shadow-2xl ring-2 ring-emerald-400/30'
                      : 'glass-panel hover:bg-white/95 text-[#063B32]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {center.city}
                      </span>
                      <h3 className="text-lg font-black text-[#063B32] mt-1">{center.name}</h3>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-xl text-xs font-black shrink-0 border border-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{center.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold mb-3 flex items-start gap-1.5 text-[#365A52]">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{center.address}, {center.city}</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-4 text-[#365A52]">
                    <p className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{center.openingHours}</span>
                    </p>
                    <p className="flex items-center gap-1.5 font-medium">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{center.phone}</span>
                    </p>
                  </div>

                  {/* Accepted Types Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {center.acceptedTypes.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-100"
                      >
                        ✓ {type}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-emerald-100">
                    <span className="text-[11px] font-semibold text-[#365A52]">
                      Click to highlight on preview
                    </span>
                    <a
                      href={center.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs"
                    >
                      <span>View Location</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}

            {filteredCenters.length === 0 && (
              <div className="text-center py-12 glass-panel rounded-3xl">
                <Building2 className="w-12 h-12 text-emerald-700 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-black text-[#063B32]">No collection centers found matching your filter.</p>
                <button
                  onClick={() => {
                    setCityFilter('ALL');
                    setTypeFilter('ALL');
                    setSearchTerm('');
                  }}
                  className="mt-3 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Map Visual Preview Box Column (White Glass) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 glass-panel rounded-3xl p-6 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <h3 className="text-base font-black flex items-center gap-2 text-[#063B32]">
                  <Navigation className="w-5 h-5 text-emerald-600" />
                  <span>Map Regional Visualizer</span>
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono font-black">
                  {activeCenter.city} Zone
                </span>
              </div>

              {/* Map Illustration Stage */}
              <div className="relative h-72 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 border border-emerald-700 overflow-hidden flex items-center justify-center p-4 shadow-inner">
                
                {/* Decorative Map Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                {/* Center Marker Card */}
                <div className="relative z-10 bg-white/95 border-2 border-emerald-400 p-4 rounded-2xl shadow-2xl text-center max-w-xs animate-bounce-short">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-[#063B32]">{activeCenter.name}</h4>
                  <p className="text-[11px] text-[#365A52] font-semibold mt-1">{activeCenter.address}</p>
                  <div className="mt-3">
                    <a
                      href={activeCenter.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 hover:text-emerald-900 underline"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Active Selected Details */}
              <div className="glass-subcard p-4 rounded-2xl border border-emerald-100 text-xs space-y-2 text-[#063B32]">
                <div className="flex justify-between">
                  <span className="text-[#365A52] font-semibold">Contact Email:</span>
                  <span className="font-bold">{activeCenter.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#365A52] font-semibold">Direct Hotline:</span>
                  <span className="font-bold">{activeCenter.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#365A52] font-semibold">Facility Rating:</span>
                  <span className="font-bold text-amber-600">★ {activeCenter.rating} / 5.0</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
