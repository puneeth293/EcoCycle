import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Gift, 
  TreePine, 
  ShoppingBag, 
  Ticket 
} from 'lucide-react';

export const RewardsView: React.FC = () => {
  const { user, navigate, awardPoints } = useApp();

  const ecoPoints = user?.ecoPoints || 420;

  const badges = [
    { title: '🌱 Eco Starter', req: 100, desc: 'Identify 5 waste items or sign up for an EcoCycle account.' },
    { title: '♻️ Recycling Hero', req: 300, desc: 'Complete 3 waste pickup requests or segregate 15 items.' },
    { title: '🌍 Green Champion', req: 600, desc: 'Upload 10 verified waste photos and divert 20 kg of waste.' },
    { title: '🏆 Eco Champion', req: 1000, desc: 'Top 5% environmental steward with over 1,000 lifetime eco points.' },
  ];

  const rewards = [
    {
      id: 'r1',
      title: 'Free Home Vermicomposting Kit',
      cost: 300,
      icon: TreePine,
      desc: '100% organic starter bin for converting kitchen wet waste into garden fertilizer.'
    },
    {
      id: 'r2',
      title: 'Tree Plantation Certificate in Your Name',
      cost: 500,
      icon: Sparkles,
      desc: 'We plant a native sapling in Tumkur Green Belt and send GPS tracking certificate.'
    },
    {
      id: 'r3',
      title: 'Organic Cotton Reusable Grocery Bag Set',
      cost: 200,
      icon: ShoppingBag,
      desc: 'Durable set of 3 unbleached cotton bags to eliminate single-use plastic bags.'
    },
    {
      id: 'r4',
      title: '₹250 Discount Voucher at Green Supermarket',
      cost: 400,
      icon: Ticket,
      desc: 'Redeemable on organic groceries and eco-friendly home care products.'
    }
  ];

  const handleRedeem = (cost: number, title: string) => {
    if (ecoPoints >= cost) {
      awardPoints(-cost, `Redeemed ${title}`);
    }
  };

  const progressPercent = Math.min(Math.round((ecoPoints / 1000) * 100), 100);

  return (
    <div className="py-12 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 text-emerald-800 border border-white/80 text-xs font-black uppercase tracking-wider shadow-xs backdrop-blur-md">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Gamified Eco Loyalty Program</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-3 font-sans tracking-tight drop-shadow-md">
            Eco Points & Badges
          </h1>
          <p className="text-base font-semibold text-emerald-50/90 mt-2 drop-shadow-xs">
            Earn points every time you segregate waste, upload verification photos, or book pickups.
          </p>
        </div>

        {/* Meter Card (White Glass) */}
        <div className="glass-panel rounded-3xl p-8 shadow-2xl mb-12 max-w-4xl mx-auto relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 font-black flex items-center justify-center shadow-md text-2xl border border-amber-300">
                🌱
              </div>
              <div>
                <span className="text-xs font-black text-[#365A52] uppercase tracking-wider">Your Active Balance</span>
                <h2 className="text-4xl font-black font-mono text-[#063B32] mt-0.5">{ecoPoints} Eco Points</h2>
                <p className="text-xs text-[#365A52] font-semibold mt-1">
                  Next Tier: <strong className="text-amber-700 font-black">500 Points – Green Champion</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                onClick={() => navigate('upload-waste')}
                className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
              >
                <span>📸 Upload Waste & Earn</span>
              </button>
              <button
                onClick={() => navigate('electricity-bill')}
                className="px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-black text-xs shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
              >
                <span>⚡ Pay Electricity Bill</span>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-8 pt-6 border-t border-emerald-100">
            <div className="flex justify-between text-xs font-black text-[#365A52] mb-2">
              <span>0 Points</span>
              <span>{progressPercent}% to 1,000 Points Tier</span>
              <span>1000 Points</span>
            </div>
            <div className="w-full bg-emerald-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-emerald-200">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-white drop-shadow-md mb-6 text-center">
            Environmental Badges & Tiers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map((badge) => {
              const isUnlocked = ecoPoints >= badge.req;
              return (
                <div
                  key={badge.title}
                  className={`p-6 rounded-3xl transition-all text-center flex flex-col justify-between shadow-xl ${
                    isUnlocked
                      ? 'glass-panel border-2 border-emerald-400'
                      : 'glass-panel opacity-60'
                  }`}
                >
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                      {badge.title.split(' ')[0]}
                    </div>
                    <h3 className="text-lg font-black text-[#063B32] mb-1">
                      {badge.title.substring(2)}
                    </h3>
                    <p className="text-xs text-[#365A52] font-semibold mb-3">
                      {badge.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-[#063B32]">
                    <span>Req: {badge.req} Pts</span>
                    {isUnlocked ? (
                      <span className="text-emerald-700 font-black flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[#365A52]/60 flex items-center gap-1 font-semibold">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Redeemable Green Vouchers Section */}
        <div>
          <h2 className="text-2xl font-black text-white drop-shadow-md mb-6 text-center">
            Redeem Eco Rewards & Vouchers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {rewards.map((reward) => {
              const IconComp = reward.icon;
              const canAfford = ecoPoints >= reward.cost;
              return (
                <div
                  key={reward.id}
                  className="glass-panel rounded-3xl p-6 shadow-xl flex items-start gap-4"
                >
                  <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-700 shrink-0 shadow-xs">
                    <IconComp className="w-7 h-7" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-black text-[#063B32]">{reward.title}</h3>
                      <span className="text-xs font-black text-amber-700 font-mono">
                        {reward.cost} Pts
                      </span>
                    </div>
                    <p className="text-xs text-[#365A52] font-semibold mb-4">
                      {reward.desc}
                    </p>

                    <button
                      onClick={() => handleRedeem(reward.cost, reward.title)}
                      disabled={!canAfford}
                      className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                        canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                          : 'bg-emerald-100/50 text-[#365A52]/40 cursor-not-allowed'
                      }`}
                    >
                      <Gift className="w-4 h-4" />
                      <span>{canAfford ? 'Redeem Voucher' : `Need ${reward.cost - ecoPoints} More Pts`}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
