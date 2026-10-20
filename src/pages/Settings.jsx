import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Building2,
  DollarSign,
  Download,
  RotateCcw,
  Shield,
  ShieldCheck,
  Volume2,
  Eye,
  Sliders,
  Check,
  CheckCircle2,
  Coins,
  Sparkles,
  FileText,
  Lock,
  Globe,
  Briefcase,
  AlertTriangle,
  Users,
  Activity,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatCompactINR } from '../utils/formatters';

export const Settings = () => {
  const { user, permissions, company } = useAuth();
  const {
    profile,
    updateProfile,
    activeCompany,
    resetToDemoData,
    exportJSON,
    exportCSV,
  } = useFinance();

  const [formData, setFormData] = useState({
    name: profile.name || user?.name || 'partner',
    handle: profile.handle || '@partner_apex',
    email: profile.email || user?.email || 'partner@apextech.in',
    role: profile.role || user?.designation || 'Chief Financial Officer & Managing Partner',
    currency: profile.currency || 'INR',
    minimumReserveAmount: profile.minimumReserveAmount || 4500000,
    minimumReserveMonths: profile.minimumReserveMonths || 3.5,
    soundEffects: profile.soundEffects !== false,
    reducedMotion: profile.reducedMotion === true,
    hideBalance: profile.hideBalance === true,
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  // Users Management State
  const [companyUsers, setCompanyUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Load audit logs and users if authorized
  useEffect(() => {
    if (permissions?.canViewAuditLogs) {
      setIsLoadingAudit(true);
      apiService
        .getAuditLogs()
        .then((res) => setAuditLogs(res.auditLogs || []))
        .catch(() => {})
        .finally(() => setIsLoadingAudit(false));
    }

    if (permissions?.canManageUsers) {
      setIsLoadingUsers(true);
      apiService
        .getUsers()
        .then((res) => setCompanyUsers(res.users || []))
        .catch(() => {})
        .finally(() => setIsLoadingUsers(false));
    }
  }, [permissions]);

  const handleRefreshAudit = () => {
    setIsLoadingAudit(true);
    apiService
      .getAuditLogs()
      .then((res) => setAuditLogs(res.auditLogs || []))
      .catch(() => {})
      .finally(() => setIsLoadingAudit(false));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggle = (key) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      updateProfile(updated);
      return updated;
    });
  };

  const handleResetConfirm = () => {
    resetToDemoData();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Corporate Governance & Security
        </h2>
        <p className="text-xs text-[#9298AD] mt-0.5">
          Single-company access controls, legal entity profile, audit trail, and statutory liquidity policy
        </p>
      </div>

      {/* Predefined Single-Company Entity Profile */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#121624] via-[#11131D] to-[#121624] border border-white/10 shadow-card-depth flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30">
            <Building2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{company?.name || activeCompany.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neon-mint/15 text-neon-mint border border-neon-mint/30">
                Single Corporate Scope
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#939BB2] font-mono mt-1">
              <span>CIN: {company?.cin || activeCompany.cin}</span>
              <span>•</span>
              <span>GSTIN: {company?.gstin || activeCompany.gstin}</span>
              <span>•</span>
              <span>PAN: {company?.pan || activeCompany.pan}</span>
            </div>
            <p className="text-[11px] text-[#6B7280] font-sans mt-0.5">
              Registered Office: Bengaluru, Karnataka, India • Base Currency: INR (₹)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neon-mint/10 border border-neon-mint/20 text-xs font-mono text-neon-mint">
          <ShieldCheck size={14} />
          <span>Private Tenant Locked</span>
        </div>
      </div>

      {/* Authorized Company Users & Roles (Visible to Administrator) */}
      {permissions?.canManageUsers && (
        <div className="p-6 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Company User Access Control</h3>
                <p className="text-xs text-[#9298AD]">
                  Authorized personnel belonging to Apex Technologies Pvt Ltd
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-neon-cyan px-2.5 py-1 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20">
              Admin Governance Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-mono uppercase tracking-wider text-[#939BB2]">
                  <th className="py-2.5 px-3">Officer</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Last Verified Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {companyUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#191E30]/60 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-sans font-bold text-white">{u.name}</p>
                      <p className="text-[11px] text-[#939BB2]">{u.email}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neon-violet/15 text-neon-cyan border border-neon-violet/25">
                        {u.role.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-300 font-sans">{u.department}</td>
                    <td className="py-3 px-3">
                      <span className="text-neon-mint flex items-center gap-1 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-mint" />
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-[#939BB2] text-[11px]">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Security Audit Trail (Visible to Administrator & Finance Manager) */}
      {permissions?.canViewAuditLogs && (
        <div className="p-6 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-neon-mint/10 text-neon-mint border border-neon-mint/20">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Security & Activity Audit Log</h3>
                <p className="text-xs text-[#9298AD]">
                  Immutable ledger of session verifications, policy updates, and ledger actions
                </p>
              </div>
            </div>
            <button
              onClick={handleRefreshAudit}
              disabled={isLoadingAudit}
              className="p-1.5 rounded-lg text-[#939BB2] hover:text-white hover:bg-white/5 transition-colors"
              title="Refresh audit log"
            >
              <RefreshCw size={15} className={isLoadingAudit ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-mono uppercase tracking-wider text-[#939BB2]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Officer</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                {auditLogs.slice(0, 8).map((log) => (
                  <tr key={log.id} className="hover:bg-[#191E30]/40 transition-colors">
                    <td className="py-2.5 px-3 text-[#939BB2] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="text-white font-semibold">{log.userName}</span>
                      <span className="text-[#6B7280] block text-[10px]">{log.userRole}</span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="text-neon-cyan font-bold">{log.action}</span>
                    </td>
                    <td className="py-2.5 px-3 text-[#939BB2] font-sans text-xs min-w-[200px]">
                      {log.details}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <span
                        className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                          log.status === 'SUCCESS'
                            ? 'text-neon-mint bg-neon-mint/10'
                            : 'text-rose-400 bg-rose-500/10'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Statutory Reserve & Liquidity Policy Card */}
      <div className="p-6 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="p-2.5 rounded-xl bg-neon-mint/10 text-neon-mint border border-neon-mint/20">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Statutory Liquidity & Runway Policy</h3>
            <p className="text-xs text-[#9298AD]">
              Set the hard cash reserve floors required to safeguard operations, payroll, and debt commitments
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-[#9298AD] mb-1.5 font-mono">
              Minimum Cash Reserve Floor (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-[#9298AD]">₹</span>
              <input
                type="number"
                step="100000"
                min="0"
                disabled={permissions?.isReadOnly}
                value={formData.minimumReserveAmount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minimumReserveAmount: Math.max(0, parseFloat(e.target.value) || 0),
                  }))
                }
                className="w-full bg-[#181B29] text-xs text-white pl-8 pr-4 py-2.5 rounded-xl border border-white/10 font-mono focus:border-neon-mint focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-[#6B7280] mt-1 font-mono">
              Current policy: {formatCompactINR(formData.minimumReserveAmount)} ({formatCurrency(formData.minimumReserveAmount)})
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#9298AD] mb-1.5 font-mono">
              Target Minimum Survival Runway (Months)
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="24"
              disabled={permissions?.isReadOnly}
              value={formData.minimumReserveMonths}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  minimumReserveMonths: Math.max(1, parseFloat(e.target.value) || 1),
                }))
              }
              className="w-full bg-[#181B29] text-xs text-white px-4 py-2.5 rounded-xl border border-white/10 font-mono focus:border-neon-mint focus:outline-none"
            />
            <p className="text-[11px] text-[#6B7280] mt-1 font-mono">
              Platform triggers visual warning if liquid runway drops below this threshold.
            </p>
          </div>
        </div>
      </div>

      {/* Operator & Officer Profile */}
      <div className="p-6 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="p-2.5 rounded-xl bg-neon-violet/10 text-neon-violet border border-neon-violet/20">
            <User size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Authenticated Officer Credentials</h3>
            <p className="text-xs text-[#9298AD]">
              Identity of the active corporate officer in this session
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#9298AD] mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                disabled={permissions?.isReadOnly}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#181B29] text-xs text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-neon-violet focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#9298AD] mb-1.5">
                Designation
              </label>
              <input
                type="text"
                disabled={permissions?.isReadOnly}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-[#181B29] text-xs text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-neon-violet focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#9298AD] mb-1.5">
                Corporate Email
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full bg-[#181B29] text-xs text-[#7B839E] px-4 py-2.5 rounded-xl border border-white/5 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#9298AD] mb-1.5">
                Assigned Role
              </label>
              <input
                type="text"
                disabled
                value={permissions?.roleName || user?.role || 'Administrator'}
                className="w-full bg-[#181B29] text-xs text-neon-cyan font-bold px-4 py-2.5 rounded-xl border border-white/5 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saveSuccess ? (
              <span className="flex items-center gap-1.5 text-xs text-neon-mint font-medium animate-fadeIn">
                <CheckCircle2 size={15} /> Preferences saved successfully.
              </span>
            ) : <span />}

            {!permissions?.isReadOnly && (
              <Button variant="neon" size="sm" type="submit">
                Save Preferences
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Privacy, Display & System Controls */}
      <div className="p-6 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <Eye size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Privacy & Workspace Controls</h3>
            <p className="text-xs text-[#9298AD]">
              Configure screen masking for presentations and motion dynamics
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B0D17] border border-white/5">
            <div className="flex items-center gap-3">
              <Lock size={16} className="text-[#939BB2]" />
              <div>
                <p className="text-xs font-semibold text-white">Boardroom Privacy Mode</p>
                <p className="text-[11px] text-[#939BB2]">
                  Mask sensitive bank balances and company cash numbers with dots
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('hideBalance')}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                formData.hideBalance ? 'bg-neon-cyan shadow-glow-cyan/50' : 'bg-[#2A3048]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  formData.hideBalance ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data Governance & Audited Exports */}
      <div className="p-6 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="p-2.5 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
            <Download size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Audited Financial Ledger Exports</h3>
            <p className="text-xs text-[#9298AD]">
              Extract raw financial telemetry scoped exclusively to Apex Technologies Pvt Ltd
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0B0D17] border border-white/5 flex flex-col justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-white">Corporate Ledger Export (.CSV)</p>
              <p className="text-[11px] text-[#939BB2] mt-0.5">
                Download all audited transactions with counterparties and classifications.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={exportCSV}
              className="w-full justify-center"
            >
              Download CSV Ledger
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0D17] border border-white/5 flex flex-col justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-white">Full Company Snapshot (.JSON)</p>
              <p className="text-[11px] text-[#939BB2] mt-0.5">
                Export complete database state including payroll, treasury, and departmental budgets.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={exportJSON}
              className="w-full justify-center"
            >
              Export JSON Backup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
