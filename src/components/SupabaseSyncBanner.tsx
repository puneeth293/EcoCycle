import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  SUPABASE_CONFIG, 
  SUPABASE_SQL_SETUP, 
  checkSupabaseHealth, 
  syncAllLocalDataToSupabase 
} from '../lib/supabase';
import { 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface SupabaseSyncBannerProps {
  pageType?: 'pickup' | 'contact' | 'admin';
}

export const SupabaseSyncBanner: React.FC<SupabaseSyncBannerProps> = ({ pageType = 'pickup' }) => {
  const { pickupRequests, contactMessages, showToast } = useApp();

  const [checking, setChecking] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);

  const [status, setStatus] = useState<{
    connected: boolean;
    pickupTableReady: boolean;
    activePickupTable?: string;
    contactTableReady: boolean;
    activeContactTable?: string;
    message: string;
  } | null>(null);

  const runCheck = async () => {
    setChecking(true);
    try {
      const res = await checkSupabaseHealth();
      setStatus(res);
    } catch {
      setStatus({
        connected: false,
        pickupTableReady: false,
        contactTableReady: false,
        message: 'Could not connect to Supabase endpoint',
      });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    runCheck();
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopied(true);
    showToast('SQL Setup Schema copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleVerifyAndSync = async () => {
    setSyncing(true);
    try {
      // 1. Re-check health to see if user created tables
      const health = await checkSupabaseHealth();
      setStatus(health);

      if (!health.pickupTableReady && !health.contactTableReady) {
        showToast(
          'Tables not found yet! Please run the SQL schema in Supabase SQL editor first.',
          'error'
        );
        setShowSqlModal(true);
        setSyncing(false);
        return;
      }

      // 2. Perform bulk sync
      const result = await syncAllLocalDataToSupabase(pickupRequests, contactMessages);
      showToast(
        `Synced ${result.syncedPickups} pickup(s) and ${result.syncedContacts} contact message(s) to Supabase!`,
        'success'
      );
    } catch (e: any) {
      showToast(e?.message || 'Sync failed. Please verify Supabase tables exist.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const isTableReadyForThisPage = 
    pageType === 'pickup' ? status?.pickupTableReady :
    pageType === 'contact' ? status?.contactTableReady :
    (status?.pickupTableReady && status?.contactTableReady);

  // If table is ready and verified
  if (isTableReadyForThisPage) {
    return (
      <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-950 font-bold">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <Database className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Supabase Live Sync Active &bull; Storing in project <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200">{SUPABASE_CONFIG.projectId}</code>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleVerifyAndSync}
            disabled={syncing}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100/70 text-emerald-900 border border-emerald-300 font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync All Data Now'}</span>
          </button>

          <a
            href={SUPABASE_CONFIG.tableEditorUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-1 shadow-xs"
          >
            <span>View in Supabase</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // If table is NOT ready yet, display the helpful 1-click guide banner
  return (
    <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-50/70 border-2 border-amber-300 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <AlertTriangle className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h4 className="text-sm font-black text-amber-950 flex items-center gap-2">
              <span>Action Required: Initialize Supabase Database Tables</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                1-Minute Setup
              </span>
            </h4>
            <p className="text-xs text-amber-900/80 font-semibold mt-0.5">
              Your Supabase project <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300">{SUPABASE_CONFIG.projectId}</code> is connected, but the PostgreSQL database does not have the <code className="font-mono bg-amber-100 font-bold px-1 py-0.5 rounded">{pageType === 'contact' ? 'contact_messages' : 'pickup_requests'}</code> table created yet.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopySql}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
          </button>

          <a
            href={SUPABASE_CONFIG.sqlEditorUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <span>Open Supabase SQL Editor</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </a>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-white/90 border border-amber-200 text-xs text-amber-950 space-y-2">
        <p className="font-black flex items-center gap-1.5 text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Why your entered data is not showing in Supabase Table Editor yet:</span>
        </p>
        <p className="text-[11px] leading-relaxed text-slate-700">
          Supabase requires database tables to exist before it can store records. Your data is currently stored safely in the application memory. As soon as you run the SQL script below in your Supabase dashboard, all entered pickup and contact records will instantly sync!
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <ol className="list-decimal list-inside text-[11px] text-slate-800 space-y-0.5 font-semibold">
            <li>Click <strong>Copy SQL Schema</strong> above.</li>
            <li>Click <strong>Open Supabase SQL Editor</strong> and paste the SQL script.</li>
            <li>Click the green <strong>Run</strong> button in Supabase (takes 3 seconds).</li>
            <li>Click <strong>Verify & Sync Pending Data</strong> below!</li>
          </ol>

          <button
            type="button"
            onClick={handleVerifyAndSync}
            disabled={syncing}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Verifying...' : 'Verify & Sync Pending Data'}</span>
          </button>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowSqlModal(!showSqlModal)}
          className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 cursor-pointer underline"
        >
          <span>{showSqlModal ? 'Hide SQL Schema' : 'View SQL Schema Code'}</span>
          {showSqlModal ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showSqlModal && (
          <div className="mt-2 relative">
            <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-[10px] sm:text-xs overflow-x-auto max-h-56 border border-slate-800 shadow-inner">
              {SUPABASE_SQL_SETUP}
            </pre>
            <button
              type="button"
              onClick={handleCopySql}
              className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
