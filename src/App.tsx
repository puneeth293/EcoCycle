import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { WasteItemModal } from './components/WasteItemModal';
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { GlobalBackground } from './components/GlobalBackground';

import { HomeView } from './views/HomeView';
import { SegregationView } from './views/SegregationView';
import { UploadWasteView } from './views/UploadWasteView';
import { ElectricityBillView } from './views/ElectricityBillView';
import { AIBotView } from './views/AIBotView';
import { PickupView } from './views/PickupView';
import { CentersView } from './views/CentersView';
import { DashboardView } from './views/DashboardView';
import { RewardsView } from './views/RewardsView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { AuthView } from './views/AuthView';
import { AdminView } from './views/AdminView';

const MainContent: React.FC = () => {
  const { currentPage } = useApp();

  return (
    <div className="relative min-h-screen flex flex-col text-[#063B32] transition-colors font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      {/* Cinematic Global Environmental Background */}
      <GlobalBackground />

      {/* Foreground Content Stack */}
      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 pb-12">
          {currentPage === 'home' && <HomeView />}
          {currentPage === 'segregation' && <SegregationView />}
          {currentPage === 'upload-waste' && <UploadWasteView />}
          {currentPage === 'electricity-bill' && <ElectricityBillView />}
          {currentPage === 'ai-bot' && <AIBotView />}
          {currentPage === 'pickup' && <PickupView />}
          {currentPage === 'centers' && <CentersView />}
          {currentPage === 'dashboard' && <DashboardView />}
          {currentPage === 'rewards' && <RewardsView />}
          {currentPage === 'about' && <AboutView />}
          {currentPage === 'contact' && <ContactView />}
          {currentPage === 'login' && <AuthView />}
          {currentPage === 'admin' && <AdminView />}
        </main>

        <Footer />
      </div>

      <Toast />
      <WasteItemModal />
      <AIAssistantWidget />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
