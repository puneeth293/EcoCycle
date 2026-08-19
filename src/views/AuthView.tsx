import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, UserPlus, Mail, Lock, User, Phone, Sparkles } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, register } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      login(email, password);
    } else {
      register(name, email, password, phone);
    }
  };

  const handleQuickPreset = (preset: 'user' | 'admin') => {
    if (preset === 'user') {
      login('puneeth@ecocycle.org', 'password');
    } else {
      login('admin@ecocycle.org', 'admin123');
    }
  };

  return (
    <div className="py-16 relative z-10 min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl max-w-md w-full space-y-6">
        
        {/* Toggle Mode Pills */}
        <div className="flex rounded-2xl bg-white/60 p-1.5 border border-emerald-200">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              mode === 'login'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-[#365A52] hover:text-[#063B32]'
            }`}
          >
            User Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              mode === 'register'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-[#365A52] hover:text-[#063B32]'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black text-[#063B32]">
            {mode === 'login' ? 'Welcome Back to EcoCycle' : 'Join the EcoCycle Network'}
          </h2>
          <p className="text-xs font-semibold text-[#365A52] mt-1">
            {mode === 'login' ? 'Access your eco points, pickup requests, and history' : 'Sign up to start earning rewards for waste segregation'}
          </p>
        </div>

        {/* Demo Preset Buttons */}
        <div className="glass-subcard p-3.5 rounded-2xl border border-emerald-200 space-y-2">
          <p className="text-[11px] font-black text-emerald-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> 
            <span>Instant Demo One-Click Login:</span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickPreset('user')}
              className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-black text-[11px] hover:bg-emerald-500 shadow-xs transition-all"
            >
              Demo Resident Login
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('admin')}
              className="flex-1 py-2 rounded-xl bg-[#063B32] text-white font-black text-[11px] hover:bg-[#063B32]/90 transition-all shadow-xs"
            >
              Demo Admin Login
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-black text-[#063B32] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Puneeth"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-[#063B32] mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@ecocycle.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#063B32] mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-black text-[#063B32] mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-2 shadow-emerald-600/25"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{mode === 'login' ? 'Log In to EcoCycle' : 'Create Free Account'}</span>
          </button>

        </form>

      </div>
    </div>
  );
};
