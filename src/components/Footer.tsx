import React from 'react';
import { useApp } from '../context/AppContext';
import { PageRoute } from '../types';
import { Recycle, Mail, Phone, MapPin, Leaf, Bot } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  const handleNav = (page: PageRoute) => {
    navigate(page);
  };

  return (
    <footer className="glass-panel text-[#063B32] border-t border-white/80 pt-16 pb-12 relative z-10 overflow-hidden shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-950/10">
                <Recycle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-[#063B32]">
                Eco<span className="text-emerald-600">Cycle</span>
              </span>
            </div>
            <p className="text-sm text-[#365A52] font-semibold leading-relaxed italic">
              “Small actions. Big impact.”
            </p>
            <p className="text-xs text-[#365A52] font-medium leading-relaxed">
              Empowering communities with smart waste segregation, digital pickup logistics, and gamified eco-rewards.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                Reduce • Reuse • Recycle • Restore
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-[#063B32] tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2 text-sm text-[#365A52] font-semibold">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-emerald-700 transition-colors">
                  Home Landing
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('ai-bot')} className="hover:text-emerald-700 text-emerald-700 font-bold transition-colors flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-emerald-600" />
                  <span>AI Assistant</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('segregation')} className="hover:text-emerald-700 transition-colors">
                  Smart Waste Segregation
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('upload-waste')} className="hover:text-emerald-700 transition-colors">
                  Upload Waste & Pollution
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('electricity-bill')} className="hover:text-emerald-700 transition-colors">
                  Pay Electricity Bill
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('pickup')} className="hover:text-emerald-700 transition-colors">
                  Waste Collection Pickup
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('centers')} className="hover:text-emerald-700 transition-colors">
                  Collection Centers Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Impact */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-[#063B32] tracking-wider uppercase">Community</h4>
            <ul className="space-y-2 text-sm text-[#365A52] font-semibold">
              <li>
                <button onClick={() => handleNav('dashboard')} className="hover:text-emerald-700 transition-colors">
                  User Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('upload-waste')} className="hover:text-emerald-700 transition-colors">
                  Upload Waste & Earn Rewards
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('electricity-bill')} className="hover:text-emerald-700 transition-colors">
                  Redeem Points on Power Bills
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('rewards')} className="hover:text-emerald-700 transition-colors">
                  Redeem Eco Points & Badges
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-emerald-700 transition-colors">
                  About Our Mission
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-emerald-700 transition-colors">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('login')} className="hover:text-emerald-700 transition-colors">
                  Account Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-[#063B32] tracking-wider uppercase">Contact Support</h4>
            <div className="space-y-2.5 text-xs text-[#365A52] font-medium">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>EcoCycle HQ, B.H. Road, Industrial Area, Tumkur - 572103</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>support@ecocycle.org</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>+91 1800 123 3262 (Toll Free)</span>
              </p>
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-2">
              {['Instagram', 'Facebook', 'LinkedIn', 'YouTube'].map((social) => (
                <a
                  key={social}
                  href="#social"
                  onClick={(e) => e.preventDefault()}
                  className="w-8 h-8 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-50 text-[#063B32] hover:text-emerald-700 flex items-center justify-center transition-all text-xs font-black shadow-xs"
                  title={social}
                >
                  {social.charAt(0)}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-emerald-100 flex flex-col md:flex-row items-center justify-between text-xs text-[#365A52] font-semibold gap-4">
          <p>© 2026 EcoCycle. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-emerald-700 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-emerald-700 cursor-pointer">Terms of Service</span>
            <span className="hover:text-emerald-700 cursor-pointer">Municipal Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
