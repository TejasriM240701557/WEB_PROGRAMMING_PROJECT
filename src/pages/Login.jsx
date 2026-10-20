import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  KeyRound,
  Fingerprint,
  X,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NexusCapLogo } from '../components/ui/NexusCapLogo';

// Demo accounts for quick testing
const DEMO_ROLES = [
  {
    role: 'Administrator',
    email: 'partner@apextech.in',
    pass: 'Finora@2026',
    desc: 'Full admin rights',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  },
  {
    role: 'Finance Manager',
    email: 'kavita.nair@apextech.in',
    pass: 'Finance@2026',
    desc: 'Ledger, budgets, P&L',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  {
    role: 'HR / Payroll',
    email: 'vikram.joshi@apextech.in',
    pass: 'Payroll@2026',
    desc: 'Roster & payroll',
    color: 'bg-violet-50 text-violet-700 border-violet-100',
  },
  {
    role: 'Executive Viewer',
    email: 'board.viewer@apextech.in',
    pass: 'Viewer@2026',
    desc: 'Read-only access',
    color: 'bg-amber-50 text-amber-700 border-amber-100',
  },
];

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const destination = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    if (result.success) {
      navigate(destination, { replace: true });
    } else {
      setError(result.error);
    }
  };

  const handleQuickFill = (roleItem) => {
    setEmail(roleItem.email);
    setPassword(roleItem.pass);
    setError('');
  };

  const handleSSOLogin = async () => {
    setIsSubmitting(true);
    setError('');
    const result = await login('partner@apextech.in', 'Finora@2026');
    setIsSubmitting(false);
    if (result.success) navigate(destination, { replace: true });
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      const res = await forgotPassword(forgotEmail);
      setForgotSuccess(res.message);
    } catch {
      setForgotSuccess('If this email is registered, a password reset link has been sent.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col">
      {/* Top bar */}
      <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
        <NexusCapLogo />
        <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span className="hidden sm:inline">Secure login</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden">
            {/* Card Header */}
            <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex flex-col items-center text-center">
              <NexusCapLogo size="lg" className="justify-center" />
              <h1 className="mt-4 text-[22px] font-bold text-gray-900 tracking-tight">Sign in to NexusCapFIN</h1>
              <p className="text-[13px] text-gray-500 mt-1">Financial Intelligence Platform</p>
            </div>

            {/* Card Body */}
            <div className="px-8 py-6 space-y-5">
              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-600">
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="name@company.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-[14px] text-gray-900 bg-white placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[12px] font-medium text-gray-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setIsForgotOpen(true)}
                      className="text-[12px] text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-[14px] text-gray-900 bg-white placeholder-gray-400 pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="remember" className="text-[13px] text-gray-600 cursor-pointer">
                    Keep me signed in
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-[14px] font-semibold rounded-lg transition-colors shadow-sm"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign in
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              {/* SSO divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[12px] text-gray-400">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleSSOLogin}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg text-[13px] text-gray-700 font-medium transition-colors"
                >
                  <Fingerprint size={14} className="text-indigo-500" />
                  Google SSO
                </button>
                <button
                  type="button"
                  onClick={handleSSOLogin}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg text-[13px] text-gray-700 font-medium transition-colors"
                >
                  <KeyRound size={14} className="text-violet-500" />
                  Microsoft
                </button>
              </div>
            </div>

            {/* Quick demo access */}
            <div className="px-8 pb-8 pt-2 border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Quick demo access
              </p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ROLES.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleQuickFill(r)}
                    className={`p-2.5 rounded-lg border text-left transition-all hover:shadow-sm ${r.color}`}
                    title={r.desc}
                  >
                    <p className="text-[12px] font-semibold truncate">{r.role}</p>
                    <p className="text-[11px] opacity-70 truncate">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-[12px] text-gray-400 mt-4">
            © 2026 NexusCapFIN · Financial Intelligence Platform
          </p>
        </motion.div>
      </main>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-gray-900">
                <KeyRound size={16} className="text-indigo-500" />
                Reset Password
              </div>
              <button
                onClick={() => { setIsForgotOpen(false); setForgotSuccess(''); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[13px] text-emerald-700">
                <p>{forgotSuccess}</p>
                <button
                  className="mt-3 w-full py-2 px-4 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => { setIsForgotOpen(false); setForgotSuccess(''); }}
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Enter your registered email to receive a password reset link.
                </p>
                <input
                  type="email"
                  required
                  placeholder="name@company.in"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full text-[14px] text-gray-900 placeholder-gray-400 px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="flex-1 py-2 px-4 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    Send link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
