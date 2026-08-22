import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink, 
  Compass, 
  Navigation,
  Building2,
  CheckCircle2
} from 'lucide-react';

interface ContactLocationDetailsCardProps {
  className?: string;
}

export const ContactLocationDetailsCard: React.FC<ContactLocationDetailsCardProps> = ({
  className = ''
}) => {
  return (
    <div id="contact-location-card" className={`glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 transition-all flex flex-col justify-between ${className}`}>
      
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-[#063B32]/10">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#063B32] tracking-tight">
                Contact & Location Details
              </h3>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                HQ Central Hub
              </span>
            </div>
            <p className="text-xs text-[#365A52] font-semibold">
              EcoCycle Central Material Recovery Operations
            </p>
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-4 pt-6">
          
          {/* Address */}
          <div className="flex items-start gap-3.5 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-emerald-100 shadow-xs hover:bg-white/90 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <strong className="block text-[#063B32] font-black text-sm">
                  Central Operational Facility:
                </strong>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Karnataka Zone
                </span>
              </div>
              <p className="text-xs text-[#365A52] font-semibold mt-0.5 leading-relaxed">
                12th Cross, Green Tech Hub, SS Puram, Tumkur, Karnataka 572102, India
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-emerald-800 font-mono flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  GPS: 13.3409° N, 77.1010° E
                </span>
              </div>
            </div>
          </div>

          {/* Helpline */}
          <div className="flex items-start gap-3.5 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-emerald-100 shadow-xs hover:bg-white/90 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <strong className="block text-[#063B32] font-black text-sm">
                Toll-Free Helpline & Dispatch:
              </strong>
              <p className="text-xs text-[#365A52] font-semibold mt-0.5">
                1800-123-ECOCYCLE • (+91 80 2345 6789)
              </p>
              <a
                href="tel:1800123326"
                className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 hover:text-emerald-900 mt-1 underline underline-offset-2"
              >
                <span>Click to Call Dispatch Helpline</span>
              </a>
            </div>
          </div>

          {/* Email & Hours Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-white/70 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-emerald-600" />
                <strong className="text-[#063B32] font-black text-xs">Official Email</strong>
              </div>
              <p className="text-xs text-[#365A52] font-semibold truncate">
                support@ecocycle.org
              </p>
              <a
                href="mailto:support@ecocycle.org"
                className="text-[11px] text-emerald-700 font-bold hover:underline mt-1 inline-block"
              >
                Write to Support →
              </a>
            </div>

            <div className="bg-white/70 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-emerald-600" />
                <strong className="text-[#063B32] font-black text-xs">Operating Hours</strong>
              </div>
              <p className="text-xs text-[#365A52] font-semibold">
                Mon – Sat: 08:00 AM – 06:00 PM
              </p>
              <span className="text-[11px] text-amber-700 font-bold inline-block mt-1">
                Closed on Sundays
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 mt-6 border-t border-[#063B32]/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-[#063B32]">
            Facility Open for Drop-offs & Collections
          </span>
        </div>

        <a
          href="https://maps.google.com/?q=SS+Puram+Tumkur+Karnataka"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-md transition-all hover:scale-105"
        >
          <Navigation className="w-4 h-4" />
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
