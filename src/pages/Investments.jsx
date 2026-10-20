import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  PieChart as PieIcon,
  Calculator,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2,
  DollarSign,
  Briefcase,
  Layers,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatCompactINR, formatPercent } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const Investments = () => {
  const {
    investments,
    opportunities,
    metrics,
    addInvestment,
    deleteInvestment,
    addOpportunity,
    evaluateOpportunity,
  } = useFinance();

  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' | 'evaluator'
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isAddOppOpen, setIsAddOppOpen] = useState(false);

  // New Investment Asset Form
  const [assetForm, setAssetForm] = useState({
    name: '',
    category: 'Sovereign Debt',
    investedAmount: '',
    currentValue: '',
    realizedReturns: '0',
    yieldRate: '6.5',
    riskLevel: 'Ultra Low (AAA)',
    notes: '',
  });

  // New Opportunity Form
  const [oppForm, setOppForm] = useState({
    name: '',
    category: 'Market Expansion',
    proposedAmount: '',
    expectedAnnualRevenue: '',
    expectedAnnualCost: '',
    expectedUsefulLifeYears: '3',
    riskLevel: 'Medium',
    confidenceScore: '85',
    description: '',
  });

  const handleSaveAsset = (e) => {
    e.preventDefault();
    if (!assetForm.name.trim() || !assetForm.investedAmount) return;

    addInvestment({
      name: assetForm.name.trim(),
      category: assetForm.category,
      investedAmount: parseFloat(assetForm.investedAmount),
      currentValue: parseFloat(assetForm.currentValue) || parseFloat(assetForm.investedAmount),
      realizedReturns: parseFloat(assetForm.realizedReturns) || 0,
      yieldRate: parseFloat(assetForm.yieldRate) || 6.5,
      riskLevel: assetForm.riskLevel,
      notes: assetForm.notes.trim(),
      allocationPercent: 15,
    });
    setIsAddAssetOpen(false);
  };

  const handleSaveOpp = (e) => {
    e.preventDefault();
    if (!oppForm.name.trim() || !oppForm.proposedAmount) return;

    addOpportunity({
      name: oppForm.name.trim(),
      category: oppForm.category,
      proposedAmount: parseFloat(oppForm.proposedAmount),
      expectedAnnualRevenue: parseFloat(oppForm.expectedAnnualRevenue) || 0,
      expectedAnnualCost: parseFloat(oppForm.expectedAnnualCost) || 0,
      expectedUsefulLifeYears: parseInt(oppForm.expectedUsefulLifeYears) || 3,
      riskLevel: oppForm.riskLevel,
      confidenceScore: parseInt(oppForm.confidenceScore) || 85,
      description: oppForm.description.trim(),
    });
    setIsAddOppOpen(false);
  };

  // Pie chart data for allocation
  const pieData = investments.map((inv, idx) => {
    const colors = ['#22D3EE', '#A855F7', '#5CFFB2', '#38BDF8', '#FF4FD8', '#FBBF24'];
    return {
      name: inv.name,
      value: Number(inv.currentValue) || 1,
      color: colors[idx % colors.length],
    };
  });

  return (
    <div className="space-y-6 sm:space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Treasury & Investment Intelligence
          </h2>
          <p className="text-xs text-[#939BB2] mt-0.5">
            Sovereign debt reserves, liquidity yields, and business opportunity decision-support
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'portfolio' ? (
            <Button
              variant="neon"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddAssetOpen(true)}
            >
              Add Treasury Asset
            </Button>
          ) : (
            <Button
              variant="neon"
              size="sm"
              icon={Calculator}
              onClick={() => setIsAddOppOpen(true)}
            >
              Model New Proposal
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`pb-3 transition-colors relative flex items-center gap-2 ${
            activeTab === 'portfolio' ? 'text-neon-cyan' : 'text-[#939BB2] hover:text-white'
          }`}
        >
          <Briefcase size={15} />
          Active Treasury Portfolio ({investments.length})
          {activeTab === 'portfolio' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-violet shadow-glow-cyan" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('evaluator')}
          className={`pb-3 transition-colors relative flex items-center gap-2 ${
            activeTab === 'evaluator' ? 'text-neon-cyan' : 'text-[#939BB2] hover:text-white'
          }`}
        >
          <Sparkles size={15} />
          Investment Opportunity Evaluator ({opportunities.length})
          {activeTab === 'evaluator' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-violet shadow-glow-cyan" />
          )}
        </button>
      </div>

      {activeTab === 'portfolio' ? (
        <div className="space-y-6">
          {/* Treasury Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#121624] border border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#939BB2] block">
                Total Portfolio Valuation
              </span>
              <span className="text-2xl font-mono font-bold text-white mt-1 block">
                {formatCurrency(metrics.portfolioValue)}
              </span>
              <span className="text-[10px] font-mono text-neon-mint mt-1 block">
                Unrealized Gains: +{formatCompactINR(metrics.unrealizedGains)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#121624] border border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#939BB2] block">
                Capital Invested
              </span>
              <span className="text-2xl font-mono font-bold text-white mt-1 block">
                {formatCurrency(metrics.totalInvestedCapital)}
              </span>
              <span className="text-[10px] text-[#939BB2] mt-1 block">
                Across {investments.length} sovereign & IP positions
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#121624] border border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#939BB2] block">
                Blended Portfolio ROI
              </span>
              <span className="text-2xl font-mono font-bold text-neon-cyan mt-1 block">
                {formatPercent(metrics.portfolioROI, false)}
              </span>
              <span className="text-[10px] font-mono text-neon-cyan mt-1 block">
                Weighted yield: 7.2% annualized
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#121624] border border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#939BB2] block">
                Concentration Safety
              </span>
              <span className="text-2xl font-mono font-bold text-neon-mint mt-1 block">
                Low Risk
              </span>
              <span className="text-[10px] text-[#939BB2] mt-1 block">
                72% in Sovereign T-Bills & Overnight Funds
              </span>
            </div>
          </div>

          {/* Allocation Ring & Assets Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Donut Allocation */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-[#121624] border border-white/10 shadow-card-depth flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Asset Allocation Mix</h3>
                <p className="text-[11px] text-[#939BB2]">Portfolio risk diversification</p>
                <div className="h-48 relative flex items-center justify-center my-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => formatCompactINR(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/5">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 text-white truncate max-w-[170px]">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </span>
                    <span className="text-[#939BB2]">{formatCompactINR(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assets Table */}
            <div className="lg:col-span-8 p-5 rounded-2xl bg-[#121624] border border-white/10 shadow-card-depth overflow-hidden">
              <h3 className="text-sm font-bold text-white mb-3">Portfolio Holdings Register</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-mono uppercase tracking-wider text-[#939BB2]">
                      <th className="py-2.5 px-3">Asset Holding</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Invested Capital</th>
                      <th className="py-2.5 px-3">Current Value</th>
                      <th className="py-2.5 px-3">Unrealized Gain</th>
                      <th className="py-2.5 px-3">Risk Rating</th>
                      <th className="py-2.5 px-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {investments.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#191E30]/60 transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-sans font-bold text-white">{inv.name}</p>
                          <p className="text-[10px] text-[#939BB2]">{inv.notes}</p>
                        </td>
                        <td className="py-3 px-3 font-sans text-gray-300">{inv.category}</td>
                        <td className="py-3 px-3 text-white">{formatCurrency(inv.investedAmount)}</td>
                        <td className="py-3 px-3 font-bold text-neon-cyan">{formatCurrency(inv.currentValue)}</td>
                        <td className="py-3 px-3 text-neon-mint">+{formatCompactINR(inv.unrealizedGains)}</td>
                        <td className="py-3 px-3">
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-gray-200 border border-white/10">
                            {inv.riskLevel}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => deleteInvestment(inv.id)}
                            className="p-1 text-[#939BB2] hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Opportunity Evaluator Tab */
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[#090B12] border border-white/5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                NexusCapFIN Investment Decision Support Engine
              </h4>
              <p className="text-xs text-[#939BB2] mt-0.5">
                Every opportunity is cross-examined against available cash, reserve mandates (₹45.0L), and payback horizon.
              </p>
            </div>
            <div className="text-right font-mono text-xs">
              <span className="text-[#939BB2]">Available Liquid Cash: </span>
              <span className="text-neon-cyan font-bold">{formatCompactINR(metrics.availableCash)}</span>
            </div>
          </div>

          {/* Opportunities Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {opportunities.map((opp) => {
              const evalResult = evaluateOpportunity(opp);

              return (
                <div
                  key={opp.id}
                  className="p-5 rounded-2xl bg-[#121624] border border-white/10 shadow-card-depth flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 px-2 py-0.5 rounded-full">
                        {opp.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          evalResult.badgeColor === 'mint'
                            ? 'bg-neon-mint/10 text-neon-mint border border-neon-mint/30'
                            : evalResult.badgeColor === 'coral'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                        }`}
                      >
                        {evalResult.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">
                      {opp.name}
                    </h3>
                    <p className="text-xs text-[#939BB2] mt-1 line-clamp-2">
                      {opp.description}
                    </p>

                    {/* Financial Calculations Box */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#0E1018] border border-white/5 my-3 font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-[#939BB2] block">Proposed Outlay:</span>
                        <span className="font-bold text-white">{formatCurrency(opp.proposedAmount)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#939BB2] block">Projected ROI:</span>
                        <span className="font-bold text-neon-mint">+{evalResult.roi.toFixed(0)}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#939BB2] block">Payback Window:</span>
                        <span className="font-bold text-neon-cyan">{evalResult.paybackMonths.toFixed(1)} Months</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#939BB2] block">Annual Net Profit:</span>
                        <span className="font-bold text-white">+{formatCompactINR(evalResult.annualNetProfit)}</span>
                      </div>
                    </div>

                    {/* AI Decision Rationale */}
                    <div className="p-3 rounded-xl bg-[#191E30]/70 border border-white/5 text-[11px] text-gray-300 space-y-1">
                      <p className="font-semibold text-white flex items-center gap-1.5">
                        <Sparkles size={13} className="text-neon-cyan" />
                        Management Recommendation
                      </p>
                      <p className="leading-relaxed text-[#939BB2]">
                        {evalResult.recommendation}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#939BB2]">
                    <span>Confidence Score: {opp.confidenceScore}%</span>
                    <span>Risk: {opp.riskLevel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Treasury Asset Modal */}
      <Modal
        isOpen={isAddAssetOpen}
        onClose={() => setIsAddAssetOpen(false)}
        title="Add Corporate Treasury Asset"
        subtitle="Log capital assets, sovereign bills, or strategic investments"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveAsset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Asset Name</label>
            <input
              type="text"
              placeholder="e.g., 91-Day Sovereign T-Bills"
              value={assetForm.name}
              onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
              className="w-full bg-[#191E30] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Capital Invested (INR)</label>
              <input
                type="number"
                placeholder="2500000"
                value={assetForm.investedAmount}
                onChange={(e) => setAssetForm({ ...assetForm, investedAmount: e.target.value })}
                className="w-full bg-[#191E30] text-white font-mono text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Current Valuation</label>
              <input
                type="number"
                placeholder="2600000"
                value={assetForm.currentValue}
                onChange={(e) => setAssetForm({ ...assetForm, currentValue: e.target.value })}
                className="w-full bg-[#191E30] text-white font-mono text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Asset Class</label>
              <select
                value={assetForm.category}
                onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value })}
                className="w-full bg-[#191E30] text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none cursor-pointer"
              >
                <option value="Sovereign Debt">Sovereign Debt</option>
                <option value="Debt Mutual Fund">Debt Mutual Fund</option>
                <option value="Alternative IP Asset">Alternative IP Asset</option>
                <option value="Venture Debt">Venture Debt</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Risk Rating</label>
              <select
                value={assetForm.riskLevel}
                onChange={(e) => setAssetForm({ ...assetForm, riskLevel: e.target.value })}
                className="w-full bg-[#191E30] text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none cursor-pointer"
              >
                <option value="Ultra Low (AAA)">Ultra Low (AAA)</option>
                <option value="Low (T+1 Liquidity)">Low (T+1 Liquidity)</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Custodian / Thesis Notes</label>
            <input
              type="text"
              placeholder="e.g., RBI NDS-OM primary reserve allocation"
              value={assetForm.notes}
              onChange={(e) => setAssetForm({ ...assetForm, notes: e.target.value })}
              className="w-full bg-[#191E30] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
            <Button variant="secondary" size="sm" onClick={() => setIsAddAssetOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="neon" size="sm">
              Save Holding
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Proposal Modal */}
      <Modal
        isOpen={isAddOppOpen}
        onClose={() => setIsAddOppOpen(false)}
        title="Model New Investment Opportunity"
        subtitle="Evaluate capital allocation against operational reserves"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveOpp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Proposal Title</label>
            <input
              type="text"
              placeholder="e.g., AI Private GPU Compute Node"
              value={oppForm.name}
              onChange={(e) => setOppForm({ ...oppForm, name: e.target.value })}
              className="w-full bg-[#191E30] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Proposed Outlay (INR)</label>
              <input
                type="number"
                placeholder="3000000"
                value={oppForm.proposedAmount}
                onChange={(e) => setOppForm({ ...oppForm, proposedAmount: e.target.value })}
                className="w-full bg-[#191E30] text-white font-mono text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Expected Annual Revenue</label>
              <input
                type="number"
                placeholder="6000000"
                value={oppForm.expectedAnnualRevenue}
                onChange={(e) => setOppForm({ ...oppForm, expectedAnnualRevenue: e.target.value })}
                className="w-full bg-[#191E30] text-white font-mono text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Annual Operating Cost</label>
              <input
                type="number"
                placeholder="1200000"
                value={oppForm.expectedAnnualCost}
                onChange={(e) => setOppForm({ ...oppForm, expectedAnnualCost: e.target.value })}
                className="w-full bg-[#191E30] text-white font-mono text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Evaluation Period (Years)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={oppForm.expectedUsefulLifeYears}
                onChange={(e) => setOppForm({ ...oppForm, expectedUsefulLifeYears: e.target.value })}
                className="w-full bg-[#191E30] text-white font-mono text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#939BB2] mb-1">Executive Summary / Case</label>
            <textarea
              placeholder="Explain expected business impact and cost reductions..."
              rows={2}
              value={oppForm.description}
              onChange={(e) => setOppForm({ ...oppForm, description: e.target.value })}
              className="w-full bg-[#191E30] text-white text-xs px-3.5 py-2 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
            <Button variant="secondary" size="sm" onClick={() => setIsAddOppOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="neon" size="sm">
              Evaluate Proposal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
