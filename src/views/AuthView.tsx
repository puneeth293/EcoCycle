import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, register, currentPage, navigate, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(
    currentPage === 'register' ? 'register' : 'login'
  );
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode when navigated via URL or navbar clicks
  useEffect(() => {
    if (currentPage === 'register' && mode !== 'register') {
      setMode('register');
      setFormError('');
    } else if (currentPage === 'login' && mode !== 'login') {
      setMode('login');
      setFormError('');
    }
  }, [currentPage]);

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setFormError('');
    navigate(newMode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (mode === 'register') {
      const cleanName = name.trim();
      if (!cleanName) {
        setFormError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setFormError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setFormError('Passwords do not match. Please verify your password.');
        return;
      }
      if (!agreeTerms) {
        setFormError('Please accept the municipal waste segregation agreement to proceed.');
        return;
      }

      setIsSubmitting(true);
      const success = register(cleanName, cleanEmail, password, phone);
      setIsSubmitting(false);
      if (!success) {
        setFormError('An account with this email already exists. Please log in.');
      }
    } else {
      if (!password) {
        setFormError('Please enter your password.');
        return;
      }
      setIsSubmitting(true);
      const success = login(cleanEmail, password);
      setIsSubmitting(false);
      if (!success) {
        setFormError('Invalid email or password. Please try again.');
      }
    }
  };

  const handleQuickPreset = (preset: 'resident' | 'admin' | 'sample-register') => {
    setFormError('');
    if (preset === 'resident') {
      login('resident@recynova.org', 'password');
    } else if (preset === 'admin') {
      login('admin@recynova.org', 'admin123');
    } else if (preset === 'sample-register') {
      const sampleNum = Math.floor(100 + Math.random() * 900);
      setName(`Eco Citizen ${sampleNum}`);
      setEmail(`citizen${sampleNum}@example.com`);
      setPassword('password123');
      setConfirmPassword('password123');
      setPhone('+91 98765 43210');
      setAgreeTerms(true);
      showToast('Sample registration details populated!', 'info');
    }
  };

  return (
    <div className="py-12 relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl max-w-md w-full space-y-6 border border-white/80">
        
        {/* Toggle Mode Pills */}
        <div className="flex rounded-2xl bg-white/70 p-1.5 border border-emerald-200/80 shadow-xs">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-[#365A52] hover:text-[#063B32]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-[#365A52] hover:text-[#063B32]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Title Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-[#063B32]">
            {mode === 'login' ? 'Welcome Back to Recynova' : 'Create Your Recynova Account'}
          </h2>
          <p className="text-xs font-semibold text-[#365A52]">
            {mode === 'login' 
              ? 'Sign in to access your eco points, pickup requests, and rewards' 
              : 'Join today and receive +50 Welcome Eco Points automatically 🌱'}
          </p>
        </div>

        {/* Error Alert Box */}
        {formError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <p>{formError}</p>
              {formError.includes('already exists') && (
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="mt-1.5 text-[11px] text-emerald-700 font-extrabold underline block hover:text-emerald-800"
                >
                  Click here to switch to Sign In
                </button>
              )}
            </div>
          </div>
        )}

        {/* Demo Fast Login Bar */}
        <div className="glass-subcard p-3.5 rounded-2xl border border-emerald-200 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black text-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> 
              <span>Instant 1-Click Testing:</span>
            </p>
            {mode === 'register' && (
              <button
                type="button"
                onClick={() => handleQuickPreset('sample-register')}
                className="text-[10px] font-bold text-emerald-700 hover:underline"
              >
                Auto-fill Form
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickPreset('resident')}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] shadow-xs transition-all text-center"
            >
              Demo Resident
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('admin')}
              className="py-2 px-3 rounded-xl bg-[#063B32] hover:bg-[#063B32]/90 text-white font-black text-[11px] shadow-xs transition-all text-center"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-black text-[#063B32] mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Kumar"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-[#063B32] mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-black text-[#063B32]">
                Password <span className="text-rose-500">*</span>
              </label>
              {mode === 'register' && (
                <span className="text-[10px] text-[#365A52] font-semibold">Min. 6 characters</span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#365A52] hover:text-[#063B32]"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-black text-[#063B32] mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-[#365A52] hover:text-[#063B32]"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[10px] text-rose-600 font-bold mt-1">Passwords do not match</p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                  </p>
                )}
              </div>

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

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agree-pledge"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <label htmlFor="agree-pledge" className="text-[11px] text-[#365A52] font-semibold cursor-pointer">
                  I agree to segregate recyclable waste, dry waste, and wet waste as per municipal standards.
                </label>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-2 shadow-emerald-600/25 active:scale-98 disabled:opacity-50"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>
              {isSubmitting 
                ? 'Processing...' 
                : mode === 'login' 
                  ? 'Sign In to Recynova' 
                  : 'Complete Registration & Claim +50 Points'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Footer switch option */}
        <div className="pt-2 text-center border-t border-emerald-100">
          {mode === 'login' ? (
            <p className="text-xs text-[#365A52] font-semibold">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-emerald-700 font-black hover:underline"
              >
                Create Account Now
              </button>
            </p>
          ) : (
            <p className="text-xs text-[#365A52] font-semibold">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-emerald-700 font-black hover:underline"
              >
                Sign In Here
              </button>
            </p>
          )}
        </div>

        {/* Security Trust Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#365A52] font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Municipal Environmental Network Protected</span>
        </div>

      </div>
    </div>
  );
};
