import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Download,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Briefcase,
  Layers,
  Receipt,
  Tag,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import {
  TRANSACTION_TYPES,
  DEPARTMENTS,
  CORPORATE_ACCOUNTS,
  CATEGORIES,
} from '../utils/constants';
import { formatCurrency, formatCompactINR, formatDate } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { DeleteConfirmModal } from '../components/transactions/DeleteConfirmModal';

export const Transactions = () => {
  const {
    transactions,
    activeCompany,
    openComposer,
    deleteTransaction,
    globalSearch,
    setGlobalSearch,
    exportCSV,
  } = useFinance();

  // Filter States
  const [search, setSearch] = useState(globalSearch || '');
  const [typeFilter, setTypeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | '7days' | '30days' | 'month'
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'amount' | 'title'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Sync globalSearch when top bar updates
  React.useEffect(() => {
    if (globalSearch !== undefined && globalSearch !== search) {
      setSearch(globalSearch);
    }
  }, [globalSearch]);

  const clearAllFilters = () => {
    setSearch('');
    setGlobalSearch('');
    setTypeFilter('all');
    setDepartmentFilter('all');
    setAccountFilter('all');
    setDateFilter('all');
    setSortBy('date');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const isFiltered =
    search !== '' ||
    typeFilter !== 'all' ||
    departmentFilter !== 'all' ||
    accountFilter !== 'all' ||
    dateFilter !== 'all';

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    const now = new Date();

    return transactions
      .filter((tx) => {
        // Search
        if (search) {
          const query = search.toLowerCase();
          const matchTitle = (tx.title || '').toLowerCase().includes(query);
          const matchNotes = (tx.notes || '').toLowerCase().includes(query);
          const matchCounterparty = (tx.counterparty || '').toLowerCase().includes(query);
          const matchTags = (tx.tags || []).some((t) => t.toLowerCase().includes(query));
          if (!matchTitle && !matchNotes && !matchCounterparty && !matchTags) return false;
        }

        // Type
        if (typeFilter !== 'all' && tx.type !== typeFilter) {
          return false;
        }

        // Department
        if (departmentFilter !== 'all' && tx.department !== departmentFilter) {
          return false;
        }

        // Account
        if (accountFilter !== 'all' && tx.account !== accountFilter) {
          return false;
        }

        // Date Range
        if (dateFilter !== 'all') {
          const txDate = new Date(tx.date);
          const diffDays = (now - txDate) / (1000 * 60 * 60 * 24);
          if (dateFilter === '7days' && diffDays > 7) return false;
          if (dateFilter === '30days' && diffDays > 30) return false;
          if (dateFilter === 'month') {
            if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) {
              return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        }
        if (sortBy === 'amount') {
          const amtA = Number(a.amount) || 0;
          const amtB = Number(b.amount) || 0;
          return sortOrder === 'desc' ? amtB - amtA : amtA - amtB;
        }
        if (sortBy === 'title') {
          const titleA = (a.title || '').toLowerCase();
          const titleB = (b.title || '').toLowerCase();
          return sortOrder === 'desc' ? titleB.localeCompare(titleA) : titleA.localeCompare(titleB);
        }
        return 0;
      });
  }, [
    transactions,
    search,
    typeFilter,
    departmentFilter,
    accountFilter,
    dateFilter,
    sortBy,
    sortOrder,
  ]);

  // Aggregate Totals for visible filtered items
  const summaryTotals = useMemo(() => {
    let inflowTotal = 0;
    let outflowTotal = 0;

    filteredTransactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      const typeConfig = TRANSACTION_TYPES[tx.type];
      if (typeConfig?.sign === '+') {
        inflowTotal += amt;
      } else {
        outflowTotal += amt;
      }
    });

    return {
      inflowTotal,
      outflowTotal,
      net: inflowTotal - outflowTotal,
      count: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Corporate Audited Ledger
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30">
              {activeCompany.name}
            </span>
          </div>
          <p className="text-xs text-[#9298AD] mt-0.5">
            Classified corporate transactions across revenue, OPEX, payroll, treasury capital, debt, and tax
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            icon={Download}
            onClick={exportCSV}
            className="border border-white/5 hover:border-white/20"
          >
            Export Ledger CSV
          </Button>

          <Button
            variant="neon"
            size="sm"
            icon={Plus}
            onClick={() => openComposer('operating_expense')}
          >
            Record Entry
          </Button>
        </div>
      </div>

      {/* Filter Summary Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#11131D] border border-white/10">
          <span className="text-[10px] font-mono font-semibold uppercase text-[#939BB2]">
            Filtered Ledger Count
          </span>
          <p className="text-lg font-bold font-mono text-white mt-0.5">
            {summaryTotals.count} Entries
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#11131D] border border-white/10">
          <span className="text-[10px] font-mono font-semibold uppercase text-[#939BB2]">
            Total Inflows
          </span>
          <p className="text-lg font-bold font-mono text-neon-mint mt-0.5">
            +{formatCurrency(summaryTotals.inflowTotal)}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#11131D] border border-white/10">
          <span className="text-[10px] font-mono font-semibold uppercase text-[#939BB2]">
            Total Outflows
          </span>
          <p className="text-lg font-bold font-mono text-white mt-0.5">
            -{formatCurrency(summaryTotals.outflowTotal)}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#11131D] border border-white/10">
          <span className="text-[10px] font-mono font-semibold uppercase text-[#939BB2]">
            Net Cash Variance
          </span>
          <p
            className={`text-lg font-bold font-mono mt-0.5 ${
              summaryTotals.net >= 0 ? 'text-neon-cyan' : 'text-rose-400'
            }`}
          >
            {summaryTotals.net >= 0 ? '+' : ''}
            {formatCurrency(summaryTotals.net)}
          </p>
        </div>
      </div>

      {/* Filter and Control Panel */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth space-y-3">
        {/* Row 1: Search & Type */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9298AD]" />
            <input
              type="text"
              placeholder="Search title, counterparty, notes, or tags..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setGlobalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#181B29] text-xs text-white placeholder-[#555C75] pl-10 pr-8 py-2.5 rounded-xl border border-white/10 focus:border-neon-violet focus:outline-none"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setGlobalSearch('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9298AD] hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="md:col-span-4">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#181B29] text-xs text-white px-3 py-2.5 rounded-xl border border-white/10 focus:border-neon-violet focus:outline-none cursor-pointer"
            >
              <option value="all">All Classifications (10 Types)</option>
              {Object.entries(TRANSACTION_TYPES).map(([k, t]) => (
                <option key={k} value={k}>
                  {t.label} ({t.sign})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#181B29] text-xs text-white px-3 py-2.5 rounded-xl border border-white/10 focus:border-neon-violet focus:outline-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Account, Date & Clear */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          <div className="sm:col-span-4">
            <select
              value={accountFilter}
              onChange={(e) => {
                setAccountFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#181B29] text-xs text-white px-3 py-2.5 rounded-xl border border-white/10 focus:border-neon-violet focus:outline-none cursor-pointer"
            >
              <option value="all">All Corporate Accounts</option>
              {CORPORATE_ACCOUNTS.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.bankName} - {acc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4">
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#181B29] text-xs text-white px-3 py-2.5 rounded-xl border border-white/10 focus:border-neon-violet focus:outline-none cursor-pointer"
            >
              <option value="all">All Time Records</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="month">Current Month Billing</option>
            </select>
          </div>

          <div className="sm:col-span-4 flex items-center justify-end">
            {isFiltered && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 text-xs text-neon-pink hover:text-white px-3 py-2 rounded-xl bg-neon-pink/10 border border-neon-pink/20 transition-colors"
              >
                <X size={13} />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ledger Table Container */}
      <div className="rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-[#0B0D17] text-[#939BB2] uppercase font-mono text-[11px]">
                <th
                  onClick={() => toggleSort('date')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Date
                    <ArrowUpDown size={12} className={sortBy === 'date' ? 'text-neon-cyan' : ''} />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('title')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Transaction & Counterparty
                    <ArrowUpDown size={12} className={sortBy === 'title' ? 'text-neon-cyan' : ''} />
                  </div>
                </th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Account / Rail</th>
                <th
                  onClick={() => toggleSort('amount')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors select-none text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    Amount
                    <ArrowUpDown size={12} className={sortBy === 'amount' ? 'text-neon-cyan' : ''} />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#939BB2]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Receipt size={32} className="text-[#3A405A]" />
                      <p className="text-sm font-semibold text-white">No ledger entries match criteria</p>
                      <p className="text-xs">Adjust your search keyword, department, or date filter.</p>
                      {isFiltered && (
                        <button
                          onClick={clearAllFilters}
                          className="mt-2 text-xs text-neon-cyan hover:underline"
                        >
                          Clear active filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => {
                  const typeConfig = TRANSACTION_TYPES[tx.type] || {
                    label: tx.type,
                    color: '#939BB2',
                    sign: '-',
                  };
                  const dept = DEPARTMENTS.find((d) => d.id === tx.department);
                  const account = CORPORATE_ACCOUNTS.find((a) => a.id === tx.account);
                  const isInflow = typeConfig.sign === '+';

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono text-[#939BB2] whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>

                      {/* Title & Counterparty */}
                      <td className="py-3.5 px-4 min-w-[240px]">
                        <div className="font-semibold text-white group-hover:text-neon-cyan transition-colors line-clamp-1">
                          {tx.title}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#939BB2]">
                          {tx.counterparty && (
                            <span className="flex items-center gap-1 truncate font-sans">
                              <Building2 size={11} className="text-[#6B7280]" />
                              {tx.counterparty}
                            </span>
                          )}
                          {tx.tags && tx.tags.length > 0 && (
                            <span className="font-mono text-[10px] text-neon-violet truncate">
                              #{tx.tags[0]}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Classification Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border inline-flex items-center gap-1.5"
                          style={{
                            backgroundColor: `${typeConfig.color}15`,
                            color: typeConfig.color,
                            borderColor: `${typeConfig.color}35`,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: typeConfig.color }}
                          />
                          {typeConfig.label}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {dept ? (
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono border"
                            style={{
                              backgroundColor: `${dept.color}10`,
                              color: dept.color,
                              borderColor: `${dept.color}25`,
                            }}
                          >
                            {dept.code}
                          </span>
                        ) : (
                          <span className="text-[#6B7280] font-mono text-[10px]">CORP</span>
                        )}
                      </td>

                      {/* Account */}
                      <td className="py-3.5 px-4 text-[#939BB2] font-mono text-[11px] whitespace-nowrap">
                        {account?.bankName || 'General'}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-mono font-bold text-right whitespace-nowrap">
                        <span className={isInflow ? 'text-neon-mint' : 'text-white'}>
                          {isInflow ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openComposer(tx.type, tx)}
                            className="p-1.5 rounded-lg text-[#939BB2] hover:text-white hover:bg-white/10 transition-colors"
                            title="Edit transaction"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(tx)}
                            className="p-1.5 rounded-lg text-[#939BB2] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete transaction"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#939BB2]">
          <div>
            Showing{' '}
            <span className="font-semibold text-white">
              {filteredTransactions.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-white">
              {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
            </span>{' '}
            of <span className="font-semibold text-white">{filteredTransactions.length}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="px-3 py-1 font-mono text-white">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteTransaction(deleteTarget.id);
            setDeleteTarget(null);
          }}
          itemTitle={deleteTarget.title}
        />
      )}
    </div>
  );
};
