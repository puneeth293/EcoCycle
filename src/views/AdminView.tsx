import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PickupStatus } from '../types';
import { COLLECTION_CENTERS } from '../data/centersData';
import { 
  Truck, 
  MapPin, 
  Search 
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { pickupRequests, updatePickupStatus } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredRequests = pickupRequests.filter((p) => {
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const countPending = pickupRequests.filter((p) => p.status === 'Pending').length;
  const countConfirmed = pickupRequests.filter((p) => p.status === 'Confirmed').length;
  const countAssigned = pickupRequests.filter((p) => p.status === 'Assigned').length;
  const countCollected = pickupRequests.filter((p) => p.status === 'Collected').length;
  const countCompleted = pickupRequests.filter((p) => p.status === 'Completed').length;

  const handleStatusChange = (requestId: string, newStatus: PickupStatus) => {
    updatePickupStatus(requestId, newStatus);
  };

  return (
    <div className="py-12 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Admin Banner */}
        <div className="glass-panel rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                System Administrator Mode
              </span>
              <span className="text-xs text-emerald-700 font-mono font-bold">
                Logistics Dispatch Console
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#063B32] mt-2">
              EcoCycle Operations Management
            </h1>
            <p className="text-xs text-[#365A52] mt-1 font-semibold">
              Monitor municipal collection requests, dispatch trucks, and oversee facility network metrics.
            </p>
          </div>

          <div className="glass-subcard p-4 rounded-2xl border border-emerald-200 text-xs text-right font-mono shrink-0 shadow-xs">
            <span className="text-[#365A52] block font-bold">Total Platform Pickup Requests:</span>
            <span className="text-2xl font-black text-[#063B32]">{pickupRequests.length} Requests</span>
          </div>
        </div>

        {/* Status Counters Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="glass-panel p-4 rounded-2xl shadow-xl text-center">
            <p className="text-xs font-black text-[#365A52]">Pending</p>
            <p className="text-2xl font-black text-[#063B32] font-mono">{countPending}</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl shadow-xl text-center">
            <p className="text-xs font-black text-blue-700">Confirmed</p>
            <p className="text-2xl font-black text-blue-700 font-mono">{countConfirmed}</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl shadow-xl text-center">
            <p className="text-xs font-black text-amber-700">Assigned Truck</p>
            <p className="text-2xl font-black text-amber-700 font-mono">{countAssigned}</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl shadow-xl text-center">
            <p className="text-xs font-black text-sky-700">Collected</p>
            <p className="text-2xl font-black text-sky-700 font-mono">{countCollected}</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl shadow-xl text-center">
            <p className="text-xs font-black text-emerald-700">Completed</p>
            <p className="text-2xl font-black text-emerald-700 font-mono">{countCompleted}</p>
          </div>
        </div>

        {/* Doorstep Requests Management Table */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-[#063B32] flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>Live Pickup Request Dispatch Console</span>
              </h2>
              <p className="text-xs font-semibold text-[#365A52]">
                Update status to notify users in real-time.
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search ID, Name, City..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-[#063B32] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-black text-[#063B32] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Assigned">Assigned</option>
                <option value="Collected">Collected</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-100 text-[#365A52] uppercase font-black tracking-wider">
                  <th className="py-3 px-3">Req ID</th>
                  <th className="py-3 px-3">Resident</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Waste / Qty</th>
                  <th className="py-3 px-3">Schedule Date</th>
                  <th className="py-3 px-3">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 font-semibold text-[#063B32]">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-amber-700">{req.id}</td>
                    <td className="py-3 px-3 font-black">{req.userName}</td>
                    <td className="py-3 px-3">
                      <div>{req.userPhone}</div>
                      <div className="text-[10px] text-[#365A52]/70">{req.userEmail}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div>{req.address}</div>
                      <div className="text-[10px] font-black text-emerald-700">{req.city}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold">{req.wasteType}</span> ({req.quantity})
                    </td>
                    <td className="py-3 px-3">{req.preferredDate}</td>
                    <td className="py-3 px-3">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value as PickupStatus)}
                        className="px-2.5 py-1 rounded-xl bg-white border border-emerald-300 text-xs font-black text-[#063B32] focus:outline-none cursor-pointer shadow-xs"
                      >
                        <option value="Pending">🕒 Pending</option>
                        <option value="Confirmed">✅ Confirmed</option>
                        <option value="Assigned">🚛 Assigned</option>
                        <option value="Collected">📦 Collected</option>
                        <option value="Completed">🏆 Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Registered Collection Centers Directory Admin Overview */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-xl font-black text-[#063B32] mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Registered Municipal Collection Infrastructure ({COLLECTION_CENTERS.length} Active Centers)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COLLECTION_CENTERS.map((c) => (
              <div key={c.id} className="glass-subcard p-4 rounded-2xl border border-emerald-100 text-xs shadow-xs">
                <span className="font-mono text-[10px] font-black uppercase text-emerald-700">{c.city} Zone</span>
                <h4 className="text-sm font-black text-[#063B32] mt-0.5">{c.name}</h4>
                <p className="text-[#365A52] font-semibold mt-1">{c.address}</p>
                <div className="mt-2 text-[11px] font-black text-amber-700">
                  ★ Rating {c.rating} / 5.0 • Hotline: {c.phone}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
