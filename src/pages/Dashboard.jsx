import React, { useState } from 'react';
import { StatCards } from '../components/dashboard/StatCards';
import { SpendingChart } from '../components/dashboard/SpendingChart';
import { CategoryDonut } from '../components/dashboard/CategoryDonut';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { BudgetHealthPanel } from '../components/dashboard/BudgetHealthPanel';
import { QuickActions } from '../components/dashboard/QuickActions';
import {
  Calendar,
  Link2,
  ChevronDown,
  BrainCircuit,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCompactINR } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { activeCompany, metrics, profile, activePeriod, setActivePeriod } = useFinance();
  const navigate = useNavigate();

  const periodLabels = {
    current_month: 'This Month',
    q3_fy26: 'Q3 FY 2025-26',
    fy26: 'Full Year FY26',
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Page Header — Overview style matching reference */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left: Page title */}
        <div className="flex items-center gap-3">
          <h1 className="text-[32px] font-bold text-gray-900 tracking-tight leading-none">
            Overview
          </h1>
          <button
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            title="Copy link to this page"
          >
            <Link2 size={15} />
          </button>
        </div>

        {/* Right: Period selectors (like Zentra's date range) */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              value={activePeriod}
              onChange={(e) => setActivePeriod(e.target.value)}
              className="appearance-none pl-8 pr-7 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer hover:border-gray-300 transition-colors shadow-sm"
              aria-label="Select period"
            >
              <option value="current_month">Jan 01 – July 31</option>
              <option value="q3_fy26">Q3 FY 2025-26</option>
              <option value="fy26">Full Year FY26</option>
            </select>
            <Calendar size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <span className="text-[12px] text-gray-400 font-medium hidden sm:block">compared to</span>

          <div className="relative hidden sm:block">
            <select
              className="appearance-none pl-8 pr-7 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-700 font-medium focus:outline-none cursor-pointer hover:border-gray-300 transition-colors shadow-sm"
              defaultValue="prev"
            >
              <option value="prev">Aug 01 – Dec 31</option>
              <option value="prior_year">Prior Year</option>
            </select>
            <Calendar size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <QuickActions />

      {/* 1. Stat Cards — KPI Row */}
      <StatCards />

      {/* 2. AI Insights Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-cyan-50 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600 flex-shrink-0">
            <BrainCircuit size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="text-[13px] font-semibold text-gray-900">NexusCapFIN AI Observation</h4>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                98% confidence
              </span>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Operating cashflow generated{' '}
              <span className="text-gray-900 font-semibold">{formatCompactINR(metrics.operatingProfit)}</span>{' '}
              EBITDA surplus this cycle. Net cash runway secured for{' '}
              <span className="text-indigo-600 font-bold">
                {metrics.cashRunwayMonths > 120 ? '> 10 Years' : `${metrics.cashRunwayMonths.toFixed(1)} months`}
              </span>.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/advisor')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold transition-colors shadow-sm flex-shrink-0 self-start md:self-auto"
        >
          <Sparkles size={14} />
          AI Advisor
        </button>
      </div>

      {/* 3. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <SpendingChart />
        </div>
        <div className="lg:col-span-4">
          <CategoryDonut />
        </div>
      </div>

      {/* 4. Transactions + Runway Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <RecentTransactions />
        </div>
        <div className="lg:col-span-5">
          <BudgetHealthPanel />
        </div>
      </div>
    </div>
  );
};
