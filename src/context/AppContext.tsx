import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PageRoute,
  UserProfile,
  PickupRequest,
  SegregationRecord,
  ContactMessage,
  EnvironmentalReportRecord
} from '../types';
import {
  saveWasteReportToSupabase,
  deleteWasteReportFromSupabase,
  fetchWasteReportsFromSupabase,
  savePickupToSupabase,
  updatePickupStatusInSupabase,
  deletePickupFromSupabase,
  fetchPickupsFromSupabase,
  saveContactToSupabase,
  deleteContactFromSupabase,
  fetchContactsFromSupabase
} from '../lib/supabase';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

interface AppContextType {
  currentPage: PageRoute;
  navigate: (page: PageRoute) => void;
  user: UserProfile | null;
  loginUser: (email: string, passwordOrRole?: string) => boolean;
  registerUser: (name: string, email: string, password?: string, phone?: string) => boolean;
  updateUserName: (name: string) => void;
  login: (email: string, passwordOrRole?: string) => boolean;
  register: (name: string, email: string, password?: string, phone?: string) => boolean;
  logoutUser: () => void;
  environmentalReports: EnvironmentalReportRecord[];
  addEnvironmentalReport: (
    report: EnvironmentalReportRecord,
    metadata?: { userNote?: string; userName?: string; userEmail?: string }
  ) => Promise<EnvironmentalReportRecord>;
  deleteEnvironmentalReport: (id: string) => Promise<boolean>;
  clearEnvironmentalReports: () => Promise<void>;
  pickupRequests: PickupRequest[];
  addPickupRequest: (requestData: Omit<PickupRequest, 'id' | 'status' | 'createdAt'>) => Promise<PickupRequest>;
  updatePickupStatus: (id: string, status: PickupRequest['status']) => void;
  deletePickupRequest: (id: string) => Promise<boolean>;
  contactMessages: ContactMessage[];
  addContactMessage: (contactData: Omit<ContactMessage, 'id' | 'createdAt'>) => Promise<ContactMessage>;
  deleteContactMessage: (id: string) => Promise<boolean>;
  segregationHistory: SegregationRecord[];
  addSegregationRecord: (itemName: string, category: any, points: number) => void;
  awardPoints: (points: number, reason: string) => void;
  deductPoints: (points: number, reason: string) => void;
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  selectedSearchItem: string;
  setSelectedSearchItem: (item: string) => void;
  activeWasteItemModal: string | null;
  setActiveWasteItemModal: (id: string | null) => void;
}

