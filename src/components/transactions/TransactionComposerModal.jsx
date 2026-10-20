import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Calendar,
  Building2,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Check,
  CreditCard,
  Briefcase,
  Users,
  ShieldCheck,
  Receipt,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import {
  TRANSACTION_TYPES,
  CATEGORIES,
  DEPARTMENTS,
  CORPORATE_ACCOUNTS,
} from '../../utils/constants';
import { Button } from '../ui/Button';

export const TransactionComposerModal = () => {
  const {
    isComposerOpen,
    closeComposer,
    composerInitialType,
    editingTransaction,
    addTransaction,
    updateTransaction,
    profile,
  } = useFinance();

  const [type, setType] = useState('operating_expense');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('cloud_infrastructure');
  const [department, setDepartment] = useState('engineering');
  const [account, setAccount] = useState('acc-hdfc');
  const [counterparty, setCounterparty] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isComposerOpen) {
      if (editingTransaction) {
        setType(editingTransaction.type || 'operating_expense');
        setAmount(String(editingTransaction.amount || ''));
        setTitle(editingTransaction.title || '');
        setCategory(editingTransaction.category || 'cloud_infrastructure');
        setDepartment(editingTransaction.department || 'engineering');
        setAccount(editingTransaction.account || 'acc-hdfc');
        setCounterparty(editingTransaction.counterparty || '');
        setDate(editingTransaction.date ? editingTransaction.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
        setNotes(editingTransaction.notes || '');
      } else {
        setType(composerInitialType || 'operating_expense');
        setAmount('');
        setTitle('');
        setCategory(composerInitialType === 'revenue' ? 'enterprise_license' : 'cloud_infrastructure');
        setDepartment(composerInitialType === 'revenue' ? 'sales_marketing' : 'engineering');
        setAccount('acc-hdfc');
        setCounterparty('');
        setDate(new Date().toISOString().slice(0, 10));
        setNotes('');
      }
      setErrors({});
    }
  }, [isComposerOpen, composerInitialType, editingTransaction]);

  // Adjust defaults when type changes
  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'revenue') {
      setCategory('enterprise_license');
      setDepartment('sales_marketing');
    } else if (newType === 'payroll_expense') {
      setCategory('salaries_wages');
      setDepartment('hr_payroll');
    } else if (newType === 'tax_payment') {
      setCategory('tax_statutory');
      setDepartment('finance_legal');
    } else if (newType === 'investment_purchase') {
      setCategory('treasury_bonds');
      setDepartment('finance_legal');
    }
  };

  const validate = () => {
    const newErrors = {};
    const parsedAmt = parseFloat(amount);

    if (!amount || isNaN(parsedAmt) || parsedAmt <= 0) {
      newErrors.amount = 'Enter a valid amount greater than ₹0';
    } else if (parsedAmt > 1_000_000_000) {
      newErrors.amount = 'Amount exceeds maximum allowable threshold';
    }

    if (!title.trim()) {
      newErrors.title = 'Transaction description is required';
    }

    if (!date) {
      newErrors.date = 'Transaction date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const transactionData = {
      type,
      amount: parseFloat(amount),
      title: title.trim(),
      category,
      department,
      account,
      counterparty: counterparty.trim(),
      date: new Date(date).toISOString(),
      notes: notes.trim(),
    };

    setTimeout(() => {
      if (editingTransaction) {
        updateTransaction(editingTransaction.id, transactionData);
      } else {
        addTransaction(transactionData);
      }
      setIsSubmitting(false);
      closeComposer();
    }, 200);
  };

  if (!isComposerOpen) return null;

  const currentTypeConfig = TRANSACTION_TYPES[type] || TRANSACTION_TYPES.operating_expense;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeComposer}
        className="fixed inset-0 bg-[#08090F]/85 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-2xl bg-[#121624] border border-white/10 rounded-2xl shadow-card-depth overflow-hidden z-10 my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Luminous Top Bar */}
        <div
          className="h-1.5 w-full transition-colors duration-300"
          style={{ backgroundColor: currentTypeConfig.color }}
        />

        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl border"
              style={{
                backgroundColor: `${currentTypeConfig.color}15`,
                borderColor: `${currentTypeConfig.color}40`,
                color: currentTypeConfig.color,
              }}
            >
              <Briefcase size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {editingTransaction ? 'Modify Corporate Transaction' : 'Record Corporate Transaction'}
              </h3>
              <p className="text-xs text-[#939BB2]">
                Audited accounting ledger entry with automatic statement reconciliation
              </p>
            </div>
          </div>

          <button
            onClick={closeComposer}
            className="p-2 text-[#939BB2] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Transaction Type Selector (Chips) */}
          <div>
            <label className="block text-xs font-semibold uppercase font-mono tracking-wider text-[#939BB2] mb-2">
              Corporate Classification
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'revenue', label: 'Revenue Inflow' },
                { id: 'operating_expense', label: 'OPEX Expense' },
                { id: 'payroll_expense', label: 'Payroll & Wages' },
                { id: 'investment_purchase', label: 'Treasury / Asset' },
                { id: 'tax_payment', label: 'Tax Remittance' },
                { id: 'investment_proceeds', label: 'Asset Yield' },
                { id: 'loan_repayment', label: 'Debt Service' },
                { id: 'other_expense', label: 'Other Outlay' },
              ].map((t) => {
                const isSelected = type === t.id;
                const cfg = TRANSACTION_TYPES[t.id];
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTypeChange(t.id)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                      isSelected
                        ? 'bg-[#191E30] text-white shadow-md'
                        : 'bg-[#0E1018] text-[#939BB2] border-white/5 hover:border-white/10'
                    }`}
                    style={{
                      borderColor: isSelected ? cfg.color : undefined,
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hero Amount Input */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#090B12] border border-white/5 relative group">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#939BB2] mb-1">
              Transaction Amount (INR)
            </span>
            <div className="flex items-center justify-center w-full max-w-sm">
              <span className="text-3xl font-mono text-neon-cyan font-bold mr-2 select-none">
                ₹
              </span>
              <input
                type="number"
                step="1000"
                min="1"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors({ ...errors, amount: null });
                }}
                autoFocus
                className="w-full text-center text-4xl sm:text-5xl font-mono font-black text-white bg-transparent outline-none placeholder-[#262A3B] tracking-tight selection:bg-neon-cyan/20"
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-rose-400 mt-2 font-medium">• {errors.amount}</p>
            )}
          </div>

          {/* Title & Counterparty (Adaptive) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#939BB2] mb-1.5">
                Description / Memo
              </label>
              <input
                type="text"
                placeholder={
                  type === 'revenue'
                    ? 'e.g., Enterprise SLA Platform License'
                    : type === 'investment_purchase'
                    ? 'e.g., RBI 91-Day T-Bills Tranche'
                    : 'e.g., GPU Compute Cluster AWS'
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#191E30] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
              />
              {errors.title && (
                <p className="text-xs text-rose-400 mt-1">• {errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#939BB2] mb-1.5">
                {type === 'revenue'
                  ? 'Client / Customer Name'
                  : type === 'investment_purchase'
                  ? 'Custodian / Asset Issuer'
                  : 'Vendor / Counterparty'}
              </label>
              <input
                type="text"
                placeholder={
                  type === 'revenue'
                    ? 'e.g., Bharat FinServe Ltd'
                    : type === 'investment_purchase'
                    ? 'e.g., Reserve Bank of India (RBI)'
                    : 'e.g., Amazon Web Services India'
                }
                value={counterparty}
                onChange={(e) => setCounterparty(e.target.value)}
                className="w-full bg-[#191E30] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
              />
            </div>
          </div>

          {/* Department & Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#939BB2] mb-1.5">
                Cost Center / Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#191E30] text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none cursor-pointer"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#939BB2] mb-1.5">
                Corporate Bank Account
              </label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full bg-[#191E30] text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none cursor-pointer"
              >
                {CORPORATE_ACCOUNTS.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Optional Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#939BB2] mb-1.5">
                Transaction Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#191E30] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#939BB2] mb-1.5">
                Internal Audit Notes
              </label>
              <input
                type="text"
                placeholder="e.g., PO #4819, quarterly invoice contract"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#191E30] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button
              variant="secondary"
              size="sm"
              onClick={closeComposer}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="neon"
              size="sm"
              isLoading={isSubmitting}
              icon={Check}
            >
              {editingTransaction ? 'Save Changes' : 'Post to Ledger'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
