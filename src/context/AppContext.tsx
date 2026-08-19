import React, { createContext, useContext, useState, useEffect } from 'react';
import { PageRoute, UserProfile, PickupRequest, SegregationRecord } from '../types';
import { INITIAL_WASTE_ITEMS } from '../data/wasteData';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

interface AppContextType {
  currentPage: PageRoute;
  navigate: (page: PageRoute) => void;
  user: UserProfile | null;
  loginUser: (email: string, passwordOrRole?: string) => void;
  registerUser: (name: string, email: string, passwordOrPhone?: string, phone?: string) => void;
  login: (email: string, passwordOrRole?: string) => void;
  register: (name: string, email: string, passwordOrPhone?: string, phone?: string) => void;
  logoutUser: () => void;
  pickupRequests: PickupRequest[];
  addPickupRequest: (requestData: Omit<PickupRequest, 'id' | 'status' | 'createdAt'>) => Promise<PickupRequest>;
  updatePickupStatus: (id: string, status: PickupRequest['status']) => void;
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

const DEFAULT_USER: UserProfile = {
  id: 'u-101',
  name: 'Puneeth',
  email: 'puneeth@ecocycle.org',
  phone: '+91 98765 43210',
  role: 'user',
  ecoPoints: 420,
  itemsRecycled: 24,
  wasteSegregatedKg: 18,
  pickupRequestsCount: 5,
  joinedDate: '2026-01-15',
  badges: ['🌱 Eco Starter', '♻️ Recycling Hero']
};

const DEFAULT_PICKUPS: PickupRequest[] = [
  {
    id: 'EC-2026-00125',
    userName: 'Puneeth',
    userEmail: 'puneeth@ecocycle.org',
    userPhone: '+91 98765 43210',
    address: '102 Green Enclave, M.G. Road',
    city: 'Tumkur',
    wasteType: 'Recyclable Waste',
    quantity: '15 kg',
    preferredDate: '2026-08-10',
    preferredTime: '10:00 AM - 01:00 PM',
    notes: 'Paper boxes and washed plastic bottles in separate bags.',
    status: 'Confirmed',
    createdAt: '2026-08-05T10:30:00Z',
  },
  {
    id: 'EC-2026-00126',
    userName: 'Rahul Verma',
    userEmail: 'rahul@example.com',
    userPhone: '+91 91234 56789',
    address: '45 Eco Heights, Ashok Nagar',
    city: 'Tumkur',
    wasteType: 'E-Waste',
    quantity: '8 kg',
    preferredDate: '2026-08-11',
    preferredTime: '02:00 PM - 05:00 PM',
    notes: 'Old computer monitors and printer cables.',
    status: 'Assigned',
    createdAt: '2026-08-06T14:15:00Z',
  },
  {
    id: 'EC-2026-00127',
    userName: 'Priya Nair',
    userEmail: 'priya@example.com',
    userPhone: '+91 99887 76655',
    address: '12 Palm Grove, Indiranagar',
    city: 'Bengaluru',
    wasteType: 'Dry Waste',
    quantity: '25 kg',
    preferredDate: '2026-08-09',
    preferredTime: '09:00 AM - 12:00 PM',
    notes: 'Cardboard packing boxes from moving.',
    status: 'Collected',
    createdAt: '2026-08-04T09:00:00Z',
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ecocycle_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>(() => {
    const saved = localStorage.getItem('ecocycle_pickups');
    return saved ? JSON.parse(saved) : DEFAULT_PICKUPS;
  });

  const [segregationHistory, setSegregationHistory] = useState<SegregationRecord[]>(() => {
    const saved = localStorage.getItem('ecocycle_history');
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

  useEffect(() => {
    if (user) {
      localStorage.setItem('ecocycle_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ecocycle_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ecocycle_pickups', JSON.stringify(pickupRequests));
  }, [pickupRequests]);

  useEffect(() => {
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

  const loginUser = (email: string, passwordOrRole: string = 'user') => {
    if (passwordOrRole === 'admin' || email.toLowerCase().includes('admin') || passwordOrRole === 'admin123') {
      const adminProfile: UserProfile = {
        id: 'admin-001',
        name: 'System Admin',
        email: email || 'admin@ecocycle.org',
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
    } else {
      const userProfile: UserProfile = {
        id: 'u-' + Date.now(),
        name: email.split('@')[0] || 'Eco Guardian',
        email: email,
        phone: '+91 98765 43210',
        role: 'user',
        ecoPoints: 250,
        itemsRecycled: 12,
        wasteSegregatedKg: 10,
        pickupRequestsCount: 2,
        joinedDate: new Date().toISOString().split('T')[0],
        badges: ['🌱 Eco Starter']
      };
      setUser(userProfile);
      showToast(`Welcome back, ${userProfile.name}! 🌱`, 'success');
      navigate('dashboard');
    }
  };

  const registerUser = (name: string, email: string, passwordOrPhone?: string, phone?: string) => {
    const userPhone = phone || passwordOrPhone || '+91 98765 43210';
    const newUser: UserProfile = {
      id: 'u-' + Date.now(),
      name: name,
      email: email,
      phone: userPhone,
      role: 'user',
      ecoPoints: 50, // Welcome bonus
      itemsRecycled: 0,
      wasteSegregatedKg: 0,
      pickupRequestsCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      badges: ['🌱 Eco Starter']
    };
    setUser(newUser);
    showToast('Account created! You earned 50 Welcome Eco Points 🌱', 'success');
    navigate('dashboard');
  };

  const logoutUser = () => {
    setUser(null);
    showToast('Logged out successfully.', 'info');
    navigate('home');
  };

  const addPickupRequest = async (requestData: Omit<PickupRequest, 'id' | 'status' | 'createdAt'>): Promise<PickupRequest> => {
    try {
      // Call backend API endpoint
      const response = await fetch('/api/pickups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      let newRecord: PickupRequest;
      if (response.ok) {
        newRecord = await response.json();
      } else {
        const requestId = `EC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        newRecord = {
          ...requestData,
          id: requestId,
          status: 'Pending',
          createdAt: new Date().toISOString()
        };
      }

      setPickupRequests((prev) => [newRecord, ...prev]);

      if (user) {
        setUser((prev) => prev ? ({
          ...prev,
          pickupRequestsCount: prev.pickupRequestsCount + 1,
          ecoPoints: prev.ecoPoints + 30
        }) : null);
      }

      showToast(`Pickup Request Submitted! ID: ${newRecord.id} (+30 Eco Points)`, 'success');
      return newRecord;
    } catch (err) {
      console.error('Error submitting pickup request:', err);
      const requestId = `EC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const fallbackRecord: PickupRequest = {
        ...requestData,
        id: requestId,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      setPickupRequests((prev) => [fallbackRecord, ...prev]);
      showToast(`Pickup Request Submitted! ID: ${fallbackRecord.id}`, 'success');
      return fallbackRecord;
    }
  };

  const updatePickupStatus = (id: string, status: PickupRequest['status']) => {
    setPickupRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
    // Optionally call backend
    fetch(`/api/pickups/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch((err) => console.log('Status update synced locally'));

    showToast(`Request ${id} status updated to ${status}`, 'info');
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
        login: loginUser,
        register: registerUser,
        logoutUser,
        pickupRequests,
        addPickupRequest,
        updatePickupStatus,
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
