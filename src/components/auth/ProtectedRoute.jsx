import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

export const ProtectedRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, isLoading, permissions, company } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090F] flex flex-col items-center justify-center p-4">
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan via-neon-violet to-neon-pink p-[1px] shadow-glow-violet animate-pulse mb-4">
          <div className="w-full h-full bg-[#08090F] rounded-[15px] flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 text-neon-cyan"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3L2 20h20L12 3z" fill="rgba(34, 211, 238, 0.2)" />
              <path d="M12 9l-4 8h8l-4-8z" stroke="#A855F7" fill="rgba(168, 85, 247, 0.35)" />
            </svg>
          </div>
        </div>
        <p className="text-sm font-bold text-white font-mono tracking-wider flex items-center gap-2">
          FINORA SECURE GATEWAY
          <span className="w-1.5 h-1.5 rounded-full bg-neon-mint animate-ping" />
        </p>
        <p className="text-xs text-[#9298AD] mt-1 font-mono">
          Verifying single-company credentials for Apex Technologies...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check specific role permission if required
  if (requiredPermission && permissions && !permissions[requiredPermission]) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 rounded-2xl bg-[#11131D] border border-rose-500/30 shadow-card-depth text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <ShieldAlert size={26} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Corporate Access Restricted
          </h2>
          <p className="text-xs text-[#9298AD] mt-1.5 max-w-md mx-auto leading-relaxed">
            Your authenticated role does not have authorization to access this module under the{' '}
            <span className="text-white font-semibold">{company?.name || 'Apex Technologies'}</span> Security & Information Governance Policy.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[#0B0D17] border border-white/5 text-xs text-[#9298AD] font-mono max-w-sm mx-auto">
          Required Permission: <span className="text-rose-400 font-bold">{requiredPermission}</span>
        </div>

        <div className="pt-2">
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={() => window.history.back()}
          >
            Return to Authorized Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return children;
};
