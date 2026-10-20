import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatCompactINR } from '../../utils/formatters';
import { DEPARTMENTS } from '../../utils/constants';

export const BudgetHealthPanel = () => {
  const { metrics, budgets } = useFinance();
  const navigate = useNavigate();

  const runwayDisplay = metrics.cashRunwayMonths > 120
    ? 'Infinite (Profitable)'
    : `${metrics.cashRunwayMonths.toFixed(1)} Months`;

  const reservePct = Math.min(100, (metrics.availableCash / (metrics.minReservePolicy * 1.5)) * 100);
  const isHealthy = metrics.hasHealthyReserve;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">Liquidity & Runway</h3>
          <p className="text-[12px] text-gray-400 mt-0.5">Cash runway and reserve compliance</p>
        </div>
        <button
          onClick={() => navigate('/forecasts')}
          className="text-[12px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium"
        >
          Forecasts
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Runway Metric */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-1">
              <Flame size={11} className="text-orange-400" />
              Cash Runway
            </div>
            <div className="text-[22px] font-bold text-gray-900 leading-none">{runwayDisplay}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-1">Reserve Target</div>
            <div className="text-[15px] font-bold text-gray-900">{formatCompactINR(metrics.minReservePolicy)}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
              +{formatCompactINR(Math.max(0, metrics.reserveSurplus))} surplus
            </div>
          </div>
        </div>

        {/* Reserve gauge */}
        <div className="space-y-1.5">
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isHealthy
                  ? 'bg-gradient-to-r from-indigo-500 to-emerald-500'
                  : 'bg-red-400'
              }`}
              style={{ width: `${reservePct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-400">
            <span>₹0</span>
            <span className="text-indigo-600 font-medium">Reserve Mandate</span>
            <span>{formatCompactINR(metrics.availableCash)} available</span>
          </div>
        </div>
      </div>

      {/* Payroll ratio */}
      <div className="border border-gray-100 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-violet-50">
            <Users size={14} className="text-violet-600" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-900">Payroll to Revenue</p>
            <p className="text-[11px] text-gray-400">Healthy SaaS target: &lt;45%</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-[16px] font-bold ${
            metrics.payrollPercentOfRevenue > 50 ? 'text-amber-500' : 'text-emerald-600'
          }`}>
            {metrics.payrollPercentOfRevenue.toFixed(1)}%
          </span>
          <p className={`text-[11px] font-medium mt-0.5 ${
            metrics.payrollPercentOfRevenue <= 45 ? 'text-emerald-500' : 'text-amber-500'
          }`}>
            {metrics.payrollPercentOfRevenue <= 45 ? 'Optimal' : 'Caution'}
          </p>
        </div>
      </div>

      {/* Department budget bars */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">
            Dept. Spend vs Caps
          </span>
        </div>

        {DEPARTMENTS.slice(0, 3).map((dept) => {
          const actual = metrics.departmentSpend[dept.id] || 0;
          const cap = budgets[dept.id] || 1500000;
          const pct = Math.min(100, (actual / cap) * 100);
          const isExceeded = actual > cap;
          const isWarning = pct > 80 && !isExceeded;

          return (
            <div key={dept.id} className="space-y-1">
              <div className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-1.5">
                  {isExceeded ? (
                    <AlertTriangle size={11} className="text-red-500" />
                  ) : (
                    <CheckCircle2 size={11} className={isWarning ? 'text-amber-500' : 'text-emerald-500'} />
                  )}
                  <span className="text-gray-700 font-medium">{dept.name}</span>
                </div>
                <span className="text-gray-500 font-medium tabular-nums">
                  <span className="text-gray-900">{formatCompactINR(actual)}</span>
                  {' / '}
                  {formatCompactINR(cap)}
                </span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isExceeded ? 'bg-red-400' : isWarning ? 'bg-amber-400' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
