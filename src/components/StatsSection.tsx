import React, { useState, useEffect } from 'react';
import { Users, Recycle, Truck, MapPin } from 'lucide-react';

interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: any;
}

export const StatsSection: React.FC = () => {
  const stats: StatItem[] = [
    { id: '1', label: 'Registered Eco Users', value: 10000, suffix: '+', icon: Users },
    { id: '2', label: 'Waste Items Segregated', value: 25000, suffix: '+', icon: Recycle },
    { id: '3', label: 'Recycling Pickup Requests', value: 8500, suffix: '+', icon: Truck },
    { id: '4', label: 'Authorized Collection Centers', value: 15, suffix: '+', icon: MapPin },
  ];

  const [counters, setCounters] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    const duration = 2000;
    const steps = 40;
    const intervalTime = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setCounters(
        stats.map((s) => Math.floor(s.value * Math.min(progress, 1)))
      );

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-14 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/85 text-emerald-800 border border-white/80 shadow-xs backdrop-blur-md">
            Real Environmental Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-md mt-2.5">
            EcoCycle Community Metrics
          </h2>
          <p className="text-sm font-semibold text-emerald-50/90 mt-1 drop-shadow-xs">
            Driving tangible waste reduction and material recovery across municipal zones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className="glass-card glass-card-hover rounded-3xl p-6 text-center shadow-xl shadow-emerald-950/5 border border-white/80 group"
              >
                <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-xs group-hover:scale-110 transition-transform">
                  <IconComponent className="w-7 h-7 stroke-[2.3]" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#063B32] tracking-tight font-mono">
                  {counters[idx].toLocaleString()}
                  <span className="text-emerald-600">{stat.suffix}</span>
                </div>
                <p className="text-sm font-bold text-[#365A52] mt-1.5">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
