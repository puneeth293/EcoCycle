import React, { useState } from 'react';
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
  Zap,
  Sparkles,
  Check,
  Flame,
  Droplets,
  ArrowRight,
  Gift
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const DashboardView: React.FC = () => {
  const { user, pickupRequests, segregationHistory, navigate, awardPoints, showToast } = useApp();

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

  // Weekly Green Quests State
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('recynova_weekly_quests');
      return saved ? JSON.parse(saved) : { q1: true, q2: true, q3: false, q4: false };
    } catch {
      return { q1: true, q2: true, q3: false, q4: false };
    }
  });

  const [bonusClaimed, setBonusClaimed] = useState<boolean>(() => {
    return localStorage.getItem('recynova_weekly_bonus_claimed') === 'true';
  });

  const quests = [
    {
      id: 'q1',
      title: 'Segregate Kitchen Wet Waste',
      desc: 'Sort peelings, vegetable trimmings & tea leaves into Green Bin',
      points: 25,
      bin: 'Green Bin 🟢',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      actionPage: 'segregation' as const,
      actionLabel: 'Learn Sorting'
    },
    {
      id: 'q2',
      title: 'Clean Recyclable Plastics',
      desc: 'Rinse & flatten 5 PET bottles or cartons for Blue Bin processing',
      points: 30,
      bin: 'Blue Bin 🔵',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      actionPage: 'upload-waste' as const,
      actionLabel: 'Verify Photo'
    },
    {
      id: 'q3',
      title: 'Schedule E-Waste Doorstep Pickup',
      desc: 'Hand over obsolete cables, chargers or electronics safely',
      points: 40,
      bin: 'Yellow Bin 🟡',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      actionPage: 'pickup' as const,
      actionLabel: 'Book Truck'
    },
    {
      id: 'q4',
      title: 'Redeem Eco Points for Bill Rebate',
      desc: 'Claim cash discount on your state electricity bill payment',
      points: 50,
      bin: 'Utility Perks ⚡',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      actionPage: 'electricity-bill' as const,
      actionLabel: 'Pay Bill'
    }
  ];

  const completedCount = Object.values(completedQuests).filter(Boolean).length;
  const isAllComplete = completedCount === quests.length;
  const progressPercent = Math.round((completedCount / quests.length) * 100);

  const toggleQuest = (id: string, points: number, title: string) => {
    setCompletedQuests((prev) => {
      const willBeComplete = !prev[id];
      const next = { ...prev, [id]: willBeComplete };
      localStorage.setItem('recynova_weekly_quests', JSON.stringify(next));
      if (willBeComplete) {
        awardPoints(points, `Completed quest: ${title}`);
        showToast(`Quest completed! +${points} Eco Points awarded 🌱`, 'success');
      }
      return next;
    });
  };

  const handleClaimWeeklyBonus = () => {
    if (bonusClaimed) return;
    awardPoints(50, 'Claimed Weekly Green Champion Bonus');
    setBonusClaimed(true);
    localStorage.setItem('recynova_weekly_bonus_claimed', 'true');
    showToast('🏆 Weekly Green Champion Bonus Unlocked! +50 Eco Points', 'success');
  };

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

        {/* Weekly Sustainability Quests & Eco Rewards Hub */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-5 mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Weekly Green Quests & Eco Rewards</span>
              </div>
              <h3 className="text-xl font-black text-[#063B32]">
                Household Sustainability Milestones
              </h3>
              <p className="text-xs font-semibold text-[#365A52] mt-0.5">
                Complete weekly diversion targets to earn verified bonus Eco Points and unlock utility cash rebates.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black flex items-center gap-1.5 shadow-2xs">
                <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>5-Day Green Streak</span>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-[#365A52] block">Weekly Progress</span>
                <span className="text-sm font-black text-emerald-800 font-mono">
                  {completedCount} / {quests.length} Completed ({progressPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-emerald-100/70 h-2.5 rounded-full overflow-hidden mb-6">
            <div
              className="bg-emerald-600 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Quests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {quests.map((q) => {
              const done = !!completedQuests[q.id];
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                    done
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                      : 'bg-white/80 border-emerald-100 hover:border-emerald-300 shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleQuest(q.id, q.points, q.title)}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                      done
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-emerald-300 hover:border-emerald-500 bg-white'
                    }`}
                    title={done ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {done && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${q.badgeClass}`}>
                        {q.bin}
                      </span>
                      <span className="text-xs font-black font-mono text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        +{q.points} Pts
                      </span>
                    </div>

                    <h4 className={`text-sm font-black ${done ? 'line-through text-emerald-900/60' : 'text-[#063B32]'}`}>
                      {q.title}
                    </h4>
                    <p className="text-xs text-[#365A52] font-semibold mt-0.5 leading-relaxed">
                      {q.desc}
                    </p>

                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        onClick={() => navigate(q.actionPage)}
                        className="text-[11px] font-black text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <span>{q.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Eco Impact & Weekly Bonus Card */}
          <div className="pt-4 border-t border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#063B32]">
              <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-xl border border-emerald-100 shadow-2xs">
                <TreePine className="w-4 h-4 text-emerald-600" />
                <span><strong>{Math.max(1, Number((wasteSegregatedKg * 0.18).toFixed(1)))}</strong> Trees Supported</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-xl border border-emerald-100 shadow-2xs">
                <Droplets className="w-4 h-4 text-sky-600" />
                <span><strong>{Math.round(wasteSegregatedKg * 42)}L</strong> Water Saved</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-xl border border-emerald-100 shadow-2xs">
                <Zap className="w-4 h-4 text-amber-500" />
                <span><strong>{Math.round(wasteSegregatedKg * 3.6)} kWh</strong> Clean Power</span>
              </div>
            </div>

            <div>
              {bonusClaimed ? (
                <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Weekly Bonus Claimed (+50 Pts)</span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!isAllComplete}
                  onClick={handleClaimWeeklyBonus}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                    isAllComplete
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transform hover:scale-[1.02] cursor-pointer'
                      : 'bg-emerald-100/60 text-emerald-900/50 cursor-not-allowed border border-emerald-200/60'
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  <span>Claim Weekly Champion Bonus (+50 Pts)</span>
                </button>
              )}
            </div>
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
