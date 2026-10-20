import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Trash2,
  Edit2,
  DollarSign,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatCompactINR, formatPercent } from '../utils/formatters';
import { DEPARTMENTS } from '../utils/constants';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export const Payroll = () => {
  const { user, permissions } = useAuth();
  const canViewSensitiveSalaries = permissions?.canViewSensitiveSalaries ?? true;
  const canManagePayroll = permissions?.canManagePayroll ?? true;
  const {
    employees,
    metrics,
    addEmployee,
    deleteEmployee,
    runSalarySimulation,
  } = useFinance();

  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'roster'
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  // Salary Simulator Controls
  const [incrementPct, setIncrementPct] = useState(7.5); // e.g. 7.5% increment
  const [newHiresCount, setNewHiresCount] = useState(3);
  const [newHiresAvgSalary, setNewHiresAvgSalary] = useState(160000); // ₹1.6L/mo
  const [bonusPoolAmount, setBonusPoolAmount] = useState(600000); // ₹6.0L annual bonus pool

  // Run simulation calculation
  const simulationResult = useMemo(() => {
    return runSalarySimulation({
      incrementPercentage: parseFloat(incrementPct) || 0,
      newHires: [
        { department: 'engineering', count: parseInt(newHiresCount) || 0, avgSalary: parseFloat(newHiresAvgSalary) || 0 }
      ],
      bonusPool: parseFloat(bonusPoolAmount) || 0,
    });
  }, [runSalarySimulation, incrementPct, newHiresCount, newHiresAvgSalary, bonusPoolAmount]);

  // Employee Form State
  const [empForm, setEmpForm] = useState({
    name: '',
    designation: '',
    department: 'engineering',
    baseSalary: '',
    allowances: '20000',
    deductions: '25000',
    joiningDate: new Date().toISOString().slice(0, 10),
  });

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    if (!empForm.name.trim() || !empForm.baseSalary) return;

    addEmployee({
      name: empForm.name.trim(),
      designation: empForm.designation.trim() || 'Software Engineer',
      department: empForm.department,
      baseSalary: parseFloat(empForm.baseSalary),
      allowances: parseFloat(empForm.allowances) || 0,
      deductions: parseFloat(empForm.deductions) || 0,
      joiningDate: empForm.joiningDate,
    });
    setIsAddEmployeeOpen(false);
  };

  // Aggregated totals
  const totalMonthlyGross = employees.reduce((s, e) => s + (Number(e.baseSalary) || 0) + (Number(e.allowances) || 0), 0);
  const totalMonthlyEmployerCost = employees.reduce((s, e) => s + (Number(e.employerOverhead) || 0), 0);
  const totalConsolidatedPayroll = totalMonthlyGross + totalMonthlyEmployerCost;
  const avgMonthlySalary = employees.length > 0 ? totalMonthlyGross / employees.length : 0;

  return (
    <div className="space-y-6 sm:space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Payroll & Salary Affordability Planning
          </h2>
          <p className="text-xs text-[#939BB2] mt-0.5">
            Compensation register, statutory employer liabilities, and forward hiring scenario modeling
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="neon"
            size="sm"
            icon={Plus}
            onClick={() => setIsAddEmployeeOpen(true)}
          >
            Enroll New Employee
          </Button>
        </div>
      </div>

      {/* Corporate Payroll KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#121624] border border-white/5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#939BB2] block">
            Monthly Consolidated Payroll
          </span>
          <span className="text-2xl font-mono font-bold text-white mt-1 block">
            {formatCurrency(totalConsolidatedPayroll)}
          </span>
          <span className="text-[10px] text-[#939BB2] mt-1 block">
            Includes 15% employer PF & statutory benefits
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#121624] border border-white/5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#939BB2] block">
            Annualized Payroll Burden
          </span>
          <span className="text-2xl font-mono font-bold text-neon-cyan mt-1 block">
            {formatCompactINR(totalConsolidatedPayroll * 12)}
          </span>
          <span className="text-[10px] text-[#939BB2] mt-1 block">
            Base run-rate without increments
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#121624] border border-white/5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#939BB2] block">
            Payroll to Revenue Ratio
          </span>
          <span className="text-2xl font-mono font-bold text-neon-mint mt-1 block">
            {metrics.payrollPercentOfRevenue.toFixed(1)}%
          </span>
          <span className="text-[10px] text-neon-mint mt-1 block">
            Safe (Benchmark threshold is &lt;45%)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#121624] border border-white/5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#939BB2] block">
            Total Team Size
          </span>
          <span className="text-2xl font-mono font-bold text-white mt-1 block">
            {employees.length} Personnel
          </span>
          <span className="text-[10px] text-[#939BB2] mt-1 block">
            Average CTC: {formatCompactINR(avgMonthlySalary)}/mo
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`pb-3 transition-colors relative flex items-center gap-2 ${
            activeTab === 'simulator' ? 'text-neon-cyan' : 'text-[#939BB2] hover:text-white'
          }`}
        >
          <Calculator size={15} />
          Interactive Affordability & Hiring Simulator
          {activeTab === 'simulator' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-violet shadow-glow-cyan" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`pb-3 transition-colors relative flex items-center gap-2 ${
            activeTab === 'roster' ? 'text-neon-cyan' : 'text-[#939BB2] hover:text-white'
          }`}
        >
          <Users size={15} />
          Employee Compensation Roster ({employees.length})
          {activeTab === 'roster' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-violet shadow-glow-cyan" />
          )}
        </button>
      </div>

      {activeTab === 'simulator' ? (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#121624] border border-white/10 shadow-card-depth space-y-6">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Sliders size={18} className="text-neon-cyan" />
                Compensation Increment & Expansion Parameters
              </h3>
              <p className="text-xs text-[#939BB2] mt-0.5">
                Simulate across-the-board appraisal rounds, bonus allocations, or headcount additions in real-time
              </p>
            </div>

            {/* Simulation Sliders / Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 rounded-xl bg-[#090B12] border border-white/5">
              {/* Increment Percentage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#939BB2] font-semibold">Appraisal Increment %</span>
                  <span className="font-mono text-neon-cyan font-bold">{incrementPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={incrementPct}
                  onChange={(e) => setIncrementPct(parseFloat(e.target.value))}
                  className="w-full accent-neon-cyan cursor-pointer"
                />
                <span className="text-[10px] text-[#939BB2] block">
                  Applied across all {employees.length} active employee bases
                </span>
              </div>

              {/* New Hires Count */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#939BB2] font-semibold">Planned New Hires</span>
                  <span className="font-mono text-neon-mint font-bold">+{newHiresCount} Engineers</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={newHiresCount}
                  onChange={(e) => setNewHiresCount(parseInt(e.target.value))}
                  className="w-full accent-neon-mint cursor-pointer"
                />
                <span className="text-[10px] text-[#939BB2] block">
                  Modeled at ₹{(newHiresAvgSalary / 100000).toFixed(1)}L/mo avg + 15% overhead
                </span>
              </div>

              {/* Bonus Pool Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#939BB2] font-semibold">Annual Bonus Pool (INR)</span>
                  <span className="font-mono text-neon-violet font-bold">{formatCompactINR(bonusPoolAmount)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3000000"
                  step="100000"
                  value={bonusPoolAmount}
                  onChange={(e) => setBonusPoolAmount(parseFloat(e.target.value))}
                  className="w-full accent-neon-violet cursor-pointer"
                />
                <span className="text-[10px] text-[#939BB2] block">
                  Discretionary performance incentive allocation
                </span>
              </div>
            </div>

            {/* Side-by-Side Comparison Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Baseline Scenario */}
              <div className="p-4 rounded-xl bg-[#0E1018] border border-white/5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/5 font-sans">
                  <span className="font-bold text-white text-sm">Baseline Current Position</span>
                  <span className="text-[10px] bg-white/5 text-gray-300 px-2 py-0.5 rounded">Status Quo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#939BB2]">Monthly Payroll Outlay:</span>
                  <span className="text-white font-bold">{formatCurrency(simulationResult.baselineMonthlyPayroll)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#939BB2]">Operating Profit (EBITDA):</span>
                  <span className="text-neon-cyan font-bold">{formatCurrency(simulationResult.baselineOperatingProfit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#939BB2]">Operating Margin:</span>
                  <span className="text-neon-mint font-bold">{simulationResult.baselineOperatingMargin.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#939BB2]">Cash Runway Buffer:</span>
                  <span className="text-white">{metrics.cashRunwayMonths > 120 ? '>10 Yrs' : `${metrics.cashRunwayMonths.toFixed(1)} Mo`}</span>
                </div>
              </div>

              {/* Proposed Simulated Scenario */}
              <div className="p-4 rounded-xl bg-[#191E30] border border-neon-cyan/20 space-y-3 font-mono text-xs shadow-glow-cyan/10">
                <div className="flex items-center justify-between pb-2 border-b border-white/5 font-sans">
                  <span className="font-bold text-white text-sm">Proposed Revision Position</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      simulationResult.badgeColor === 'mint'
                        ? 'bg-neon-mint/20 text-neon-mint'
                        : simulationResult.badgeColor === 'coral'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-400/20 text-amber-400'
                    }`}
                  >
                    {simulationResult.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#939BB2]">Revised Monthly Payroll:</span>
                  <span className="text-white font-bold">{formatCurrency(simulationResult.proposedMonthlyPayroll)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#939BB2]">Added Annualized Cost:</span>
                  <span className="text-rose-400 font-bold">+{formatCurrency(simulationResult.additionalAnnualizedCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#939BB2]">Revised Operating Profit:</span>
                  <span className="text-neon-cyan font-bold">{formatCurrency(simulationResult.revisedOperatingProfit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#939BB2]">Revised Operating Margin:</span>
                  <span className="text-neon-mint font-bold">{simulationResult.revisedOperatingMargin.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#939BB2]">Projected Runway Buffer:</span>
                  <span className="text-white">{simulationResult.revisedRunwayMonths.toFixed(1)} Months</span>
                </div>
              </div>
            </div>

            {/* Affordability Diagnosis Banner */}
            <div className="p-4 rounded-xl bg-[#090B12] border border-white/5 space-y-1 text-xs">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Sparkles size={14} className="text-neon-cyan" />
                CFO & Management Sustainability Diagnosis
              </p>
              <p className="text-[#939BB2] leading-relaxed">
                {simulationResult.recommendation}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Employee Roster Tab */
        <div className="p-5 rounded-2xl bg-[#121624] border border-white/10 shadow-card-depth overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Active Employee Compensation Register</h3>
            {!canViewSensitiveSalaries && (
              <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock size={10} /> Confidential Salaries Masked
              </span>
            )}
          </div>

          {!canViewSensitiveSalaries && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-start gap-3 text-xs">
              <Lock size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-400">Apex Technologies Information Security Policy</p>
                <p className="text-[#939BB2] mt-0.5 leading-relaxed text-[11px]">
                  Individual compensation structures, employee base salaries, and tax deductions are strictly restricted to HR/Payroll Managers and Administrators. Aggregated payroll expenses continue to reflect in consolidated financial statements.
                </p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-mono uppercase tracking-wider text-[#939BB2]">
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Base Salary</th>
                  <th className="py-2.5 px-3">Allowances</th>
                  <th className="py-2.5 px-3">Statutory Deductions</th>
                  <th className="py-2.5 px-3">Employer Cost</th>
                  <th className="py-2.5 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#191E30]/60 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-sans font-bold text-white">{emp.name}</p>
                      <p className="text-[10px] text-[#939BB2]">{emp.designation} • {emp.id}</p>
                    </td>
                    <td className="py-3 px-3 font-sans capitalize text-gray-300">
                      {emp.department?.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-3 text-white">
                      {canViewSensitiveSalaries ? (
                        formatCurrency(emp.baseSalary)
                      ) : (
                        <span className="text-[#6B7280] flex items-center gap-1 font-mono text-[11px]">
                          <Lock size={10} />••••••••
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#939BB2]">
                      {canViewSensitiveSalaries ? (
                        `+${formatCurrency(emp.allowances)}`
                      ) : (
                        <span className="text-[#6B7280]">••••</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-rose-300">
                      {canViewSensitiveSalaries ? (
                        `-${formatCurrency(emp.deductions)}`
                      ) : (
                        <span className="text-[#6B7280]">••••</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-bold text-neon-cyan">
                      {canViewSensitiveSalaries ? (
                        formatCurrency((emp.baseSalary || 0) + (emp.employerOverhead || 0))
                      ) : (
                        <span className="text-[#6B7280] flex items-center gap-1 font-mono text-[11px]">
                          <Lock size={10} />••••••••
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {canManagePayroll ? (
                        <button
                          onClick={() => deleteEmployee(emp.id)}
                          className="p-1 text-[#939BB2] hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors"
                          title="Remove employee"
                        >
                          <Trash2 size={13} />
                        </button>
                      ) : (
                        <span className="text-[#4E5671] text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enroll Employee Modal */}
      <Modal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        title="Enroll Employee in Payroll System"
        subtitle="Add compensation structures and department cost centers"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveEmployee} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Full Legal Name</label>
            <input
              type="text"
              placeholder="e.g., Varun Khurana"
              value={empForm.name}
              onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
              className="w-full bg-[#191E30] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Designation</label>
              <input
                type="text"
                placeholder="Senior Engineer"
                value={empForm.designation}
                onChange={(e) => setEmpForm({ ...empForm, designation: e.target.value })}
                className="w-full bg-[#191E30] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Department</label>
              <select
                value={empForm.department}
                onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
                className="w-full bg-[#191E30] text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none cursor-pointer"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Base Monthly Salary (INR)</label>
              <input
                type="number"
                placeholder="150000"
                value={empForm.baseSalary}
                onChange={(e) => setEmpForm({ ...empForm, baseSalary: e.target.value })}
                className="w-full bg-[#191E30] text-white font-mono text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Allowances / HRA</label>
              <input
                type="number"
                placeholder="20000"
                value={empForm.allowances}
                onChange={(e) => setEmpForm({ ...empForm, allowances: e.target.value })}
                className="w-full bg-[#191E30] text-white font-mono text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
            <Button variant="secondary" size="sm" onClick={() => setIsAddEmployeeOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="neon" size="sm">
              Enroll Employee
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
