import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ArrowRight,
  CornerDownLeft,
  LayoutDashboard,
  Receipt,
  TrendingUp,
  FileSpreadsheet,
  PieChart,
  Users,
  LineChart,
  BrainCircuit,
  Settings,
  Plus,
  Download,
  Eye,
  Building2,
  X,
  Command,
  ChevronRight,
  ShieldCheck,
  Flame,
  Lock,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { apiService } from '../../services/apiService';
import { formatCurrency, formatCompactINR } from '../../utils/formatters';

export const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    openComposer,
    exportCSV,
    exportJSON,
    toggleHideBalance,
    profile,
    transactions,
  } = useFinance();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input whenever opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Command items definitions
  const navigationItems = [
    { id: 'nav-overview', label: 'Executive Command Center', category: 'Navigation', icon: LayoutDashboard, path: '/', shortcut: 'G O' },
    { id: 'nav-transactions', label: 'Corporate Audited Ledger', category: 'Navigation', icon: Receipt, path: '/transactions', shortcut: 'G T' },
    { id: 'nav-investments', label: 'Treasury & Investment Intelligence', category: 'Navigation', icon: TrendingUp, path: '/investments', shortcut: 'G I' },
    { id: 'nav-pnl', label: 'Corporate Profit & Loss (P&L)', category: 'Navigation', icon: FileSpreadsheet, path: '/profit-loss', shortcut: 'G P' },
    { id: 'nav-budgets', label: 'Departmental Budget Ceilings', category: 'Navigation', icon: PieChart, path: '/budgets', shortcut: 'G B' },
    { id: 'nav-payroll', label: 'Payroll & Salary Affordability', category: 'Navigation', icon: Users, path: '/payroll', shortcut: 'G Y' },
    { id: 'nav-forecasts', label: 'Cash Flow & Runway Forecasting', category: 'Navigation', icon: LineChart, path: '/forecasts', shortcut: 'G F' },
    { id: 'nav-advisor', label: 'AI Financial Strategist', category: 'Navigation', icon: BrainCircuit, path: '/advisor', badge: 'AI', shortcut: 'G A' },
    { id: 'nav-settings', label: 'Governance & Entity Settings', category: 'Navigation', icon: Settings, path: '/settings', shortcut: 'G S' },
  ];

  const actionItems = [
    {
      id: 'act-new-opex',
      label: 'Record Operating Expense',
      description: 'Add a new OPEX outflow to the audited ledger',
      category: 'Actions',
      icon: Plus,
      action: () => openComposer('operating_expense'),
    },
    {
      id: 'act-new-rev',
      label: 'Record Revenue Contract',
      description: 'Record an inbound enterprise or recurring SaaS license',
      category: 'Actions',
      icon: Plus,
      action: () => openComposer('revenue'),
    },
    {
      id: 'act-new-treasury',
      label: 'Purchase Treasury Asset',
      description: 'Record T-Bills or Sovereign Bond allocation',
      category: 'Actions',
      icon: TrendingUp,
      action: () => openComposer('investment_purchase'),
    },
    {
      id: 'act-privacy',
      label: profile.hideBalance ? 'Reveal Confidential Balances' : 'Boardroom Privacy Mode',
      description: profile.hideBalance ? 'Show exact currency balances' : 'Mask all sensitive figures with dots',
      category: 'Actions',
      icon: Eye,
      action: () => toggleHideBalance(),
    },
    {
      id: 'act-export-csv',
      label: 'Download Audited CSV Ledger',
      description: 'Export all classified transaction rows as CSV',
      category: 'Actions',
      icon: Download,
      action: () => exportCSV(),
    },
    {
      id: 'act-export-json',
      label: 'Export Complete JSON Snapshot',
      description: 'Download full multi-entity state backup',
      category: 'Actions',
      icon: Download,
      action: () => exportJSON(),
    },
    {
      id: 'act-logout',
      label: 'Sign Out of Terminal',
      description: 'Terminate active session and lock corporate terminal',
      category: 'Security',
      icon: Lock,
      action: () => {
        apiService.logout().finally(() => {
          window.location.href = '/login';
        });
      },
    },
  ];

  // Filtered transaction items matching search
  const transactionItems = useMemo(() => {
    if (!query || query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return transactions
      .filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.counterparty && t.counterparty.toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q))
      )
      .slice(0, 4)
      .map((t) => ({
        id: `tx-${t.id}`,
        label: t.title,
        description: `${t.counterparty || 'Corporate'} • ${formatCurrency(t.amount)} (${formatCompactINR(t.amount)})`,
        category: 'Ledger Records',
        icon: Receipt,
        path: '/transactions',
      }));
  }, [query, transactions]);

  // Combine & filter all items
  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return [...navigationItems, ...actionItems];
    }

    const matchesQuery = (text) => text && text.toLowerCase().includes(q);

    const nav = navigationItems.filter(
      (item) => matchesQuery(item.label) || matchesQuery(item.category)
    );
    const act = actionItems.filter(
      (item) => matchesQuery(item.label) || matchesQuery(item.description)
    );

    return [...nav, ...act, ...transactionItems];
  }, [query, navigationItems, actionItems, transactionItems]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        executeItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const executeItem = (item) => {
    onClose();
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
  };

  // Group items by category for presentation
  const groupedItems = useMemo(() => {
    const groups = {};
    filteredItems.forEach((item, index) => {
      const cat = item.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({ ...item, globalIndex: index });
    });
    return groups;
  }, [filteredItems]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Command Palette Surface — Light Theme */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden z-10 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
        >
          {/* Top indigo accent line */}
          <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />

          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
            <Search size={17} className="text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search commands, pages, or transactions..."
              className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                title="Clear"
              >
                <X size={14} />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center text-[11px] font-mono font-medium text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div
            ref={listRef}
            className="max-h-[380px] overflow-y-auto p-2"
          >
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center space-y-1.5">
                <p className="text-[14px] font-semibold text-gray-900">No results for &ldquo;{query}&rdquo;</p>
                <p className="text-[13px] text-gray-400">Try &ldquo;overview&rdquo;, &ldquo;payroll&rdquo;, &ldquo;expense&rdquo;, or &ldquo;export&rdquo;.</p>
              </div>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="mb-2 last:mb-0">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    {category}
                  </div>
                  <div className="space-y-0.5">
                    {items.map((item) => {
                      const Icon = item.icon;
                      const isSelected = item.globalIndex === selectedIndex;

                      return (
                        <div
                          key={item.id}
                          onClick={() => executeItem(item)}
                          onMouseEnter={() => setSelectedIndex(item.globalIndex)}
                          className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-indigo-50 border border-indigo-200'
                              : 'border border-transparent hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`p-1.5 rounded-lg flex-shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-indigo-100 text-indigo-600'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              <Icon size={15} />
                            </div>
                            <div className="min-w-0">
                              <p className={`text-[13px] font-medium truncate ${
                                isSelected ? 'text-indigo-900' : 'text-gray-900'
                              }`}>
                                {item.label}
                              </p>
                              {item.description && (
                                <p className="text-[12px] text-gray-400 truncate">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {item.badge && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                                {item.badge}
                              </span>
                            )}
                            {item.shortcut && (
                              <span className="hidden sm:inline text-[11px] font-mono text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded bg-gray-50">
                                {item.shortcut}
                              </span>
                            )}
                            {isSelected && (
                              <CornerDownLeft size={13} className="text-indigo-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-[11px] text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-600">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-600">↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-600">↵</kbd>
                Select
              </span>
            </div>
            <span className="text-indigo-600 font-semibold">NexusCapFIN</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
