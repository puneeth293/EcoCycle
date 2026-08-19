import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  Recycle, 
  Truck, 
  TreePine, 
  CheckCircle2, 
  Plus, 
  BarChart2, 
  Upload, 
  Zap 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const DashboardView: React.FC = () => {
  const { user, pickupRequests, segregationHistory, navigate } = useApp();

  const userPickups = pickupRequests.filter(
    (p) => p.userName.toLowerCase() === (user?.name || '').toLowerCase() || user?.role === 'admin'
  );

  const ecoPoints = user?.ecoPoints || 420;
  const wasteSegregatedKg = user?.wasteSegregatedKg || 18;
  const itemsRecycled = user?.itemsRecycled || 24;
  const pickupRequestsCount = userPickups.length || user?.pickupRequestsCount || 5;

  const impactData = [
    { category: 'Plastic PET', amountKg: Math.round(wasteSegregatedKg * 0.35) || 7, color: '#059669' },
    { category: 'Paper / Board', amountKg: Math.round(wasteSegregatedKg * 0.45) || 9, color: '#10B981' },
    { category: 'E-Waste', amountKg: Math.round(wasteSegregatedKg * 0.12) || 2, color: '#F59E0B' },
    { category: 'Glass & Metal', amountKg: Math.round(wasteSegregatedKg * 0.08) || 2, color: '#064E3B' },
  ];

  const monthlyHistoryData = [
    { month: 'Apr', kg: 4 },
    { month: 'May', kg: 8 },
    { month: 'Jun', kg: 12 },
    { month: 'Jul', kg: 15 },
    { month: 'Aug', kg: wasteSegregatedKg },
  ];

  return (
    <div className="py-12 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header (White Glass Banner) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          <div className="relative z-10">
            <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs">
              Personal Sustainability Hub
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mt-3 text-[#063B32]">
              Welcome back, {user?.name || 'Eco Guardian'}! 🌱
            </h1>
            <p className="text-sm font-semibold text-[#365A52] mt-1 max-w-xl">
              Track your waste diversion impact, monitor municipal pickups, and redeem earned Eco Points for electricity bill discounts & green rewards.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0 relative z-10">
            <button
              onClick={() => navigate('upload-waste')}
              className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md flex items-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Waste</span>
            </button>
            <button
              onClick={() => navigate('electricity-bill')}
              className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-all transform hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4" />
              <span>Pay Electricity Bill</span>
            </button>
            <button
              onClick={() => navigate('pickup')}
              className="px-4 py-3 rounded-2xl bg-[#063B32] hover:bg-[#063B32]/90 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Truck className="w-4 h-4" />
              <span>Book Pickup</span>
            </button>
          </div>
        </div>

        {/* Dashboard Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <div className="glass-panel p-6 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[#365A52] uppercase tracking-wider">
                Items Recycled
              </span>
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700 shadow-xs">
                <Recycle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#063B32] font-mono">
              ♻️ {itemsRecycled}
            </p>
            <p className="text-xs text-emerald-700 font-bold mt-2 flex items-center gap-1">
              <span>Verified classifications</span>
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[#365A52] uppercase tracking-wider">
                Waste Segregated
              </span>
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700 shadow-xs">
                <TreePine className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#063B32] font-mono">
              🗑️ {wasteSegregatedKg} kg
            </p>
            <p className="text-xs text-emerald-700 font-bold mt-2">
              Diverted from city landfills
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[#365A52] uppercase tracking-wider">
                Pickup Requests
              </span>
              <div className="p-3 rounded-2xl bg-sky-100 text-sky-700 shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#063B32] font-mono">
              🚛 {pickupRequestsCount}
            </p>
            <p className="text-xs text-sky-700 font-bold mt-2">
              Doorstep collection requests
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[#365A52] uppercase tracking-wider">
                Eco Points
              </span>
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-600 font-mono">
              🌱 {ecoPoints}
            </p>
            <p className="text-xs text-amber-700 font-bold mt-2">
              Ready for bill discounts
            </p>
          </div>

        </div>

        {/* Impact Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Chart 1 */}
          <div className="glass-panel rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-[#063B32]">
                  Your Environmental Impact
                </h3>
                <p className="text-xs font-semibold text-[#365A52]">
                  Material distribution of segregated waste (kg)
                </p>
              </div>
              <BarChart2 className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData}>
                  <XAxis dataKey="category" stroke="#365A52" fontSize={11} tickLine={false} />
                  <YAxis stroke="#365A52" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="amountKg" radius={[8, 8, 0, 0]}>
                    {impactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="glass-panel rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-[#063B32]">
                  Monthly Diversion Growth
                </h3>
                <p className="text-xs font-semibold text-[#365A52]">
                  Total kilograms diverted from landfills per month
                </p>
              </div>
              <TreePine className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyHistoryData}>
                  <XAxis dataKey="month" stroke="#365A52" fontSize={11} tickLine={false} />
                  <YAxis stroke="#365A52" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="kg" fill="#059669" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Recent Pickup Requests Table */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-[#063B32]">
                My Pickup Requests
              </h3>
              <p className="text-xs font-semibold text-[#365A52]">
                Track status and history for your doorstep collection logs.
              </p>
            </div>

            <button
              onClick={() => navigate('pickup')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Request</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-100 text-[#365A52] uppercase font-black tracking-wider">
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Waste Category</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Pickup Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 font-semibold text-[#063B32]">
                {userPickups.map((req) => (
                  <tr key={req.id} className="hover:bg-white/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">{req.id}</td>
                    <td className="py-3 px-4">{req.wasteType}</td>
                    <td className="py-3 px-4">{req.quantity}</td>
                    <td className="py-3 px-4">{req.preferredDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        req.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        req.status === 'Collected' ? 'bg-sky-100 text-sky-800 border-sky-300' :
                        req.status === 'Assigned' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        'bg-slate-100 text-slate-800 border-slate-300'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Segregation History Activity Log */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h3 className="text-xl font-black text-[#063B32] mb-1">
            Segregation Activity History
          </h3>
          <p className="text-xs font-semibold text-[#365A52] mb-6">
            Log of items identified and logged for Eco Points.
          </p>

          <div className="space-y-3">
            {segregationHistory.map((hist) => (
              <div
                key={hist.id}
                className="glass-subcard p-4 rounded-2xl border border-emerald-100 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#063B32]">{hist.itemName}</h4>
                    <p className="text-xs font-semibold text-[#365A52]">{hist.category} • {hist.date}</p>
                  </div>
                </div>

                <div className="text-right font-black text-amber-700 text-xs bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                  +{hist.pointsEarned} Points
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
