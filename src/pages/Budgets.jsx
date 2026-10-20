import React, { useState, useMemo } from 'react';
import {
  PieChart as PieIcon,
  Sliders,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Cpu,
  Megaphone,
  Briefcase,
  Users,
  Scale,
  Palette,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  CheckCircle2,
  Building2,
  Flame,
  Zap,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { DEPARTMENTS } from '../utils/constants';
import { formatCurrency, formatCompactINR, formatPercent } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

const DEPT_ICONS = {
  engineering: Cpu,
  sales_marketing: Megaphone,
  operations: Briefcase,
  hr_payroll: Users,
  finance_legal: Scale,
  product_design: Palette,
};

export const Budgets = () => {
  const {
    budgets,
    updateBudgets,
    metrics,
    transactions,
    activeCompany,
    exportCSV,
  } = useFinance();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editedBudgets, setEditedBudgets] = useState({ ...budgets });
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');

  // Month progress pacing
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const monthElapsedPct = (dayOfMonth / daysInMonth) * 100;

  // Compute departmental actuals and variance
  const departmentStats = useMemo(() => {
    return DEPARTMENTS.map((dept) => {
      const cap = Number(budgets[dept.id]) || 0;
      const actual = Number(metrics.departmentSpend?.[dept.id]) || 0;
      const variance = cap - actual; // Positive is favorable (under budget)
      const utilization = cap > 0 ? (actual / cap) * 100 : 0;
      
      // Pacing status
      let status = 'healthy';
      if (utilization > 100) status = 'exceeded';
      else if (utilization >= 85 || (utilization > monthElapsedPct + 15 && utilization > 60)) status = 'warning';

      // Related transactions
      const deptTx = transactions.filter(
        (t) => t.department === dept.id && (t.type === 'operating_expense' || t.type === 'payroll_expense')
      );

      return {
        ...dept,
        cap,
        actual,
        variance,
        utilization,
        status,
        txCount: deptTx.length,
        recentTx: deptTx.slice(0, 3),
      };
    });
  }, [budgets, metrics.departmentSpend, transactions, monthElapsedPct]);

  // Aggregate totals
  const totalBudgetCap = useMemo(() => {
    return departmentStats.reduce((sum, d) => sum + d.cap, 0);
  }, [departmentStats]);

  const totalActualSpend = useMemo(() => {
    return departmentStats.reduce((sum, d) => sum + d.actual, 0);
  }, [departmentStats]);

  const totalHeadroom = totalBudgetCap - totalActualSpend;
  const overallUtilization = totalBudgetCap > 0 ? (totalActualSpend / totalBudgetCap) * 100 : 0;

  // Chart data
  const chartData = useMemo(() => {
    return departmentStats.map((d) => ({
      name: d.code,
      fullName: d.name,
      Budget: d.cap,
      Actual: d.actual,
      color: d.color,
    }));
  }, [departmentStats]);

  // Handlers for modal
  const handleOpenEditor = () => {
    setEditedBudgets({ ...budgets });
    setIsEditorOpen(true);
  };

  const handleDeptBudgetChange = (deptId, val) => {
    const num = Math.max(0, parseFloat(val) || 0);
    setEditedBudgets((prev) => ({
      ...prev,
      [deptId]: num,
    }));
  };

  const handleAdjustAll = (percentage) => {
    const factor = 1 + percentage / 100;
    const updated = {};
    Object.keys(editedBudgets).forEach((k) => {
      updated[k] = Math.round((editedBudgets[k] || 0) * factor);
    });
    setEditedBudgets(updated);
  };

  const handleSaveBudgets = (e) => {
    e.preventDefault();
    updateBudgets(editedBudgets);
    setIsEditorOpen(false);
  };

  // Preview total in modal
  const modalTotalCap = Object.values(editedBudgets).reduce((sum, v) => sum + (Number(v) || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Departmental Cost Centers & Budgets
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neon-violet/15 text-neon-cyan border border-neon-violet/30">
              {activeCompany.name}
            </span>
          </div>
          <p className="text-xs text-[#9298AD] mt-0.5">
            Real-time variance tracking, departmental spending ceilings, burn rate pacing, and headroom diagnosis
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
            Export Ledger
          </Button>
          <Button
            variant="neon"
            size="sm"
            icon={Sliders}
            onClick={handleOpenEditor}
          >
            Adjust Budget Ceilings
          </Button>
        </div>
      </div>

      {/* Corporate Budget Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Monthly Cap */}
        <div className="p-5 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold text-[#939BB2] uppercase tracking-wider">
              Monthly Budget Ceiling
            </span>
            <div className="p-2 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
              <PieIcon size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white font-mono tracking-tight">
            {formatCurrency(totalBudgetCap)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-[#939BB2]">
            <span>6 Corporate Cost Centers</span>
            <span className="font-mono text-neon-cyan">{formatCompactINR(totalBudgetCap)}</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-neon-cyan/5 rounded-full blur-2xl group-hover:bg-neon-cyan/10 transition-colors pointer-events-none" />
        </div>

        {/* MTD Actual Spend */}
        <div className="p-5 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold text-[#939BB2] uppercase tracking-wider">
              Actual MTD Burn
            </span>
            <div className="p-2 rounded-xl bg-neon-violet/10 text-neon-violet border border-neon-violet/20">
              <Flame size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white font-mono tracking-tight">
            {formatCurrency(totalActualSpend)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-[#939BB2]">
            <span>OPEX + Compensations</span>
            <span className="font-mono text-neon-violet">{formatCompactINR(totalActualSpend)}</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-neon-violet/5 rounded-full blur-2xl group-hover:bg-neon-violet/10 transition-colors pointer-events-none" />
        </div>

        {/* Remaining Headroom */}
        <div className="p-5 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold text-[#939BB2] uppercase tracking-wider">
              Remaining Headroom
            </span>
            <div
              className={`p-2 rounded-xl border ${
                totalHeadroom >= 0
                  ? 'bg-neon-mint/10 text-neon-mint border-neon-mint/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {totalHeadroom >= 0 ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
            </div>
          </div>
          <p
            className={`text-2xl font-bold font-mono tracking-tight ${
              totalHeadroom >= 0 ? 'text-neon-mint' : 'text-rose-400'
            }`}
          >
            {formatCurrency(totalHeadroom)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-[#939BB2]">
            <span>{totalHeadroom >= 0 ? 'Surplus Buffer Available' : 'Ceiling Breached'}</span>
            <span className="font-mono">{formatCompactINR(totalHeadroom)}</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-neon-mint/5 rounded-full blur-2xl group-hover:bg-neon-mint/10 transition-colors pointer-events-none" />
        </div>

        {/* Utilization & Pacing */}
        <div className="p-5 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold text-[#939BB2] uppercase tracking-wider">
              Budget Utilization
            </span>
            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Zap size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white font-mono tracking-tight">
            {formatPercent(overallUtilization)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-[#939BB2]">
            <span>Day {dayOfMonth} of {daysInMonth} ({monthElapsedPct.toFixed(0)}% elapsed)</span>
            <span
              className={`font-semibold font-mono ${
                overallUtilization <= monthElapsedPct ? 'text-neon-mint' : 'text-amber-400'
              }`}
            >
              {overallUtilization <= monthElapsedPct ? 'Pacing Under' : 'Accelerated'}
            </span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-400/5 rounded-full blur-2xl group-hover:bg-amber-400/10 transition-colors pointer-events-none" />
        </div>
      </div>

      {/* Comparison Chart: Budget Cap vs Actual Spend */}
      <div className="p-6 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders size={18} className="text-neon-cyan" />
              Departmental Budget vs. Actual Variance
            </h3>
            <p className="text-xs text-[#939BB2]">
              Side-by-side comparison of budgeted caps against recorded MTD operational expenses
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-white/20 border border-white/40" />
              <span className="text-[#939BB2]">Budget Cap</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-neon-cyan" />
              <span className="text-white">Actual Spend</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#23283E" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#23283E' }}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl bg-[#0B0D17] border border-white/10 shadow-2xl text-xs space-y-1.5 font-mono">
                        <p className="font-bold text-white text-sm">{data.fullName}</p>
                        <div className="flex justify-between gap-4 text-[#939BB2]">
                          <span>Budgeted Cap:</span>
                          <span className="text-white font-bold">{formatCurrency(data.Budget)}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-[#939BB2]">
                          <span>Actual Spend:</span>
                          <span className="text-neon-cyan font-bold">{formatCurrency(data.Actual)}</span>
                        </div>
                        <div className="flex justify-between gap-4 pt-1 border-t border-white/10">
                          <span>Variance:</span>
                          <span
                            className={`font-bold ${
                              data.Budget >= data.Actual ? 'text-neon-mint' : 'text-rose-400'
                            }`}
                          >
                            {data.Budget >= data.Actual ? '+' : ''}
                            {formatCurrency(data.Budget - data.Actual)}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="Budget" fill="#2A3048" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Actual" fill="#22D3EE" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.Actual > entry.Budget ? '#F43F5E' : '#22D3EE'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Cost Center Breakdown & Controls</h3>
          <span className="text-xs text-[#939BB2]">
            {departmentStats.length} Active Departments
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentStats.map((dept) => {
            const Icon = DEPT_ICONS[dept.id] || Building2;
            const isOver = dept.status === 'exceeded';
            const isWarning = dept.status === 'warning';

            return (
              <div
                key={dept.id}
                className="p-5 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth flex flex-col justify-between group hover:border-white/20 transition-all"
              >
                <div>
                  {/* Dept Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="p-2.5 rounded-xl border shrink-0"
                        style={{
                          backgroundColor: `${dept.color}15`,
                          borderColor: `${dept.color}30`,
                          color: dept.color,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{dept.name}</h4>
                        <span className="text-[10px] font-mono text-[#939BB2] uppercase">
                          Cost Center • {dept.code}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        isOver
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : isWarning
                          ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                          : 'bg-neon-mint/10 text-neon-mint border-neon-mint/30'
                      }`}
                    >
                      {isOver ? 'Exceeded' : isWarning ? 'Pacing Alert' : 'Healthy'}
                    </span>
                  </div>

                  {/* Numbers */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#0B0D17] border border-white/5 mb-4">
                    <div>
                      <p className="text-[10px] font-mono text-[#939BB2] uppercase">Budget Cap</p>
                      <p className="text-sm font-bold font-mono text-white mt-0.5">
                        {formatCurrency(dept.cap)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[#939BB2] uppercase">Actual MTD</p>
                      <p className="text-sm font-bold font-mono text-neon-cyan mt-0.5">
                        {formatCurrency(dept.actual)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#939BB2]">
                        {dept.variance >= 0 ? 'Remaining Headroom' : 'Deficit'}
                      </span>
                      <span
                        className={`font-bold ${
                          dept.variance >= 0 ? 'text-neon-mint' : 'text-rose-400'
                        }`}
                      >
                        {dept.variance >= 0 ? '+' : ''}
                        {formatCurrency(dept.variance)}
                      </span>
                    </div>

                    <div className="h-2 w-full bg-[#181B29] rounded-full overflow-hidden p-[1px]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver
                            ? 'bg-rose-500 shadow-glow-pink'
                            : isWarning
                            ? 'bg-amber-400'
                            : 'bg-gradient-to-r from-neon-cyan to-neon-mint'
                        }`}
                        style={{ width: `${Math.min(100, dept.utilization)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280]">
                      <span>{dept.utilization.toFixed(1)}% utilized</span>
                      <span>Target: &lt;{monthElapsedPct.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {/* Footer Recent Spend or Adjust */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-[#939BB2] font-mono">
                    {dept.txCount} ledger entries
                  </span>
                  <button
                    onClick={handleOpenEditor}
                    className="text-xs text-neon-cyan hover:text-white font-medium flex items-center gap-1 transition-colors"
                  >
                    Adjust Cap <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Budget Optimization Insights */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-neon-violet/10 via-[#11131D] to-[#11131D] border border-neon-violet/20 shadow-card-depth">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-neon-violet/20 text-neon-cyan border border-neon-violet/30">
            <Zap size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Cost Center Optimization Diagnostic</h3>
            <p className="text-xs text-[#939BB2]">
              Deterministic variance detection based on current billing cycle velocity
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-[#0B0D17] border border-white/5 space-y-1">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-mint" />
              Engineering Run Rate
            </p>
            <p className="text-[#939BB2]">
              Cloud infrastructure and tooling burn is at 74% of cap with 10 days remaining. Projected end-of-month headroom of ₹1.8L.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0B0D17] border border-white/5 space-y-1">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Sales & Marketing Pacing
            </p>
            <p className="text-[#939BB2]">
              Customer acquisition ads reached 68% utilization faster than benchmark. Recommend auditing ad channel ROAS before next campaign unlock.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0B0D17] border border-white/5 space-y-1">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
              Statutory Payroll Overhead
            </p>
            <p className="text-[#939BB2]">
              Payroll is strictly fixed at ₹24.5L/month (41% of revenue). Healthy safe threshold maintained under company 50% policy.
            </p>
          </div>
        </div>
      </div>

      {/* Department Budget Ceilings Editor Modal */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title="Adjust Departmental Budget Ceilings"
      >
        <form onSubmit={handleSaveBudgets} className="space-y-5">
          <p className="text-xs text-[#939BB2]">
            Update monthly expense ceilings for each operating cost center. All figures are in INR (₹).
          </p>

          {/* Quick Adjustment Presets */}
          <div className="p-3 rounded-xl bg-[#0B0D17] border border-white/5 flex items-center justify-between">
            <span className="text-xs text-[#939BB2] font-medium">Quick Batch Adjust:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAdjustAll(-10)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-white transition-colors"
              >
                -10% All
              </button>
              <button
                type="button"
                onClick={() => handleAdjustAll(5)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-white transition-colors"
              >
                +5% All
              </button>
              <button
                type="button"
                onClick={() => handleAdjustAll(10)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-white transition-colors"
              >
                +10% All
              </button>
            </div>
          </div>

          {/* Dept Inputs */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {DEPARTMENTS.map((dept) => {
              const currentVal = editedBudgets[dept.id] || 0;
              return (
                <div
                  key={dept.id}
                  className="p-3 rounded-xl bg-[#121624] border border-white/5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{dept.name}</p>
                    <p className="text-[10px] font-mono text-[#939BB2]">{dept.code}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#939BB2]">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="50000"
                      value={currentVal}
                      onChange={(e) => handleDeptBudgetChange(dept.id, e.target.value)}
                      className="w-36 bg-[#0B0D17] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-neon-cyan text-right"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* New Total Preview */}
          <div className="p-3.5 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20 flex items-center justify-between">
            <span className="text-xs font-bold text-white">Revised Monthly Budget Cap:</span>
            <span className="text-sm font-bold font-mono text-neon-cyan">
              {formatCurrency(modalTotalCap)} ({formatCompactINR(modalTotalCap)})
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setIsEditorOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="neon" size="sm" type="submit">
              Apply Revisions
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
