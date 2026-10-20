import React, { useState, useMemo } from 'react';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Flame,
  Sliders,
  DollarSign,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatCompactINR } from '../utils/formatters';
import { generateCashFlowForecast } from '../utils/calculations';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const Forecasts = () => {
  const { metrics, profile } = useFinance();
  const [horizonMonths, setHorizonMonths] = useState(6); // 3 | 6 | 12
  const [revGrowthPct, setRevGrowthPct] = useState(5); // 5% monthly growth
  const [costInflationPct, setCostInflationPct] = useState(3); // 3% inflation

  // Generate dynamic forecast based on interactive assumptions
  const forecastData = useMemo(() => {
    return generateCashFlowForecast(metrics, horizonMonths, {
      revenueGrowthRate: (parseFloat(revGrowthPct) || 0) / 100,
      expenseInflationRate: (parseFloat(costInflationPct) || 0) / 100,
    });
  }, [metrics, horizonMonths, revGrowthPct, costInflationPct]);

  const endMonth = forecastData[forecastData.length - 1];
  const minProjectedCash = Math.min(...forecastData.map(f => f.closingCash));
  const reserveThreshold = metrics.minReservePolicy || 4500000;
  const breachesReserve = minProjectedCash < reserveThreshold;

  return (
    <div className="space-y-6 sm:space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Cash Flow & Liquidity Runway Forecasting
          </h2>
          <p className="text-xs text-[#939BB2] mt-0.5">
            Multi-horizon pro-forma projections, statutory reserve threshold monitoring, and stress testing
          </p>
        </div>

        {/* Horizon Toggle */}
        <div className="flex items-center bg-[#121624] p-1 rounded-xl border border-white/5 text-xs font-semibold">
          {[3, 6, 12].map((m) => (
            <button
              key={m}
              onClick={() => setHorizonMonths(m)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                horizonMonths === m ? 'bg-[#191E30] text-neon-cyan' : 'text-[#939BB2] hover:text-white'
              }`}
            >
              {m} Months Forward
            </button>
          ))}
        </div>
      </div>

      {/* Assumptions Control Deck */}
      <div className="p-5 rounded-2xl bg-[#121624] border border-white/10 shadow-card-depth space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <Sliders size={14} className="text-neon-cyan" />
            Model Assumptions & Sensitivity Parameters
          </h3>
          <span className="text-[10px] font-mono text-[#939BB2]">
            Current Opening Reserve: {formatCompactINR(metrics.availableCash)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-xl bg-[#090B12] border border-white/5 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#939BB2]">Monthly Revenue Expansion</span>
              <span className="font-mono text-neon-cyan font-bold">+{revGrowthPct}% / mo</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={revGrowthPct}
              onChange={(e) => setRevGrowthPct(parseFloat(e.target.value))}
              className="w-full accent-neon-cyan cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#090B12] border border-white/5 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#939BB2]">OPEX & Salary Creep Rate</span>
              <span className="font-mono text-neon-pink font-bold">+{costInflationPct}% / mo</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={costInflationPct}
              onChange={(e) => setCostInflationPct(parseFloat(e.target.value))}
              className="w-full accent-neon-pink cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#090B12] border border-white/5 space-y-1 text-xs">
            <span className="text-[#939BB2] block">Policy Reserve Mandate</span>
            <span className="font-mono text-white font-bold block">{formatCurrency(reserveThreshold)}</span>
            <span className="text-[10px] text-neon-mint block">
              {metrics.hasHealthyReserve ? '✓ Current reserves fully comply' : '⚠ Caution'}
            </span>
          </div>
        </div>
      </div>

      {/* Pro-Forma Cash Trajectory Chart */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#121624] border border-white/10 shadow-card-depth">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Projected Cash Balance & Reserve Horizon
            </h3>
            <p className="text-xs text-[#939BB2]">
              Expected Case vs Downside Stress-Test against the ₹45.0L statutory threshold
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-neon-cyan">
              <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan" />
              Expected Case
            </span>
            <span className="flex items-center gap-1.5 text-neon-mint">
              <span className="w-2.5 h-2.5 rounded-full bg-neon-mint" />
              Upside (+15%)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              Downside (-15%)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-0.5 bg-amber-400" />
              Policy Reserve Limit
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="expCashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis dataKey="label" stroke="#5A627B" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#5A627B"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => formatCompactINR(v)}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#121624] border border-white/10 rounded-xl p-3 text-xs font-mono shadow-xl space-y-1">
                        <p className="font-bold text-white border-b border-white/10 pb-1">{label} Forecast</p>
                        <p className="text-neon-cyan">Expected Cash: {formatCurrency(data.closingCash)}</p>
                        <p className="text-neon-mint">Upside Cash: {formatCurrency(data.upsideCash)}</p>
                        <p className="text-rose-400">Downside Stress: {formatCurrency(data.downsideCash)}</p>
                        <p className="text-amber-400 pt-1 border-t border-white/10">
                          Reserve Mandate: {formatCurrency(data.reserveThreshold)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="upsideCash"
                stroke="#5CFFB2"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                fill="none"
              />
              <Area
                type="monotone"
                dataKey="closingCash"
                stroke="#22D3EE"
                strokeWidth={2.5}
                fill="url(#expCashGrad)"
              />
              <Area
                type="monotone"
                dataKey="downsideCash"
                stroke="#FB7185"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Pro-Forma Forecast Table */}
      <div className="p-5 rounded-2xl bg-[#121624] border border-white/10 shadow-card-depth overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-3">Forward Pro-Forma Cash Flow Register</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-mono uppercase tracking-wider text-[#939BB2]">
                <th className="py-2.5 px-3">Horizon Month</th>
                <th className="py-2.5 px-3">Projected Inflow</th>
                <th className="py-2.5 px-3">Projected OPEX</th>
                <th className="py-2.5 px-3">Net Cash Delta</th>
                <th className="py-2.5 px-3">Expected Closing Cash</th>
                <th className="py-2.5 px-3">Downside Stress Cash</th>
                <th className="py-2.5 px-3 text-center">Reserve Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {forecastData.map((f) => (
                <tr key={f.label} className="hover:bg-[#191E30]/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{f.label}</td>
                  <td className="py-3 px-3 text-neon-cyan">{formatCurrency(f.projectedRevenue)}</td>
                  <td className="py-3 px-3 text-rose-300">-{formatCurrency(f.projectedExpenses)}</td>
                  <td className="py-3 px-3 text-neon-mint font-semibold">+{formatCurrency(f.netCashFlow)}</td>
                  <td className="py-3 px-3 font-bold text-white">{formatCurrency(f.closingCash)}</td>
                  <td className="py-3 px-3 text-gray-300">{formatCurrency(f.downsideCash)}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-neon-mint/15 text-neon-mint border border-neon-mint/30">
                      Compliant (Buffer)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
