import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  BrainCircuit,
  TrendingDown,
  TrendingUp,
  Percent,
  Flame,
  Award,
  Zap,
  ShoppingBag,
  AlertCircle,
  Building,
  Calendar,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import {
  getCategoryBreakdown,
  getSpendingTimeSeries,
  isSameMonth,
} from '../utils/calculations';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { CategoryIcon } from '../components/ui/CategoryIcon';
import { CATEGORIES } from '../utils/constants';

export const Analytics = () => {
  const {
    transactions,
    profile,
    metrics,
    budgetHealth,
    ruleBasedInsights,
  } = useFinance();

  const [timeHorizon, setTimeHorizon] = useState('month'); // 'week' | 'month' | 'year'

  // Time series data
  const timeSeriesData = useMemo(() => {
    return getSpendingTimeSeries(transactions, timeHorizon);
  }, [transactions, timeHorizon]);

  // Category breakdown for current month
  const { categories, totalExpense } = useMemo(() => {
    return getCategoryBreakdown(transactions, 'this_month');
  }, [transactions]);

  // Top Merchants Analysis
  const topMerchants = useMemo(() => {
    const map = {};
    const now = new Date();
    transactions.forEach((tx) => {
      if (tx.type === 'expense' && isSameMonth(new Date(tx.date), now)) {
        const title = tx.title || 'Unlabeled Vendor';
        if (!map[title]) {
          map[title] = { name: title, total: 0, count: 0, category: tx.category };
        }
        map[title].total += Number(tx.amount) || 0;
        map[title].count += 1;
      }
    });

    const sorted = Object.values(map).sort((a, b) => b.total - a.total);
    const sumAll = sorted.reduce((s, m) => s + m.total, 0);
    return sorted.slice(0, 5).map((m) => ({
      ...m,
      percentage: sumAll > 0 ? (m.total / sumAll) * 100 : 0,
    }));
  }, [transactions]);

  // Average daily expenditure
  const averageDailySpend = useMemo(() => {
    const now = new Date();
    const curMonthExpenses = transactions
      .filter((t) => t.type === 'expense' && isSameMonth(new Date(t.date), now))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const day = Math.max(1, now.getDate());
    return curMonthExpenses / day;
  }, [transactions]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Financial Telemetry & Insights
          </h2>
          <p className="text-xs text-[#9298AD] mt-0.5">
            Algorithmic patterns, merchant velocity, and capital allocation models
          </p>
        </div>

        {/* Horizon Picker */}
        <div className="flex items-center bg-[#11131D] p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setTimeHorizon('week')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              timeHorizon === 'week'
                ? 'bg-[#181B29] text-white border border-white/10'
                : 'text-[#9298AD] hover:text-white'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeHorizon('month')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              timeHorizon === 'month'
                ? 'bg-[#181B29] text-white border border-white/10'
                : 'text-[#9298AD] hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeHorizon('year')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              timeHorizon === 'year'
                ? 'bg-[#181B29] text-white border border-white/10'
                : 'text-[#9298AD] hover:text-white'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Algorithmic Rule-Based Insights Deck */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#11131D] via-[#141724] to-[#181B29] border border-white/10 shadow-card-depth relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30">
            <BrainCircuit size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              NexusCapFIN Intelligence Engine
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neon-mint/10 text-neon-mint border border-neon-mint/30 uppercase">
                Active Telemetry
              </span>
            </h3>
            <p className="text-xs text-[#9298AD]">
              Rule-based observations derived from your recorded financial behavior
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-2">
          {ruleBasedInsights.map((insight) => {
            const isWarning = insight.type === 'warning' || insight.type === 'danger';
            return (
              <div
                key={insight.id}
                className="p-4 rounded-xl bg-[#0E1018]/90 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-white">
                      {insight.title}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isWarning
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                      }`}
                    >
                      {insight.metric}
                    </span>
                  </div>
                  <p className="text-xs text-[#9298AD] leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Comparative Chart: Inflows vs Outflows */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Inflow vs. Outflow Comparative Telemetry
            </h3>
            <p className="text-xs text-[#9298AD]">
              Comparing earned capital against active expenditures
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-neon-cyan">
              <span className="w-2.5 h-2.5 rounded-sm bg-neon-cyan" />
              Inflow (Deposits)
            </span>
            <span className="flex items-center gap-1.5 text-neon-pink">
              <span className="w-2.5 h-2.5 rounded-sm bg-neon-pink" />
              Outflow (Expenses)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={timeSeriesData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.05)"
                vertical={false}
              />
              <XAxis dataKey="label" stroke="#626880" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#626880"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => formatShortCurrency(v, profile.currency)}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const inc = payload.find((p) => p.dataKey === 'income')?.value || 0;
                    const exp = payload.find((p) => p.dataKey === 'expense')?.value || 0;
                    return (
                      <div className="bg-[#11131D] border border-white/10 rounded-xl p-3 text-xs font-mono shadow-xl">
                        <p className="font-bold text-white mb-1.5">{label}</p>
                        <p className="text-neon-cyan">Inflow: {formatCurrency(inc, profile.currency)}</p>
                        <p className="text-neon-pink">Outflow: {formatCurrency(exp, profile.currency)}</p>
                        <p className="text-white mt-1 pt-1 border-t border-white/5 font-semibold">
                          Delta: {formatCurrency(inc - exp, profile.currency)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="income" fill="#22D3EE" radius={[6, 6, 0, 0]} maxBarSize={36} />
              <Bar dataKey="expense" fill="#FF4FD8" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Section: Top Merchants Leaderboard + Habit Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Top Merchants Leaderboard */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Building size={16} className="text-neon-cyan" />
                  Top Merchant Outlets
                </h3>
                <p className="text-xs text-[#9298AD]">
                  Highest expenditure destinations this cycle
                </p>
              </div>
              <span className="text-[11px] font-mono text-neon-cyan uppercase">
                Ranked
              </span>
            </div>

            {topMerchants.length === 0 ? (
              <p className="text-xs text-[#9298AD] py-6 text-center">
                No merchant spending logged for this cycle.
              </p>
            ) : (
              <div className="space-y-3">
                {topMerchants.map((merchant, idx) => {
                  const cat = CATEGORIES[merchant.category];
                  return (
                    <div
                      key={merchant.name}
                      className="p-3 rounded-xl bg-[#0E1018] border border-white/5 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-[#181B29] font-mono text-xs font-bold text-neon-cyan flex items-center justify-center shrink-0">
                          0{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {merchant.name}
                          </p>
                          <p className="text-[10px] text-[#9298AD] capitalize truncate">
                            {cat?.name || 'General'} • {merchant.count} transactions
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs font-mono font-bold text-white">
                          {formatCurrency(merchant.total, profile.currency)}
                        </p>
                        <p className="text-[10px] font-mono text-neon-pink">
                          {merchant.percentage.toFixed(1)}% of total
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Habit Summary & Key Ratios */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 mb-1">
              <Zap size={16} className="text-amber-400" />
              Behavioral Financial Ratios
            </h3>
            <p className="text-xs text-[#9298AD] mb-5">
              Efficiency parameters and cash burn velocity
            </p>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Daily Average Burn */}
              <div className="p-4 rounded-xl bg-[#0E1018] border border-white/5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#9298AD] block mb-1">
                  Average Daily Burn
                </span>
                <span className="text-xl font-mono font-bold text-white">
                  {formatCurrency(averageDailySpend, profile.currency)}
                </span>
                <span className="text-[10px] text-[#9298AD] block mt-1">
                  Expenditure velocity per day
                </span>
              </div>

              {/* Capital Savings Rate */}
              <div className="p-4 rounded-xl bg-[#0E1018] border border-white/5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#9298AD] block mb-1">
                  Active Savings Rate
                </span>
                <span className="text-xl font-mono font-bold text-neon-mint">
                  {metrics.currentSavingsRate.toFixed(1)}%
                </span>
                <span className="text-[10px] text-[#9298AD] block mt-1">
                  Retained from gross inflow
                </span>
              </div>

              {/* Dominant Outflow Category */}
              <div className="p-4 rounded-xl bg-[#0E1018] border border-white/5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#9298AD] block mb-1">
                  Dominant Category
                </span>
                <span className="text-base font-bold text-white truncate block">
                  {categories[0]?.name || 'N/A'}
                </span>
                <span className="text-[10px] font-mono text-neon-pink block mt-1">
                  {categories[0] ? `${categories[0].percentage.toFixed(0)}% of expenses` : '0%'}
                </span>
              </div>

              {/* Budget Adherence */}
              <div className="p-4 rounded-xl bg-[#0E1018] border border-white/5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#9298AD] block mb-1">
                  Budget Capacity Used
                </span>
                <span
                  className={`text-xl font-mono font-bold ${
                    budgetHealth.overallPercentage >= 100
                      ? 'text-rose-400'
                      : budgetHealth.overallPercentage >= 80
                      ? 'text-amber-400'
                      : 'text-neon-cyan'
                  }`}
                >
                  {budgetHealth.overallPercentage.toFixed(0)}%
                </span>
                <span className="text-[10px] text-[#9298AD] block mt-1">
                  {formatCurrency(budgetHealth.overallRemaining, profile.currency)} remaining
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#181B29] border border-white/5 text-xs text-[#9298AD] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-mint" />
            <span>
              Calculated dynamically from {transactions.length} immutable ledger transactions.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
