import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatCompactINR } from '../../utils/formatters';
import { MoreHorizontal } from 'lucide-react';

export const SpendingChart = () => {
  const { transactions, metrics } = useFinance();
  const [horizon, setHorizon] = useState('monthly');

  const chartData = useMemo(() => {
    const now = new Date();

    if (horizon === 'weekly') {
      const weeks = [
        { label: 'Wk 1', revenue: 0, expenses: 0, profit: 0 },
        { label: 'Wk 2', revenue: 0, expenses: 0, profit: 0 },
        { label: 'Wk 3', revenue: 0, expenses: 0, profit: 0 },
        { label: 'Wk 4', revenue: 0, expenses: 0, profit: 0 },
      ];
      const bounds = [{ s: 1, e: 7 }, { s: 8, e: 14 }, { s: 15, e: 21 }, { s: 22, e: 31 }];
      transactions.forEach((tx) => {
        const day = new Date(tx.date).getDate();
        const amt = Number(tx.amount) || 0;
        const idx = bounds.findIndex((b) => day >= b.s && day <= b.e);
        if (idx >= 0) {
          if (tx.type === 'revenue') weeks[idx].revenue += amt;
          else weeks[idx].expenses += amt;
        }
      });
      weeks.forEach((w) => { w.profit = w.revenue - w.expenses; });
      return weeks;
    }

    if (horizon === 'quarterly') {
      return [
        { label: 'Q1 FY26', revenue: 14500000, expenses: 9800000, profit: 4700000 },
        { label: 'Q2 FY26', revenue: 17200000, expenses: 10400000, profit: 6800000 },
        { label: 'Q3 FY26', revenue: metrics.totalRevenue * 3 || 19500000, expenses: metrics.totalExpenses * 3 || 12300000, profit: metrics.netProfit * 3 || 7200000 },
        { label: 'Q4 FY26', revenue: 22500000, expenses: 13500000, profit: 9000000 },
      ];
    }

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleDateString('en-IN', { month: 'short' }),
        revenue: 0,
        expenses: 0,
        profit: 0,
      });
    }
    const seed = [
      [4500000, 3400000], [4900000, 3600000], [5200000, 3750000],
      [5600000, 3900000], [5850000, 4050000],
    ];
    seed.forEach(([r, e], i) => {
      months[i].revenue = r;
      months[i].expenses = e;
      months[i].profit = r - e;
    });
    const last = months[months.length - 1];
    last.revenue = metrics.totalRevenue;
    last.expenses = metrics.totalExpenses;
    last.profit = metrics.netProfit;
    return months;
  }, [transactions, metrics, horizon]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const rev = payload.find((p) => p.dataKey === 'revenue')?.value || 0;
      const exp = payload.find((p) => p.dataKey === 'expenses')?.value || 0;
      const prof = payload.find((p) => p.dataKey === 'profit')?.value || (rev - exp);
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-[0_8px_25px_rgba(0,0,0,0.1)] text-[12px]">
          <p className="font-semibold text-gray-900 mb-2 pb-1.5 border-b border-gray-100">{label}</p>
          <div className="space-y-1.5">
            <div className="flex justify-between gap-6 text-indigo-600">
              <span>Revenue</span>
              <span className="font-semibold">{formatCompactINR(rev)}</span>
            </div>
            <div className="flex justify-between gap-6 text-pink-500">
              <span>Expenses</span>
              <span className="font-semibold">{formatCompactINR(exp)}</span>
            </div>
            <div className="flex justify-between gap-6 text-emerald-600 pt-1.5 border-t border-gray-100">
              <span>Net Profit</span>
              <span className="font-semibold">{formatCompactINR(prof)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const tabs = [
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'quarterly', label: 'Quarterly' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
            Financial Performance
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              Audited
            </span>
          </h3>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Revenue vs OPEX vs net profit over time
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-[12.5px]">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setHorizon(t.key)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all duration-150 ${
                  horizon === t.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[12px] mb-4">
        <span className="flex items-center gap-1.5 text-gray-600">
          <span className="w-3 h-0.5 rounded-full bg-indigo-500 inline-block" />
          Revenue
        </span>
        <span className="flex items-center gap-1.5 text-gray-600">
          <span className="w-3 h-0.5 rounded-full bg-pink-400 inline-block" />
          Expenses
        </span>
        <span className="flex items-center gap-1.5 text-gray-600">
          <span className="w-3 h-0.5 rounded-full bg-emerald-500 inline-block" />
          Net Profit
        </span>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EC4899" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#D1D5DB"
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#D1D5DB"
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCompactINR(v)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />

            <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: '#6366F1', stroke: '#fff', strokeWidth: 2 }} />
            <Area type="monotone" dataKey="expenses" stroke="#EC4899" strokeWidth={2} fill="url(#expGrad)" dot={false} activeDot={{ r: 4, fill: '#EC4899', stroke: '#fff', strokeWidth: 2 }} />
            <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#profGrad)" dot={false} activeDot={{ r: 4, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
