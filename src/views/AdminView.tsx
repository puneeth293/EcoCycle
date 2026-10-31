import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { COLLECTION_CENTERS } from '../data/centersData';
import { 
  SUPABASE_CONFIG, 
  SUPABASE_SQL_SETUP, 
  checkSupabaseHealth 
} from '../lib/supabase';
import { 
  Truck, 
  MapPin, 
  Database, 
  Mail, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle,
  ShieldCheck,
  Lock,
  ArrowUpRight
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'supabase' | 'pickups' | 'contacts' | 'centers'>('supabase');

  // Supabase live health status state
  const [checkingSupa, setCheckingSupa] = useState(false);
  const [supaHealth, setSupaHealth] = useState<{
    connected: boolean;
    pickupTableReady: boolean;
    contactTableReady: boolean;
    message: string;
  } | null>(null);

  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    runHealthCheck();
  }, []);

  const runHealthCheck = async () => {
    setCheckingSupa(true);
    try {
      const res = await checkSupabaseHealth();
      setSupaHealth(res);
    } catch {
      setSupaHealth({
        connected: false,
        pickupTableReady: false,
        contactTableReady: false,
        message: 'Could not reach Supabase endpoint',
      });
    } finally {
      setCheckingSupa(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    showToast('Supabase SQL Schema copied to clipboard!', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="py-12 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                System Administrator Console
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase: {SUPABASE_CONFIG.projectId}</span>
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#063B32] mt-3">
              Recynova Supabase Database Management
            </h1>
            <p className="text-xs text-[#365A52] mt-1 font-semibold max-w-2xl">
              Per your privacy configuration, all waste pickup requests and contact message submissions are stored directly in your Supabase account and are not displayed on the website.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <a
              href={SUPABASE_CONFIG.tableEditorUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>Open Supabase Dashboard</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-emerald-100/60 pb-3">
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'supabase'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/80 hover:bg-emerald-50 text-[#063B32] border border-emerald-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase Cloud Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('pickups')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'pickups'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/80 hover:bg-emerald-50 text-[#063B32] border border-emerald-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Pickup Requests (Supabase)</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'contacts'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/80 hover:bg-emerald-50 text-[#063B32] border border-emerald-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact Messages (Supabase)</span>
          </button>

          <button
            onClick={() => setActiveTab('centers')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'centers'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/80 hover:bg-emerald-50 text-[#063B32] border border-emerald-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Collection Centers ({COLLECTION_CENTERS.length})</span>
          </button>
        </div>

        {/* TAB 1: SUPABASE CLOUD HUB (PRIMARY) */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            
            {/* Quick Access Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="glass-panel p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-[#063B32]">pickup_requests Table</h3>
                  <p className="text-xs text-[#365A52] font-semibold leading-relaxed">
                    View, search, edit status, and export all doorstep waste pickup bookings directly in your Supabase account.
                  </p>
                </div>
                <a
                  href={SUPABASE_CONFIG.tableEditorUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Open pickup_requests in Supabase</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="glass-panel p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-[#063B32]">contact_messages Table</h3>
                  <p className="text-xs text-[#365A52] font-semibold leading-relaxed">
                    Read and respond to citizen contact forms and support inquiries securely stored in your Supabase account.
                  </p>
                </div>
                <a
                  href={SUPABASE_CONFIG.tableEditorUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Open contact_messages in Supabase</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="glass-panel p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shadow-xs">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-[#063B32]">Supabase SQL Editor</h3>
                  <p className="text-xs text-[#365A52] font-semibold leading-relaxed">
                    Execute custom SQL queries, verify Row Level Security (RLS) policies, and analyze database metrics.
                  </p>
                </div>
                <a
                  href={SUPABASE_CONFIG.sqlEditorUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Open Supabase SQL Editor</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Connection Status Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#063B32]">Database Integration Status</h2>
                    <p className="text-xs text-[#365A52] font-semibold">
                      Connected to project ID: <strong className="text-emerald-800 font-mono">{SUPABASE_CONFIG.projectId}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={runHealthCheck}
                    disabled={checkingSupa}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${checkingSupa ? 'animate-spin' : ''}`} />
                    <span>{checkingSupa ? 'Checking...' : 'Check Connection'}</span>
                  </button>

                  <a
                    href={`https://supabase.com/dashboard/project/${SUPABASE_CONFIG.projectId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <span>Supabase Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-subcard p-4 rounded-2xl border border-emerald-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">API Endpoint</span>
                  <p className="font-mono text-xs font-bold text-emerald-900 truncate">{SUPABASE_CONFIG.url}</p>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Authenticated via Publishable Key</span>
                  </div>
                </div>

                <div className="glass-subcard p-4 rounded-2xl border border-emerald-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">pickup_requests Table</span>
                  <p className="font-mono text-xs font-black text-[#063B32]">Online Waste Pickups</p>
                  <div className="flex items-center gap-1 text-[11px] font-bold pt-1">
                    {supaHealth?.pickupTableReady ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Table Ready in Supabase</span>
                      </span>
                    ) : (
                      <span className="text-amber-800 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Ready to initialize (run SQL below)</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="glass-subcard p-4 rounded-2xl border border-emerald-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">contact_messages Table</span>
                  <p className="font-mono text-xs font-black text-[#063B32]">Support & Contact Inquiries</p>
                  <div className="flex items-center gap-1 text-[11px] font-bold pt-1">
                    {supaHealth?.contactTableReady ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Table Ready in Supabase</span>
                      </span>
                    ) : (
                      <span className="text-amber-800 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Ready to initialize (run SQL below)</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* SQL Setup Helper Card */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                      <span>Supabase SQL Setup & RLS Schema Script</span>
                    </h3>
                    <p className="text-xs text-slate-300">
                      Copy and paste this SQL into your Supabase SQL Editor if you ever need to recreate or adjust tables and Row Level Security.
                    </p>
                  </div>

                  <button
                    onClick={handleCopySql}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
                  >
                    {copiedSql ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 text-emerald-300 font-mono text-[11px] overflow-x-auto max-h-64 border border-slate-800">
                  {SUPABASE_SQL_SETUP}
                </pre>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <span>URL: https://supabase.com/dashboard/project/{SUPABASE_CONFIG.projectId}/sql</span>
                  <a
                    href={`https://supabase.com/dashboard/project/${SUPABASE_CONFIG.projectId}/sql`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Open Supabase SQL Editor</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PICKUP REQUESTS (SUPABASE GUIDE) */}
        {activeTab === 'pickups' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Confidential Supabase Storage</span>
                </div>
                <h2 className="text-xl font-black text-[#063B32] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <span>Pickup Requests (Stored in Supabase Account Only)</span>
                </h2>
                <p className="text-xs font-semibold text-[#365A52] mt-0.5">
                  All door-to-door pickup schedules are stored in the <code className="font-mono text-emerald-800 font-bold bg-white px-1 rounded border border-emerald-200">pickup_requests</code> table in your Supabase project.
                </p>
              </div>

              <a
                href={SUPABASE_CONFIG.tableEditorUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
              >
                <Database className="w-4 h-4" />
                <span>Open in Supabase Table Editor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="glass-subcard p-5 rounded-2xl border border-emerald-100 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-black text-[#063B32] text-sm">Protected From Public Display</h3>
                <p className="text-xs text-[#365A52] font-semibold leading-relaxed">
                  Customer records (names, mobile numbers, addresses, and schedule slots) are kept strictly confidential and are not rendered on the website.
                </p>
              </div>

              <div className="glass-subcard p-5 rounded-2xl border border-emerald-100 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-black text-[#063B32] text-sm">Live in Supabase Table</h3>
                <p className="text-xs text-[#365A52] font-semibold leading-relaxed">
                  Every time a resident submits the pickup form, a new record is created in the <code className="font-mono text-emerald-800 font-bold bg-white px-1 rounded">pickup_requests</code> table.
                </p>
              </div>

              <div className="glass-subcard p-5 rounded-2xl border border-emerald-100 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-black text-[#063B32] text-sm">Full Administrative Power</h3>
                <p className="text-xs text-[#365A52] font-semibold leading-relaxed">
                  In the Supabase Table Editor, you can filter by status (Pending, Confirmed, Completed), edit details, assign drivers, or export CSV files.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT MESSAGES (SUPABASE GUIDE) */}
        {activeTab === 'contacts' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-100 text-teal-800 text-[11px] font-black uppercase tracking-wider mb-2">
                  <Lock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Confidential Supabase Storage</span>
                </div>
                <h2 className="text-xl font-black text-[#063B32] flex items-center gap-2">
                  <Mail className="w-5 h-5 text-teal-600" />
                  <span>Contact Messages (Stored in Supabase Account Only)</span>
                </h2>
                <p className="text-xs font-semibold text-[#365A52] mt-0.5">
                  All resident contact form inquiries are saved directly to the <code className="font-mono text-emerald-800 font-bold bg-white px-1 rounded border border-emerald-200">contact_messages</code> table in your Supabase account.
                </p>
              </div>

              <a
                href={SUPABASE_CONFIG.tableEditorUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-black text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
              >
                <Database className="w-4 h-4" />
                <span>Open in Supabase Table Editor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="glass-subcard p-5 rounded-2xl border border-emerald-100 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-black text-[#063B32] text-sm">Protected From Public View</h3>
                <p className="text-xs text-[#365A52] font-semibold leading-relaxed">
                  Inquiries, sender emails, and support messages are kept strictly private and are not rendered on the public website.
                </p>
              </div>

              <div className="glass-subcard p-5 rounded-2xl border border-emerald-100 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-black text-[#063B32] text-sm">Stored in Supabase Account</h3>
                <p className="text-xs text-[#365A52] font-semibold leading-relaxed">
                  Form submissions flow into the <code className="font-mono text-emerald-800 font-bold bg-white px-1 rounded">contact_messages</code> PostgreSQL table with timestamps and sender details.
                </p>
              </div>

              <div className="glass-subcard p-5 rounded-2xl border border-emerald-100 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-black text-[#063B32] text-sm">Direct Response Handling</h3>
                <p className="text-xs text-[#365A52] font-semibold leading-relaxed">
                  Administrators review customer questions, track status, and reply directly using the sender emails registered in Supabase.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REGISTERED CENTERS */}
        {activeTab === 'centers' && (
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
        )}

      </div>
    </div>
  );
};
