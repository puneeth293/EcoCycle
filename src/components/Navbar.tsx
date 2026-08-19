import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageRoute } from '../types';
import { 
  Recycle, 
  Menu, 
  X, 
  User as UserIcon, 
  Award, 
  LogOut, 
  LayoutDashboard, 
  ShieldAlert, 
  ChevronRight,
  HelpCircle,
  Truck,
  MapPin,
  Sparkles,
  Camera,
  Zap,
  Upload
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, navigate, user, logoutUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks: { label: string; page: PageRoute; icon?: any }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Waste Segregation', page: 'segregation', icon: Sparkles },
    { label: 'Upload Waste', page: 'upload-waste', icon: Upload },
    { label: 'Electricity Bill', page: 'electricity-bill', icon: Zap },
    { label: 'Waste Pickup', page: 'pickup', icon: Truck },
    { label: 'Collection Centers', page: 'centers', icon: MapPin },
    { label: 'Dashboard', page: 'dashboard', icon: LayoutDashboard },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: PageRoute) => {
    navigate(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-white/70 text-[#063B32] shadow-lg shadow-emerald-950/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-xl p-1.5 transition-transform hover:scale-[1.02]"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-900/20 group-hover:rotate-12 transition-transform">
              <Recycle className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black tracking-tight flex items-center gap-1 font-sans text-[#063B32]">
                <span>Eco</span>
                <span className="text-emerald-600">Cycle</span>
              </div>
              <p className="text-[10px] text-[#365A52] font-bold tracking-wider uppercase -mt-1">
                Waste & Recycling System
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                      : 'text-[#063B32] hover:text-emerald-700 hover:bg-emerald-50/80'
                  }`}
                >
                  {link.icon && (
                    <link.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                  )}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Tablet Compact Nav (< xl) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1">
            {navLinks.slice(0, 6).map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-[#063B32] hover:text-emerald-700 hover:bg-emerald-50/80'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action / User Profile */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 bg-white/90 hover:bg-white border border-emerald-100 px-3 py-1.5 rounded-2xl shadow-sm transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-[#063B32] line-clamp-1">{user.name}</p>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                      <Award className="w-3 h-3 text-amber-500" />
                      <span>{user.ecoPoints} Points</span>
                    </div>
                  </div>
                  {user.role === 'admin' && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] px-1.5 py-0.5 rounded-md">
                      ADMIN
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white/95 border border-white/80 rounded-2xl shadow-2xl p-2 z-50 text-[#063B32] divide-y divide-emerald-100/80 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2.5">
                      <p className="text-[11px] text-[#365A52] font-semibold">Signed in as</p>
                      <p className="text-xs font-black text-[#063B32] truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-[#063B32] hover:bg-emerald-50 hover:text-emerald-700 rounded-xl flex items-center gap-2 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        User Dashboard
                      </button>
                      <button
                        onClick={() => handleNavClick('upload-waste')}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-[#063B32] hover:bg-emerald-50 hover:text-emerald-700 rounded-xl flex items-center gap-2 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-emerald-600" />
                        Upload Waste & Pollution
                      </button>
                      <button
                        onClick={() => handleNavClick('electricity-bill')}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-[#063B32] hover:bg-emerald-50 hover:text-emerald-700 rounded-xl flex items-center gap-2 transition-colors"
                      >
                        <Zap className="w-4 h-4 text-amber-500" />
                        Pay Electricity Bill
                      </button>
                      <button
                        onClick={() => handleNavClick('rewards')}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-[#063B32] hover:bg-emerald-50 hover:text-emerald-700 rounded-xl flex items-center gap-2 transition-colors"
                      >
                        <Award className="w-4 h-4 text-amber-500" />
                        My Rewards & Badges
                      </button>
                      {user.role === 'admin' && (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-xl flex items-center gap-2 transition-colors my-1 border border-amber-200"
                        >
                          <ShieldAlert className="w-4 h-4 text-amber-600" />
                          Admin Control Panel
                        </button>
                      )}
                    </div>
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          logoutUser();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-[#063B32] hover:bg-emerald-50 hover:text-emerald-700 border border-emerald-200/80 transition-all"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all transform active:scale-95"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            {user && (
              <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl text-xs font-bold text-emerald-800 border border-emerald-200">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{user.ecoPoints}</span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/90 hover:bg-white text-[#063B32] border border-emerald-100 shadow-sm transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white/95 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 backdrop-blur-2xl shadow-xl">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-[#063B32] hover:bg-emerald-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {link.icon && (
                      <link.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                    )}
                    <span>{link.label}</span>
                  </span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#365A52]'}`} />
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-emerald-100">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200/80">
                  <div>
                    <p className="text-sm font-black text-[#063B32]">{user.name}</p>
                    <p className="text-xs text-[#365A52]">{user.email}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                    {user.ecoPoints} Points
                  </span>
                </div>
                {user.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full text-center py-2.5 rounded-xl font-bold text-xs bg-amber-100 text-amber-900 border border-amber-300"
                  >
                    🛡️ Admin Control Panel
                  </button>
                )}
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-xl font-bold text-xs bg-rose-50 text-rose-600 border border-rose-200"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full text-center py-2.5 rounded-xl font-bold text-sm bg-white hover:bg-emerald-50 text-[#063B32] border border-emerald-200 shadow-sm"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="w-full text-center py-2.5 rounded-xl font-bold text-sm bg-emerald-600 text-white shadow-md"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
