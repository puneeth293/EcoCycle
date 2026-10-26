import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PickupStatus } from '../types';
import { COLLECTION_CENTERS } from '../data/centersData';
import { 
  SUPABASE_CONFIG, 
  SUPABASE_SQL_SETUP, 
  checkSupabaseHealth 
} from '../lib/supabase';
import { 
  Truck, 
  MapPin, 
  Search, 
  Database, 
  Mail, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle,
  Trash2
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { 
    pickupRequests, 
    updatePickupStatus, 
    deletePickupRequest, 
    contactMessages, 
    deleteContactMessage, 
    refreshFromSupabase, 
    isSyncingSupabase, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pickups' | 'contacts' | 'supabase' | 'centers'>('pickups');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  const filteredRequests = pickupRequests.filter((p) => {
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredContacts = contactMessages.filter((c) => {
    const term = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      (c.subject && c.subject.toLowerCase().includes(term)) ||
      c.message.toLowerCase().includes(term);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                System Administrator Mode
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase: {SUPABASE_CONFIG.projectId}</span>
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#063B32] mt-3">
              Recynova Operations & Database Control
            </h1>
            <p className="text-xs text-[#365A52] mt-1 font-semibold max-w-2xl">
              Oversee online waste pickup logistics, review resident contact submissions, and manage real-time Supabase cloud database synchronization.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <div className="glass-subcard p-3.5 rounded-2xl border border-emerald-200 text-xs font-mono shadow-xs text-center min-w-[130px]">
              <span className="text-[#365A52] block font-bold text-[11px]">Pickups Saved:</span>
              <span className="text-xl font-black text-[#063B32]">{pickupRequests.length}</span>
            </div>
            <div className="glass-subcard p-3.5 rounded-2xl border border-emerald-200 text-xs font-mono shadow-xs text-center min-w-[130px]">
              <span className="text-[#365A52] block font-bold text-[11px]">Contacts Saved:</span>
              <span className="text-xl font-black text-emerald-700">{contactMessages.length}</span>
            </div>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-emerald-100/60 pb-3">
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
            <span>Contact Details ({contactMessages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'supabase'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/80 hover:bg-emerald-50 text-[#063B32] border border-emerald-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase Cloud Database</span>
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

        {/* TAB 1: PICKUP REQUESTS */}
        {activeTab === 'pickups' && (
          <div className="space-y-6">
            {/* Status Counters Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="glass-panel p-3.5 rounded-2xl shadow-xl text-center">
                <p className="text-[11px] font-black text-[#365A52]">Pending</p>
                <p className="text-xl font-black text-[#063B32] font-mono">{countPending}</p>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl shadow-xl text-center">
                <p className="text-[11px] font-black text-blue-700">Confirmed</p>
                <p className="text-xl font-black text-blue-700 font-mono">{countConfirmed}</p>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl shadow-xl text-center">
                <p className="text-[11px] font-black text-amber-700">Assigned</p>
                <p className="text-xl font-black text-amber-700 font-mono">{countAssigned}</p>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl shadow-xl text-center">
                <p className="text-[11px] font-black text-sky-700">Collected</p>
                <p className="text-xl font-black text-sky-700 font-mono">{countCollected}</p>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl shadow-xl text-center">
                <p className="text-[11px] font-black text-emerald-700">Completed</p>
                <p className="text-xl font-black text-emerald-700 font-mono">{countCompleted}</p>
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
                  <p className="text-xs font-semibold text-[#365A52] mt-0.5">
                    All schedule details automatically sync with Supabase <code className="text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded">pickup_requests</code> table.
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => refreshFromSupabase()}
                    disabled={isSyncingSupabase}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                    <span>{isSyncingSupabase ? 'Syncing...' : 'Refresh Supabase'}</span>
                  </button>

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
                    className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-black text-[#063B32] focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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
                      <th className="py-3 px-3 text-center">Action</th>
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
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete pickup request ${req.id} from database?`)) {
                                deletePickupRequest(req.id);
                              }
                            }}
                            title="Delete Request"
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT DETAILS & MESSAGES */}
        {activeTab === 'contacts' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#063B32] flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <span>Resident Contact Messages & Support Inquiries</span>
                </h2>
                <p className="text-xs font-semibold text-[#365A52] mt-0.5">
                  All messages submitted via Contact Support are saved directly to Supabase <code className="text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded">contact_messages</code> table.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => refreshFromSupabase()}
                  disabled={isSyncingSupabase}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                  <span>{isSyncingSupabase ? 'Syncing...' : 'Refresh Supabase'}</span>
                </button>

                <div className="relative">
                  <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-[#063B32] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {filteredContacts.length === 0 ? (
              <div className="text-center py-12 text-[#365A52] text-xs font-semibold bg-emerald-50/50 rounded-2xl border border-dashed border-emerald-200">
                <Mail className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-60" />
                <p className="font-bold text-emerald-950 text-sm">No contact inquiries found</p>
                <p className="mt-1 text-slate-500">When visitors submit a message on the Contact page, it appears here in real-time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-100 text-[#365A52] uppercase font-black tracking-wider">
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Sender Name</th>
                      <th className="py-3 px-3">Email</th>
                      <th className="py-3 px-3">Subject</th>
                      <th className="py-3 px-3">Message Content</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50 font-semibold text-[#063B32]">
                    {filteredContacts.map((msg) => (
                      <tr key={msg.id} className="hover:bg-white/60 transition-colors">
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-3 px-3 font-black text-[#063B32]">{msg.name}</td>
                        <td className="py-3 px-3 text-emerald-700 font-mono text-[11px]">{msg.email}</td>
                        <td className="py-3 px-3 font-bold">{msg.subject || 'General Inquiry'}</td>
                        <td className="py-3 px-3 max-w-xs truncate text-[#365A52]">{msg.message}</td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {msg.status || 'Received'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete message from ${msg.name}?`)) {
                                deleteContactMessage(msg.id);
                              }
                            }}
                            title="Delete Message"
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUPABASE DATABASE CONFIGURATION & HEALTH */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            {/* Connection Status Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#063B32]">Supabase Database Integration</h2>
                    <p className="text-xs text-[#365A52] font-semibold">
                      Connected to project: <strong className="text-emerald-800 font-mono">{SUPABASE_CONFIG.projectId}</strong>
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
                    <span>{checkingSupa ? 'Checking...' : 'Check Status'}</span>
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
                        <span>Table Active in Supabase</span>
                      </span>
                    ) : (
                      <span className="text-amber-800 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Ready to create (run SQL below)</span>
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
                        <span>Table Active in Supabase</span>
                      </span>
                    ) : (
                      <span className="text-amber-800 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Ready to create (run SQL below)</span>
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
                      <span>1-Click Supabase SQL Setup Schema</span>
                    </h3>
                    <p className="text-xs text-slate-300">
                      Copy and paste this SQL into your Supabase SQL Editor to initialize both tables with Row Level Security (RLS) enabled.
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
