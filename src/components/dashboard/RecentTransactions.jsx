import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  ChevronRight,
  Briefcase,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TRANSACTION_TYPES, DEPARTMENTS } from '../../utils/constants';
import { DeleteConfirmModal } from '../transactions/DeleteConfirmModal';

export const RecentTransactions = () => {
  const { transactions, openComposer, deleteTransaction } = useFinance();
  const navigate = useNavigate();

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const filtered = transactions
    .filter((tx) => (filterType === 'all' ? true : tx.type === filterType))
    .slice(0, 6);

  const handleEdit = (tx) => {
    setActiveMenuId(null);
    openComposer(tx.type, tx);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">Transactions</h3>
          <p className="text-[12px] text-gray-400 mt-0.5">Latest financial records</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter tabs */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-[12px]">
            {[
              { key: 'all', label: 'All' },
              { key: 'revenue', label: 'Revenue' },
              { key: 'operating_expense', label: 'OPEX' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 ${
                  filterType === f.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/transactions')}
            className="text-[12px] text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 font-medium whitespace-nowrap"
          >
            View all
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="p-3">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-[13px] text-gray-400">
            No matching transactions found.
          </div>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((tx) => {
              const isRevenue = ['revenue', 'investment_proceeds', 'loan_proceeds'].includes(tx.type);
              const typeConfig = TRANSACTION_TYPES[tx.type] || TRANSACTION_TYPES.operating_expense;
              const deptConfig = DEPARTMENTS.find((d) => d.id === tx.department);
              const isMenuOpen = activeMenuId === tx.id;

              return (
                <div
                  key={tx.id}
                  className="group relative flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Icon */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isRevenue ? 'bg-emerald-50' : 'bg-red-50'
                      }`}
                    >
                      {isRevenue
                        ? <ArrowUpRight size={15} className="text-emerald-600" />
                        : <ArrowDownLeft size={15} className="text-red-500" />}
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-gray-900 truncate">
                        {tx.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-400">
                        <span>{formatDate(tx.date, 'short')}</span>
                        {tx.counterparty && (
                          <>
                            <span>·</span>
                            <span className="truncate max-w-[100px]">{tx.counterparty}</span>
                          </>
                        )}
                        {deptConfig && (
                          <>
                            <span>·</span>
                            <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px] font-medium">
                              {deptConfig.code}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amount + actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p className={`text-[13px] font-semibold tabular-nums ${
                        isRevenue ? 'text-emerald-600' : 'text-gray-900'
                      }`}>
                        {isRevenue ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: typeConfig.color }}
                      >
                        {typeConfig.label.split(' ')[0]}
                      </span>
                    </div>

                    <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setActiveMenuId(isMenuOpen ? null : tx.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <MoreHorizontal size={14} />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-xl shadow-[0_8px_25px_rgba(0,0,0,0.12)] py-1 z-30 animate-fadeIn">
                          <button
                            onClick={() => handleEdit(tx)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-gray-700 hover:bg-gray-50"
                          >
                            <Edit2 size={12} className="text-indigo-500" />
                            Edit
                          </button>
                          <button
                            onClick={() => { setActiveMenuId(null); setDeleteTarget(tx); }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        transaction={deleteTarget}
        onConfirm={deleteTransaction}
      />
    </div>
  );
};
