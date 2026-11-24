import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { COLLECTION_CENTERS } from '../data/centersData';
import { PickupStatus } from '../types';
import {
  SUPABASE_CONFIG,
  SUPABASE_SQL_SETUP,
  checkSupabaseHealth,
  syncAllLocalDataToSupabase
} from '../lib/supabase';
import {
  Truck,
  MapPin,
  Database,
  Mail,
  CheckCircle2,
  Trash2,
  Phone,
  Clock,
  Calendar,
  Cloud,
  RefreshCw,
  Copy,
  ExternalLink,
  Camera,
  AlertTriangle
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    environmentalReports,
    deleteEnvironmentalReport,
    pickupRequests,
    contactMessages,
    updatePickupStatus,
    deletePickupRequest,
    deleteContactMessage,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'pickups' | 'contacts' | 'centers'>('overview');
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSqlScript, setShowSqlScript] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{
    connected: boolean;
    wasteReportTableReady: boolean;
    pickupTableReady: boolean;
    contactTableReady: boolean;
    message: string;
  }>({
    connected: true,
    wasteReportTableReady: false,
    pickupTableReady: false,
    contactTableReady: false,
    message: 'Checking Supabase connection...'
  });

  const statusOptions: PickupStatus[] = ['Pending', 'Confirmed', 'Assigned', 'Collected', 'Completed'];

  const refreshHealth = async () => {
    setIsCheckingHealth(true);
    const status = await checkSupabaseHealth();
    setHealthStatus({
      connected: status.connected,
      wasteReportTableReady: status.wasteReportTableReady,
      pickupTableReady: status.pickupTableReady,
      contactTableReady: status.contactTableReady,
      message: status.message
    });
    setIsCheckingHealth(false);
  };

  useEffect(() => {
    refreshHealth();
  }, []);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      const [clientResult, serverRes] = await Promise.all([
        syncAllLocalDataToSupabase(pickupRequests, contactMessages, environmentalReports),
        fetch('/api/supabase/sync-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wasteReports: environmentalReports,
            pickups: pickupRequests,
            contacts: contactMessages
          })
        }).catch(() => null)
      ]);

      let serverResult = { syncedWasteReports: 0, syncedPickups: 0, syncedContacts: 0 };
      if (serverRes && serverRes.ok) {
        serverResult = await serverRes.json();
      }

      const reportsCount = Math.max(clientResult.syncedWasteReports, serverResult.syncedWasteReports || 0);
      const pickupsCount = Math.max(clientResult.syncedPickups, serverResult.syncedPickups || 0);
      const contactsCount = Math.max(clientResult.syncedContacts, serverResult.syncedContacts || 0);

      await refreshHealth();

      if (reportsCount === 0 && pickupsCount === 0 && contactsCount === 0 && (environmentalReports.length > 0 || pickupRequests.length > 0 || contactMessages.length > 0)) {
        setShowSqlScript(true);
        showToast('Create the 3 Supabase tables first using the SQL Setup script, then sync again.', 'info');
      } else {
        showToast(
          `Synced to Supabase: ${reportsCount} Waste Reports, ${pickupsCount} Pickups, ${contactsCount} Contacts`,
          'success'
        );
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
      showToast('Supabase SQL setup script copied to clipboard!', 'success');
    } catch {
      showToast('Select and copy the SQL script manually.', 'info');
    }
  };

  const allTablesReady =
    healthStatus.wasteReportTableReady &&
    healthStatus.pickupTableReady &&
    healthStatus.contactTableReady;

  return (
    <div className="py-12 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Admin Header Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                System Administrator Console
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                allTablesReady
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}>
                <Cloud className={`w-3.5 h-3.5 ${allTablesReady ? 'text-emerald-600' : 'text-amber-600'}`} />
                <span>Supabase Connected: {SUPABASE_CONFIG.projectId}</span>
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#063B32] mt-3">
              Recynova Operations & Supabase Database Console
            </h1>
            <p className="text-xs text-[#365A52] mt-1 font-semibold max-w-2xl">
              Manage Waste & Pollution Reports, Schedule Online Waste Pickups, and Contact Support submissions synced to Supabase project <span className="font-mono font-black text-emerald-800">{SUPABASE_CONFIG.projectId}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={refreshHealth}
              disabled={isCheckingHealth}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-[#063B32] border border-emerald-200 text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isCheckingHealth ? 'animate-spin' : ''}`} />
              <span>Verify Tables</span>
            </button>

            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-60"
            >
              <Cloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-pulse' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync All Data to Supabase'}</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-emerald-100/60 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/80 hover:bg-emerald-50 text-[#063B32] border border-emerald-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Overview & Supabase</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/80 hover:bg-emerald-50 text-[#063B32] border border-emerald-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Waste & Pollution ({environmentalReports.length})</span>
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
            <span>Pickup Requests ({pickupRequests.length})</span>
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
            <span>Contact Messages ({contactMessages.length})</span>
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

        {/* TAB 1: OVERVIEW & SUPABASE */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="glass-panel p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-[#063B32]">Upload Waste & Pollution</h3>
                  <p className="text-2xl font-black text-emerald-700 font-mono">{environmentalReports.length}</p>
                  <p className="text-xs text-[#365A52] font-semibold leading-relaxed">
                    Photo scans and pollution reports persisted to Supabase table <span className="font-mono">waste_reports</span>.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all cursor-pointer"
                >
                  Manage Waste Reports
                </button>
              </div>

              <div className="glass-panel p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-[#063B32]">Schedule Online Pickup</h3>
                  <p className="text-2xl font-black text-emerald-700 font-mono">{pickupRequests.length}</p>
                  <p className="text-xs text-[#365A52] font-semibold leading-relaxed">
                    Doorstep waste collection bookings persisted to Supabase table <span className="font-mono">pickup_requests</span>.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('pickups')}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all cursor-pointer"
                >
                  Manage Pickups
                </button>
              </div>

              <div className="glass-panel p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-[#063B32]">Contact Recynova Support</h3>
                  <p className="text-2xl font-black text-teal-700 font-mono">{contactMessages.length}</p>
                  <p className="text-xs text-[#365A52] font-semibold leading-relaxed">
                    Citizen support inquiries persisted to Supabase table <span className="font-mono">contact_messages</span>.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-black text-xs transition-all cursor-pointer"
                >
                  View Messages
                </button>
              </div>
            </div>

            {/* Supabase Project Connection & Schema Setup Panel */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-[#063B32] flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-emerald-600" />
                    <span>Supabase Cloud Database Integration</span>
                  </h2>
                  <p className="text-xs font-semibold text-[#365A52] mt-0.5">
                    Project URL: <span className="font-mono">{SUPABASE_CONFIG.url}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href={SUPABASE_CONFIG.sqlEditorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#063B32] hover:bg-[#063B32]/90 text-white text-xs font-black flex items-center gap-1.5"
                  >
                    <span>Open SQL Editor</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={SUPABASE_CONFIG.tableEditorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-[#063B32] border border-emerald-200 text-xs font-black flex items-center gap-1.5"
                  >
                    <span>Open Table Editor</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    label: 'waste_reports',
                    feature: 'Upload Waste & Report Pollution',
                    ready: healthStatus.wasteReportTableReady
                  },
                  {
                    label: 'pickup_requests',
                    feature: 'Schedule Online Waste Pickup',
                    ready: healthStatus.pickupTableReady
                  },
                  {
                    label: 'contact_messages',
                    feature: 'Contact Recynova Support',
                    ready: healthStatus.contactTableReady
                  }
                ].map((table) => (
                  <div
                    key={table.label}
                    className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                      table.ready
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-amber-50/70 border-amber-200'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-mono font-black text-[#063B32]">{table.label}</p>
                      <p className="text-[11px] text-[#365A52] font-semibold">{table.feature}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                      table.ready
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {table.ready ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Ready</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3" />
                          <span>Run SQL</span>
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <p className="text-xs font-semibold text-[#365A52]">
                  {healthStatus.message}
                </p>

                <button
                  type="button"
                  onClick={() => setShowSqlScript((prev) => !prev)}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-black cursor-pointer"
                >
                  {showSqlScript ? 'Hide SQL Setup Script' : 'Show SQL Setup Script'}
                </button>
              </div>

              {(showSqlScript || !allTablesReady) && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#063B32]">
                      Supabase SQL Setup & RLS Policies (Copy and run in SQL Editor)
                    </span>
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-200 text-[11px] font-mono overflow-x-auto max-h-72 border border-slate-800">
                    {SUPABASE_SQL_SETUP}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: WASTE & POLLUTION REPORTS */}
        {activeTab === 'reports' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-emerald-100 pb-4">
              <h2 className="text-xl font-black text-[#063B32] flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <span>Waste & Pollution Reports ({environmentalReports.length})</span>
              </h2>
              <p className="text-xs font-semibold text-[#365A52] mt-0.5">
                All waste classification scans and neighborhood pollution incident reports.
              </p>
            </div>

            {environmentalReports.length === 0 ? (
              <div className="glass-subcard p-8 rounded-2xl border border-emerald-100 text-center text-xs text-[#365A52] font-semibold">
                No waste or pollution reports recorded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {environmentalReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="glass-subcard rounded-2xl border border-emerald-100 overflow-hidden flex flex-col justify-between shadow-xs"
                  >
                    <div className="relative h-32 bg-black">
                      <img
                        src={rep.imageUrl}
                        alt={rep.detectedTitle}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                        +{rep.pointsAwarded} Pts
                      </span>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono">
                        {rep.categoryOrDomain}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 text-xs flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-mono text-[10px] text-amber-700 font-black">{rep.id}</p>
                        <h4 className="font-black text-sm text-[#063B32] mt-0.5">{rep.detectedTitle}</h4>
                        <p className="text-[11px] text-[#365A52] mt-1 line-clamp-2">{rep.conditionNotes}</p>
                        {rep.location && (
                          <p className="text-[11px] text-emerald-800 font-semibold mt-1">{rep.location}</p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#365A52]">{rep.timestamp}</span>
                        <button
                          onClick={() => deleteEnvironmentalReport(rep.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                          title="Delete Report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PICKUP REQUESTS */}
        {activeTab === 'pickups' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-emerald-100 pb-4">
              <h2 className="text-xl font-black text-[#063B32] flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>Pickup Requests ({pickupRequests.length})</span>
              </h2>
              <p className="text-xs font-semibold text-[#365A52] mt-0.5">
                Update collection status or remove completed/cancelled requests.
              </p>
            </div>

            {pickupRequests.length === 0 ? (
              <div className="glass-subcard p-8 rounded-2xl border border-emerald-100 text-center text-xs text-[#365A52] font-semibold">
                No pickup requests recorded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {pickupRequests.map((req) => (
                  <div
                    key={req.id}
                    className="glass-subcard p-5 rounded-2xl border border-emerald-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1.5 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-black text-amber-700">{req.id}</span>
                        <span className="px-2.5 py-0.5 rounded-full font-black bg-emerald-100 text-emerald-800">
                          {req.wasteType} • {req.quantity}
                        </span>
                      </div>
                      <p className="font-black text-sm text-[#063B32]">{req.userName}</p>
                      <p className="text-[#365A52] font-semibold">
                        {req.address}{req.city ? `, ${req.city}` : ''}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#365A52] font-semibold pt-1">
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-600" /> {req.userPhone}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-emerald-600" /> {req.userEmail}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-emerald-600" /> {req.preferredDate}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-600" /> {req.preferredTime}</span>
                      </div>
                      {req.notes && (
                        <p className="text-[11px] text-slate-600 italic pt-1">Notes: {req.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={req.status}
                        onChange={(e) => updatePickupStatus(req.id, e.target.value as PickupStatus)}
                        className="px-3 py-2 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>

                      <button
                        onClick={() => deletePickupRequest(req.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                        title="Delete Pickup Request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CONTACT MESSAGES */}
        {activeTab === 'contacts' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-emerald-100 pb-4">
              <h2 className="text-xl font-black text-[#063B32] flex items-center gap-2">
                <Mail className="w-5 h-5 text-teal-600" />
                <span>Contact Messages ({contactMessages.length})</span>
              </h2>
              <p className="text-xs font-semibold text-[#365A52] mt-0.5">
                Inquiries submitted through the Contact Support form.
              </p>
            </div>

            {contactMessages.length === 0 ? (
              <div className="glass-subcard p-8 rounded-2xl border border-emerald-100 text-center text-xs text-[#365A52] font-semibold">
                No contact messages received yet.
              </div>
            ) : (
              <div className="space-y-4">
                {contactMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="glass-subcard p-5 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1.5 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-teal-700">{msg.id}</span>
                        <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-black text-[10px]">
                          {msg.subject || 'General Inquiry'}
                        </span>
                      </div>
                      <p className="font-black text-sm text-[#063B32]">{msg.name}</p>
                      <p className="text-[#365A52] font-semibold">
                        {msg.email}{msg.phone ? ` • ${msg.phone}` : ''}
                      </p>
                      <p className="text-[#063B32] font-medium pt-1 leading-relaxed">
                        {msg.message}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteContactMessage(msg.id)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer shrink-0 self-start"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: REGISTERED CENTERS */}
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
