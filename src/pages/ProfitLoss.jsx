import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieIcon,
  Percent,
  Layers,
  Building2,
  Receipt,
  Scale,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatPercent, formatCompactINR } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ProfitLoss = () => {
  const { metrics, transactions, activeCompany } = useFinance();
  const [reportPeriod, setReportPeriod] = useState('current_month'); // 'current_month' | 'annual'

  // Structured Corporate P&L Line Items
  const pnlData = useMemo(() => {
    const rev = metrics.totalRevenue;
    const cogs = metrics.cogs;
    const grossProfit = metrics.grossProfit;
    const grossMargin = metrics.grossMargin;

    // Break down OPEX by functional cost centers
    const engSpend = (metrics.departmentSpend.engineering || 0) + (metrics.departmentSpend.product_design || 0);
    const smSpend = metrics.departmentSpend.sales_marketing || 0;
    const hrSpend = metrics.departmentSpend.hr_payroll || 0;
    const opsSpend = metrics.departmentSpend.operations || 0;
    const finSpend = metrics.departmentSpend.finance_legal || 0;
    const totalOpex = metrics.totalExpenses;

    const operatingProfit = metrics.operatingProfit;
    const operatingMargin = metrics.operatingMargin;

    const taxes = metrics.taxes;
    const nonOpIncome = metrics.nonOperatingIncome;
    const netProfit = metrics.netProfit;
    const netMargin = metrics.netMargin;

    return {
      revenue: rev,
      cogs,
      grossProfit,
      grossMargin,
      opex: {
        engineering: engSpend,
        salesMarketing: smSpend,
        payroll: hrSpend,
        facilities: opsSpend,
        governance: finSpend,
        total: totalOpex,
      },
      operatingProfit,
      operatingMargin,
      taxes,
      nonOpIncome,
      netProfit,
      netMargin,
    };
  }, [metrics]);

  // Waterfall chart data
  const waterfallData = [
    { name: 'Revenue', amount: pnlData.revenue, fill: '#22D3EE' },
    { name: 'COGS', amount: -pnlData.cogs, fill: '#FB7185' },
    { name: 'Gross Profit', amount: pnlData.grossProfit, fill: '#38BDF8' },
    { name: 'OPEX', amount: -pnlData.opex.total, fill: '#FF4FD8' },
    { name: 'EBITDA', amount: pnlData.operatingProfit, fill: '#A855F7' },
    { name: 'Taxes', amount: -pnlData.taxes, fill: '#FBBF24' },
    { name: 'Net Profit', amount: pnlData.netProfit, fill: '#5CFFB2' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['NexusCapFIN Corporate Profit & Loss Statement'],
      [`Entity: ${activeCompany.name} (CIN: ${activeCompany.cin})`],
      [`Period: ${reportPeriod.toUpperCase()} (Base Currency: INR)`],
      [''],
      ['Line Item', 'Amount (INR)', '% of Revenue'],
      ['Gross Operating Revenue', pnlData.revenue, '100.0%'],
      ['Cost of Goods & Services (COGS)', -pnlData.cogs, `${((pnlData.cogs / pnlData.revenue) * 100).toFixed(1)}%`],
      ['GROSS PROFIT', pnlData.grossProfit, `${pnlData.grossMargin.toFixed(1)}%`],
      [''],
      ['OPERATING EXPENSES (OPEX)', '', ''],
      ['Engineering & Cloud Infrastructure', -pnlData.opex.engineering, `${((pnlData.opex.engineering / pnlData.revenue) * 100).toFixed(1)}%`],
      ['Sales & Marketing CAC', -pnlData.opex.salesMarketing, `${((pnlData.opex.salesMarketing / pnlData.revenue) * 100).toFixed(1)}%`],
      ['Consolidated Payroll & Benefits', -pnlData.opex.payroll, `${((pnlData.opex.payroll / pnlData.revenue) * 100).toFixed(1)}%`],
      ['Facilities & Operations', -pnlData.opex.facilities, `${((pnlData.opex.facilities / pnlData.revenue) * 100).toFixed(1)}%`],
      ['Audit, Legal & Compliance', -pnlData.opex.governance, `${((pnlData.opex.governance / pnlData.revenue) * 100).toFixed(1)}%`],
      ['TOTAL OPERATING EXPENSES', -pnlData.opex.total, `${((pnlData.opex.total / pnlData.revenue) * 100).toFixed(1)}%`],
      [''],
      ['OPERATING PROFIT (EBITDA)', pnlData.operatingProfit, `${pnlData.operatingMargin.toFixed(1)}%`],
      ['Statutory Advance Tax Remittance', -pnlData.taxes, `${((pnlData.taxes / pnlData.revenue) * 100).toFixed(1)}%`],
      ['Non-Operating Investment Yield', pnlData.nonOpIncome, `${((pnlData.nonOpIncome / pnlData.revenue) * 100).toFixed(1)}%`],
      ['NET PROFIT (RETAINED EARNINGS)', pnlData.netProfit, `${pnlData.netMargin.toFixed(1)}%`],
    ];

    const csvContent = csvRows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NexusCapFIN_PnL_${activeCompany.name.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Corporate Profit & Loss (P&L) Statement
          </h2>
          <p className="text-xs text-[#939BB2] mt-0.5">
            GAAP-aligned operating revenue, direct COGS, department OPEX, EBITDA, and net retainage
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={Printer} onClick={handlePrint}>
            Print Statement
          </Button>
          <Button variant="neon" size="sm" icon={Download} onClick={handleExportCSV}>
            Export P&L (CSV)
          </Button>
        </div>
      </div>

      {/* Margins Summary Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#121624] border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#939BB2]">
              Gross Profit Margin
            </span>
            <span className="text-2xl font-mono font-bold text-neon-cyan mt-0.5 block">
              {pnlData.grossMargin.toFixed(1)}%
            </span>
            <span className="text-[10px] text-[#939BB2]">Gross: {formatCompactINR(pnlData.grossProfit)}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neon-cyan/10 text-neon-cyan">
            <Percent size={18} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121624] border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#939BB2]">
              Operating Margin (EBITDA)
            </span>
            <span className="text-2xl font-mono font-bold text-neon-violet mt-0.5 block">
              {pnlData.operatingMargin.toFixed(1)}%
            </span>
            <span className="text-[10px] text-[#939BB2]">EBITDA: {formatCompactINR(pnlData.operatingProfit)}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neon-violet/10 text-neon-violet">
            <Scale size={18} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121624] border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#939BB2]">
              Net Profit Margin
            </span>
            <span className="text-2xl font-mono font-bold text-neon-mint mt-0.5 block">
              {pnlData.netMargin.toFixed(1)}%
            </span>
            <span className="text-[10px] text-[#939BB2]">Retained: {formatCompactINR(pnlData.netProfit)}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neon-mint/10 text-neon-mint">
            <TrendingUp size={18} />
          </div>
        </div>
      </div>

      {/* P&L Statement Formal Table */}
      <div className="p-6 rounded-2xl bg-[#121624] border border-white/10 shadow-card-depth space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/5">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-neon-cyan" />
              {activeCompany.name} — Income Statement
            </h3>
            <p className="text-xs text-[#939BB2]">
              Accounting classification: Accrual Basis • All values in Indian Rupee (INR)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#939BB2]">
            <span>CIN: {activeCompany.cin}</span>
            <span>•</span>
            <span>FY 2025-26</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-[#939BB2]">
                <th className="py-2.5 px-3">Accounting Category</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3 text-right">Amount (INR)</th>
                <th className="py-2.5 px-3 text-right">% of Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {/* REVENUE */}
              <tr className="bg-[#191E30]/40 font-bold text-white">
                <td className="py-3 px-3">1. Gross Operating Revenue</td>
                <td className="py-3 px-3 font-normal text-[#939BB2]">Top-Line Billings</td>
                <td className="py-3 px-3 text-right text-neon-cyan">{formatCurrency(pnlData.revenue)}</td>
                <td className="py-3 px-3 text-right">100.0%</td>
              </tr>
              <tr className="text-gray-300">
                <td className="py-2 px-3 pl-8">Cost of Services & Direct Hosting (COGS)</td>
                <td className="py-2 px-3 text-[#939BB2]">Direct Delivery</td>
                <td className="py-2 px-3 text-right text-rose-300">-{formatCurrency(pnlData.cogs)}</td>
                <td className="py-2 px-3 text-right">12.0%</td>
              </tr>
              <tr className="bg-[#0E1018] font-bold text-neon-cyan">
                <td className="py-2.5 px-3 pl-6">GROSS PROFIT</td>
                <td className="py-2.5 px-3">Revenue - COGS</td>
                <td className="py-2.5 px-3 text-right">{formatCurrency(pnlData.grossProfit)}</td>
                <td className="py-2.5 px-3 text-right">{pnlData.grossMargin.toFixed(1)}%</td>
              </tr>

              {/* OPEX */}
              <tr className="bg-[#191E30]/40 font-bold text-white pt-3">
                <td className="py-3 px-3">2. Operating Expenses (OPEX)</td>
                <td className="py-3 px-3 font-normal text-[#939BB2]">Indirect Overhead</td>
                <td className="py-3 px-3 text-right text-rose-400">-{formatCurrency(pnlData.opex.total)}</td>
                <td className="py-3 px-3 text-right">{((pnlData.opex.total / pnlData.revenue) * 100).toFixed(1)}%</td>
              </tr>
              <tr className="text-gray-300">
                <td className="py-2 px-3 pl-8">Consolidated Payroll & Benefits</td>
                <td className="py-2 px-3 text-[#939BB2]">Wages & PF</td>
                <td className="py-2 px-3 text-right">-{formatCurrency(pnlData.opex.payroll)}</td>
                <td className="py-2 px-3 text-right">{((pnlData.opex.payroll / pnlData.revenue) * 100).toFixed(1)}%</td>
              </tr>
              <tr className="text-gray-300">
                <td className="py-2 px-3 pl-8">Cloud Compute, GPUs & DevOps Tooling</td>
                <td className="py-2 px-3 text-[#939BB2]">Technology</td>
                <td className="py-2 px-3 text-right">-{formatCurrency(pnlData.opex.engineering)}</td>
                <td className="py-2 px-3 text-right">{((pnlData.opex.engineering / pnlData.revenue) * 100).toFixed(1)}%</td>
              </tr>
              <tr className="text-gray-300">
                <td className="py-2 px-3 pl-8">Sales Acquisition & Paid Marketing</td>
                <td className="py-2 px-3 text-[#939BB2]">Growth</td>
                <td className="py-2 px-3 text-right">-{formatCurrency(pnlData.opex.salesMarketing)}</td>
                <td className="py-2 px-3 text-right">{((pnlData.opex.salesMarketing / pnlData.revenue) * 100).toFixed(1)}%</td>
              </tr>
              <tr className="text-gray-300">
                <td className="py-2 px-3 pl-8">Corporate Facilities & Co-working Lease</td>
                <td className="py-2 px-3 text-[#939BB2]">Facilities</td>
                <td className="py-2 px-3 text-right">-{formatCurrency(pnlData.opex.facilities)}</td>
                <td className="py-2 px-3 text-right">{((pnlData.opex.facilities / pnlData.revenue) * 100).toFixed(1)}%</td>
              </tr>
              <tr className="text-gray-300">
                <td className="py-2 px-3 pl-8">Statutory Audit, Legal & Compliance</td>
                <td className="py-2 px-3 text-[#939BB2]">Governance</td>
                <td className="py-2 px-3 text-right">-{formatCurrency(pnlData.opex.governance)}</td>
                <td className="py-2 px-3 text-right">{((pnlData.opex.governance / pnlData.revenue) * 100).toFixed(1)}%</td>
              </tr>

              {/* OPERATING PROFIT / EBITDA */}
              <tr className="bg-[#0E1018] font-bold text-neon-violet">
                <td className="py-3 px-3 pl-6">OPERATING PROFIT (EBITDA)</td>
                <td className="py-3 px-3">Gross Profit - OPEX</td>
                <td className="py-3 px-3 text-right">{formatCurrency(pnlData.operatingProfit)}</td>
                <td className="py-3 px-3 text-right">{pnlData.operatingMargin.toFixed(1)}%</td>
              </tr>

              {/* TAXES & NON-OP */}
              <tr className="text-gray-300">
                <td className="py-2 px-3 pl-8">Statutory Advance Corporate Tax</td>
                <td className="py-2 px-3 text-[#939BB2]">Direct Taxes</td>
                <td className="py-2 px-3 text-right text-rose-300">-{formatCurrency(pnlData.taxes)}</td>
                <td className="py-2 px-3 text-right">{((pnlData.taxes / pnlData.revenue) * 100).toFixed(1)}%</td>
              </tr>
              <tr className="text-gray-300">
                <td className="py-2 px-3 pl-8">Treasury Liquid Fund Dividend Yield</td>
                <td className="py-2 px-3 text-[#939BB2]">Non-Operating</td>
                <td className="py-2 px-3 text-right text-neon-mint">+{formatCurrency(pnlData.nonOpIncome)}</td>
                <td className="py-2 px-3 text-right">{((pnlData.nonOpIncome / pnlData.revenue) * 100).toFixed(1)}%</td>
              </tr>

              {/* NET PROFIT */}
              <tr className="bg-gradient-to-r from-neon-mint/15 to-[#121624] font-extrabold text-neon-mint text-sm border-t-2 border-neon-mint/30">
                <td className="py-3.5 px-3">NET CORPORATE PROFIT (PAT)</td>
                <td className="py-3.5 px-3 font-normal text-xs text-white">Retained to Balance Sheet</td>
                <td className="py-3.5 px-3 text-right">{formatCurrency(pnlData.netProfit)}</td>
                <td className="py-3.5 px-3 text-right">{pnlData.netMargin.toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