const DEFAULT_PICKUPS: PickupRequest[] = [];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('recynova_user') || localStorage.getItem('ecocycle_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear old hardcoded developer mock identity so visitor is not forced into developer profile
        if (
          parsed &&
          (parsed.id === 'u-101' ||
           parsed.name === 'Puneeth' ||
           parsed.email === 'puneeth@recynova.org' ||
           parsed.email === 'puneeth@ecocycle.org')
        ) {
          localStorage.removeItem('recynova_user');
          localStorage.removeItem('ecocycle_user');
          return null;
        }
        return parsed;
      }
    } catch {
      return null;
    }
    return null;
  });

  // Environmental & Waste reports stored locally, via backend API, and Supabase
  const [environmentalReports, setEnvironmentalReports] = useState<EnvironmentalReportRecord[]>(() => {
    try {
      const saved = localStorage.getItem('recynova_environmental_reports') || localStorage.getItem('ecocycle_environmental_reports');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return [
      {
        id: 'rep-01',
        reportType: 'waste',
        imageUrl: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=600&auto=format&fit=crop&q=80',
        detectedTitle: 'Crushed PET Water Bottle',
        categoryOrDomain: 'Recyclable Waste',
        binColor: 'Blue',
        binName: 'Blue Bin 🔵',
        confidenceScore: 98,
        severityLevel: 'Low',
        conditionNotes: 'Rinsed clean and flattened properly.',
        actionSteps: ['Rinsed residue', 'Crushed flat', 'Placed in Blue Bin'],
        remedialAdvice: 'Converted into recycled polyester fibers for eco-clothing.',
        pointsAwarded: 40,
        co2SavedKg: 0.65,
        timestamp: '2026-08-14'
      },
      {
        id: 'rep-02',
        reportType: 'air-pollution',
        imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&auto=format&fit=crop&q=80',
        detectedTitle: 'Industrial Chimney Heavy Smoke Plume',
        categoryOrDomain: 'Air Pollution',
        confidenceScore: 96,
        severityLevel: 'Severe',
        sourceOfPollution: 'Unfiltered furnace chimney combustion',
        aqiImpact: 'Estimated AQI Spike: 290 (Very Unhealthy)',
        contaminantsIdentified: ['PM2.5', 'Sulfur Dioxide (SO2)', 'Carbon Monoxide'],
        conditionNotes: 'Dense soot plume reported near residential zone.',
        actionSteps: ['Wear N95 protective mask', 'Seal windows', 'CPCB grievance filed'],
        remedialAdvice: 'Wet scrubber installation mandatory under Clean Air regulations.',
        pointsAwarded: 60,
        co2SavedKg: 2.10,
        ticketId: 'CPCB-AIR-88219',
        timestamp: '2026-08-15'
      }
    ];
  });

  // Pickup requests stored locally, via backend API, and Supabase
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>(() => {
    try {
      const saved = localStorage.getItem('recynova_pickups') || localStorage.getItem('ecocycle_pickups');
      if (saved) {
        const list: PickupRequest[] = JSON.parse(saved);
        // Filter out legacy dummy entries
        return list.filter((p) => !p.id.startsWith('EC-') && p.id !== 'RN-2026-00125' && p.id !== 'RN-2026-00126' && p.id !== 'RN-2026-00127');
      }
    } catch {}
    return [];
  });

  // Contact messages stored locally, via backend API, and Supabase
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem('recynova_contacts');
      if (saved) {
        const list: ContactMessage[] = JSON.parse(saved);
        return list.filter((c) => c.id !== 'CNT-2026-0001');
      }
    } catch {}
    return [];
  });

  const [segregationHistory, setSegregationHistory] = useState<SegregationRecord[]>(() => {
    const saved = localStorage.getItem('recynova_history') || localStorage.getItem('ecocycle_history');
    return saved ? JSON.parse(saved) : [
      { id: 'sh1', itemName: 'Plastic Bottle', category: 'Recyclable Waste', date: '2026-08-07', pointsEarned: 15 },
      { id: 'sh2', itemName: 'Banana Peel', category: 'Wet Waste', date: '2026-08-06', pointsEarned: 10 },
      { id: 'sh3', itemName: 'Newspaper Bundle', category: 'Dry Waste', date: '2026-08-05', pointsEarned: 12 },
    ];
  });

  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    visible: false
  });

  const [selectedSearchItem, setSelectedSearchItem] = useState<string>('');
  const [activeWasteItemModal, setActiveWasteItemModal] = useState<string | null>(null);

  // Sync from Express backend API and Supabase on mount
  useEffect(() => {
    const loadRemoteData = async () => {
      try {
        const [reportsRes, pickupsRes, contactsRes] = await Promise.all([
          fetch('/api/waste-reports').catch(() => null),
          fetch('/api/pickups').catch(() => null),
          fetch('/api/contacts').catch(() => null)
        ]);

        let remoteReports: EnvironmentalReportRecord[] | null = null;
        if (reportsRes && reportsRes.ok) {
          const parsed = await reportsRes.json();
          if (Array.isArray(parsed) && parsed.length > 0) {
            remoteReports = parsed;
          }
        }
        if (!remoteReports || remoteReports.length === 0) {
          remoteReports = await fetchWasteReportsFromSupabase();
        }
        if (Array.isArray(remoteReports) && remoteReports.length > 0) {
          setEnvironmentalReports((prev) => {
            const map = new Map<string, EnvironmentalReportRecord>();
            remoteReports!.forEach((r) => map.set(r.id, r));
            prev.forEach((r) => {
              if (!map.has(r.id)) map.set(r.id, r);
            });
            return Array.from(map.values());
          });
        }

        let remotePickups: PickupRequest[] | null = null;
        if (pickupsRes && pickupsRes.ok) {
          const parsed = await pickupsRes.json();
          if (Array.isArray(parsed) && parsed.length > 0) {
            remotePickups = parsed;
          }
        }
        if (!remotePickups || remotePickups.length === 0) {
          remotePickups = await fetchPickupsFromSupabase();
        }
        if (Array.isArray(remotePickups) && remotePickups.length > 0) {
          setPickupRequests((prev) => {
            const map = new Map<string, PickupRequest>();
            remotePickups!.forEach((p) => map.set(p.id, p));
            prev.forEach((p) => {
              if (!map.has(p.id)) map.set(p.id, p);
            });
            return Array.from(map.values());
          });
        }

        let remoteContacts: ContactMessage[] | null = null;
        if (contactsRes && contactsRes.ok) {
          const parsed = await contactsRes.json();
          if (Array.isArray(parsed) && parsed.length > 0) {
            remoteContacts = parsed;
          }
        }
        if (!remoteContacts || remoteContacts.length === 0) {
          remoteContacts = await fetchContactsFromSupabase();
        }
        if (Array.isArray(remoteContacts) && remoteContacts.length > 0) {
          setContactMessages((prev) => {
            const map = new Map<string, ContactMessage>();
            remoteContacts!.forEach((c) => map.set(c.id, c));
            prev.forEach((c) => {
              if (!map.has(c.id)) map.set(c.id, c);
            });
            return Array.from(map.values());
          });
        }
      } catch {
        // Offline or server unavailable; localStorage remains active
      }
    };

    loadRemoteData();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('recynova_user', JSON.stringify(user));
      localStorage.setItem('ecocycle_user', JSON.stringify(user));

      // Synchronize changes to registered accounts storage
      try {
        const raw = localStorage.getItem('recynova_registered_accounts');
        if (raw) {
          const list: any[] = JSON.parse(raw);
          const idx = list.findIndex((a) => a.email?.toLowerCase() === user.email?.toLowerCase());
          if (idx >= 0) {
            list[idx] = { ...list[idx], ...user };
            localStorage.setItem('recynova_registered_accounts', JSON.stringify(list));
            localStorage.setItem('recynova_registered_users', JSON.stringify(list));
          }
        }
      } catch {}
    } else {
      localStorage.removeItem('recynova_user');
      localStorage.removeItem('ecocycle_user');
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('recynova_environmental_reports', JSON.stringify(environmentalReports));
      localStorage.setItem('ecocycle_environmental_reports', JSON.stringify(environmentalReports));
    } catch {}
  }, [environmentalReports]);

  useEffect(() => {
    localStorage.setItem('recynova_pickups', JSON.stringify(pickupRequests));
    localStorage.setItem('ecocycle_pickups', JSON.stringify(pickupRequests));
  }, [pickupRequests]);

  useEffect(() => {
    localStorage.setItem('recynova_contacts', JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem('recynova_history', JSON.stringify(segregationHistory));
    localStorage.setItem('ecocycle_history', JSON.stringify(segregationHistory));
  }, [segregationHistory]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  const navigate = (page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginUser = (email: string, passwordOrRole: string = 'user'): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      showToast('Please enter your email address.', 'error');
      return false;
    }

    if (passwordOrRole === 'admin' || cleanEmail.includes('admin@') || passwordOrRole === 'admin123') {
      const adminProfile: UserProfile = {
        id: 'admin-001',
        name: 'System Admin',
        email: cleanEmail || 'admin@recynova.org',
        phone: '+91 80000 11111',
        role: 'admin',
        ecoPoints: 1000,
        itemsRecycled: 150,
        wasteSegregatedKg: 200,
        pickupRequestsCount: 15,
        joinedDate: '2025-01-01',
        badges: ['🌱 Eco Starter', '♻️ Recycling Hero', '🌍 Green Champion', '🏆 Eco Champion']
      };
      setUser(adminProfile);
      showToast('Logged in as Administrator 🛡️', 'success');
      navigate('admin');
      return true;
    }

    let accounts: any[] = [];
    try {
      const raw = localStorage.getItem('recynova_registered_accounts') || localStorage.getItem('recynova_registered_users');
      if (raw) {
        accounts = JSON.parse(raw);
      }
    } catch {}

    const found = accounts.find((u: any) => u.email?.toLowerCase() === cleanEmail);
    if (found) {
      // If password was stored and user entered a password that doesn't match
      if (found.password && passwordOrRole && passwordOrRole !== 'user' && found.password !== passwordOrRole) {
        showToast('Incorrect password. Please try again.', 'error');
        return false;
      }

      const userProfile: UserProfile = {
        id: found.id || 'u-' + Date.now(),
        name: found.name || 'Eco Member',
        email: found.email,
        phone: found.phone || '+91 98765 43210',
        role: found.role || 'user',
        ecoPoints: found.ecoPoints ?? 50,
        itemsRecycled: found.itemsRecycled ?? 0,
        wasteSegregatedKg: found.wasteSegregatedKg ?? 0,
        pickupRequestsCount: found.pickupRequestsCount ?? 0,
        joinedDate: found.joinedDate || new Date().toISOString().split('T')[0],
        badges: found.badges || ['🌱 Eco Starter']
      };
      setUser(userProfile);
      showToast(`Welcome back, ${userProfile.name}! 🌱`, 'success');
      navigate('dashboard');
      return true;
    }

    if (cleanEmail === 'resident@recynova.org') {
      const userProfile: UserProfile = {
        id: 'u-demo-resident',
        name: 'Green Resident',
        email: 'resident@recynova.org',
        phone: '+91 98765 43210',
        role: 'user',
        ecoPoints: 250,
        itemsRecycled: 12,
        wasteSegregatedKg: 10,
        pickupRequestsCount: 2,
        joinedDate: '2026-01-15',
        badges: ['🌱 Eco Starter', '♻️ Recycling Hero']
      };
      setUser(userProfile);
      showToast(`Welcome back, ${userProfile.name}! 🌱`, 'success');
      navigate('dashboard');
      return true;
    }

    // If new user logging in directly
    const userPrefix = cleanEmail.split('@')[0] || 'Member';
    const cleanName = userPrefix.charAt(0).toUpperCase() + userPrefix.slice(1);
    const userProfile: UserProfile = {
      id: 'u-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      phone: '+91 98765 43210',
      role: 'user',
      ecoPoints: 50,
      itemsRecycled: 0,
      wasteSegregatedKg: 0,
      pickupRequestsCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      badges: ['🌱 Eco Starter']
    };

    accounts.push({ ...userProfile, password: passwordOrRole });
    try {
      localStorage.setItem('recynova_registered_accounts', JSON.stringify(accounts));
      localStorage.setItem('recynova_registered_users', JSON.stringify(accounts));
    } catch {}

    setUser(userProfile);
    showToast(`Welcome to Recynova, ${userProfile.name}! 🌱`, 'success');
    navigate('dashboard');
    return true;
  };

  const registerUser = (name: string, email: string, password?: string, phone?: string): boolean => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone?.trim() || '+91 98765 43210';

    if (!cleanName) {
      showToast('Please enter your full name.', 'error');
      return false;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      showToast('Please enter a valid email address.', 'error');
      return false;
    }

    if (password && password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return false;
    }

    let accounts: any[] = [];
    try {
      const raw = localStorage.getItem('recynova_registered_accounts') || localStorage.getItem('recynova_registered_users');
      if (raw) {
        accounts = JSON.parse(raw);
      }
    } catch {}

    const existing = accounts.find((u: any) => u.email?.toLowerCase() === cleanEmail);
    if (existing) {
      showToast('An account with this email already exists. Please log in.', 'info');
      return false;
    }

    const newUser: UserProfile = {
      id: 'u-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      role: 'user',
      ecoPoints: 50, // Welcome bonus points
      itemsRecycled: 0,
      wasteSegregatedKg: 0,
      pickupRequestsCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      badges: ['🌱 Eco Starter']
    };

    const newAccount = {
      ...newUser,
      password: password || 'password'
    };

    accounts.push(newAccount);
    try {
      localStorage.setItem('recynova_registered_accounts', JSON.stringify(accounts));
      localStorage.setItem('recynova_registered_users', JSON.stringify(accounts));
    } catch {}

    setUser(newUser);
    showToast(`Account created for ${newUser.name}! +50 Welcome Eco Points 🌱`, 'success');
    navigate('dashboard');
    return true;
  };

  const updateUserName = (newName: string) => {
    if (!user) return;
    const clean = newName.trim();
    if (!clean) return;
    const updated = { ...user, name: clean };
    setUser(updated);

    try {
      const raw = localStorage.getItem('recynova_registered_users');
      if (raw) {
        const list = JSON.parse(raw);
        const idx = list.findIndex((u: any) => u.email?.toLowerCase() === user.email?.toLowerCase());
        if (idx >= 0) {
          list[idx].name = clean;
        } else {
          list.push({ name: clean, email: user.email });
        }
        localStorage.setItem('recynova_registered_users', JSON.stringify(list));
      }
    } catch {}

    showToast(`Profile name updated to ${clean}!`, 'success');
  };

  const logoutUser = () => {
    setUser(null);
    showToast('Logged out successfully.', 'info');
    navigate('home');
  };

  const addEnvironmentalReport = async (
    report: EnvironmentalReportRecord,
    metadata?: { userNote?: string; userName?: string; userEmail?: string }
  ): Promise<EnvironmentalReportRecord> => {
    const payload = {
      ...report,
      userNote: metadata?.userNote || '',
      userName: metadata?.userName || user?.name || '',
      userEmail: metadata?.userEmail || user?.email || '',
    };

    setEnvironmentalReports((prev) => [report, ...prev]);

    try {
      const response = await fetch('/api/waste-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const saved = await response.json();
        if (!saved?.supabaseSaved) {
          await saveWasteReportToSupabase(payload);
        }
      } else {
        await saveWasteReportToSupabase(payload);
      }
    } catch {
      await saveWasteReportToSupabase(payload);
    }

    return report;
  };

  const deleteEnvironmentalReport = async (id: string): Promise<boolean> => {
    setEnvironmentalReports((prev) => prev.filter((item) => item.id !== id));

    try {
      await Promise.allSettled([
        fetch(`/api/waste-reports/${id}`, { method: 'DELETE' }),
        deleteWasteReportFromSupabase(id)
      ]);
      showToast('Photo report deleted from history', 'info');
      return true;
    } catch {
      showToast('Photo report deleted from history', 'info');
      return true;
    }
  };

  const clearEnvironmentalReports = async (): Promise<void> => {
    const ids = environmentalReports.map((r) => r.id);
    setEnvironmentalReports([]);
    try {
      localStorage.setItem('recynova_environmental_reports', '[]');
      localStorage.setItem('ecocycle_environmental_reports', '[]');
      await Promise.allSettled(
        ids.flatMap((id) => [
          fetch(`/api/waste-reports/${id}`, { method: 'DELETE' }),
          deleteWasteReportFromSupabase(id)
        ])
      );
    } catch {}
    showToast('All photo reports deleted', 'info');
  };

  const addPickupRequest = async (requestData: Omit<PickupRequest, 'id' | 'status' | 'createdAt'>): Promise<PickupRequest> => {
    let newRecord: PickupRequest;
    let alreadySyncedToSupabase = false;

    try {
      const response = await fetch('/api/pickups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const serverData = await response.json();
        alreadySyncedToSupabase = Boolean(serverData?.supabaseSaved);
        newRecord = serverData;
      } else {
        const requestId = `RN-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        newRecord = {
          ...requestData,
          id: requestId,
          status: 'Pending',
          createdAt: new Date().toISOString()
        };
      }
    } catch (err) {
      console.error('Error submitting pickup request:', err);
      const requestId = `RN-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      newRecord = {
        ...requestData,
        id: requestId,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
    }

    if (!alreadySyncedToSupabase) {
      savePickupToSupabase(newRecord).catch(() => {});
    }

    // Update state & rewards
    setPickupRequests((prev) => [newRecord, ...prev]);

    if (user) {
      setUser((prev) => prev ? ({
        ...prev,
        pickupRequestsCount: prev.pickupRequestsCount + 1,
        ecoPoints: prev.ecoPoints + 30
      }) : null);
    }

    showToast(`Pickup Request Booked! Tracking ID: ${newRecord.id} (+30 Eco Points)`, 'success');
    return newRecord;
  };

  const updatePickupStatus = (id: string, status: PickupRequest['status']) => {
    setPickupRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );

    fetch(`/api/pickups/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(() => {});

    updatePickupStatusInSupabase(id, status).catch(() => {});

    showToast(`Request ${id} status updated to ${status}`, 'info');
  };

  const deletePickupRequest = async (id: string): Promise<boolean> => {
    setPickupRequests((prev) => prev.filter((p) => p.id !== id));

    try {
      await Promise.allSettled([
        fetch(`/api/pickups/${id}`, { method: 'DELETE' }),
        deletePickupFromSupabase(id)
      ]);
      showToast(`Pickup request ${id} deleted`, 'info');
      return true;
    } catch {
      showToast(`Removed pickup request ${id} locally`, 'info');
      return true;
    }
  };

  const addContactMessage = async (contactData: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage> => {
    const contactRecord: ContactMessage = {
      ...contactData,
      id: `CNT-${Date.now()}`,
      status: contactData.status || 'New',
      createdAt: new Date().toISOString()
    };

    // Update local state immediately
    setContactMessages((prev) => [contactRecord, ...prev]);

    let alreadySyncedToSupabase = false;
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactRecord)
      });
      if (res.ok) {
        const data = await res.json();
        alreadySyncedToSupabase = Boolean(data?.supabaseSaved);
      }
    } catch (apiErr) {
      console.warn('API /api/contacts notice:', apiErr);
    }

    if (!alreadySyncedToSupabase) {
      saveContactToSupabase(contactRecord).catch(() => {});
    }

    showToast('Thank you! Your message has been sent successfully. 📩', 'success');
    return contactRecord;
  };

  const deleteContactMessage = async (id: string): Promise<boolean> => {
    setContactMessages((prev) => prev.filter((c) => c.id !== id));

    try {
      await Promise.allSettled([
        fetch(`/api/contacts/${id}`, { method: 'DELETE' }),
        deleteContactFromSupabase(id)
      ]);
      showToast(`Contact message ${id} removed`, 'info');
      return true;
    } catch {
      showToast(`Removed message ${id} locally`, 'info');
      return true;
    }
  };

  const addSegregationRecord = (itemName: string, category: any, points: number) => {
    const newRecord: SegregationRecord = {
      id: 'sh-' + Date.now(),
      itemName,
      category,
      date: new Date().toISOString().split('T')[0],
      pointsEarned: points
    };

    setSegregationHistory((prev) => [newRecord, ...prev]);
    awardPoints(points, `Segregated ${itemName}`);
  };

  const awardPoints = (points: number, reason: string) => {
    if (user) {
      const newPoints = user.ecoPoints + points;
      let updatedBadges = [...user.badges];

      if (newPoints >= 100 && !updatedBadges.includes('🌱 Eco Starter')) {
        updatedBadges.push('🌱 Eco Starter');
      }
      if (newPoints >= 300 && !updatedBadges.includes('♻️ Recycling Hero')) {
        updatedBadges.push('♻️ Recycling Hero');
      }
      if (newPoints >= 600 && !updatedBadges.includes('🌍 Green Champion')) {
        updatedBadges.push('🌍 Green Champion');
      }
      if (newPoints >= 1000 && !updatedBadges.includes('🏆 Eco Champion')) {
        updatedBadges.push('🏆 Eco Champion');
      }

      setUser((prev) => prev ? ({
        ...prev,
        ecoPoints: newPoints,
        itemsRecycled: prev.itemsRecycled + 1,
        wasteSegregatedKg: prev.wasteSegregatedKg + 1,
        badges: updatedBadges
      }) : null);

      showToast(`+${points} Eco Points earned! (${reason})`, 'success');
    }
  };

  const deductPoints = (points: number, reason: string) => {
    if (user) {
      const newPoints = Math.max(0, user.ecoPoints - points);
      setUser((prev) => prev ? ({
        ...prev,
        ecoPoints: newPoints
      }) : null);

      showToast(`Redeemed ${points} Eco Points (${reason})`, 'info');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        user,
        loginUser,
        registerUser,
        updateUserName,
        login: loginUser,
        register: registerUser,
        logoutUser,
        environmentalReports,
        addEnvironmentalReport,
        deleteEnvironmentalReport,
        clearEnvironmentalReports,
        pickupRequests,
        addPickupRequest,
        updatePickupStatus,
        deletePickupRequest,
        contactMessages,
        addContactMessage,
        deleteContactMessage,
        segregationHistory,
        addSegregationRecord,
        awardPoints,
        deductPoints,
        toast,
        showToast,
        hideToast,
        selectedSearchItem,
        setSelectedSearchItem,
        activeWasteItemModal,
        setActiveWasteItemModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
