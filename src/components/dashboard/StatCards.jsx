import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Scale,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatPercent, formatCompactINR } from '../../utils/formatters';
import { Sparkline } from '../ui/Sparkline';

export const StatCards = () => {
  const { metrics, profile, toggleHideBalance } = useFinance();
  const isHidden = profile.hideBalance;

  const cards = [
    {
      id: 'revenue',
      title: 'Gross Revenue',
      amount: metrics.totalRevenue,
      change: metrics.mom.revenueChange,
      changeLabel: 'vs prior period',
      isPositive: metrics.mom.revenueChange >= 0,
      sparkline: metrics.sparklines.revenue,
      sparkColor: '#6366F1',
      accentColor: 'indigo',
      icon: TrendingUp,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      tooltip: 'Total billed revenue including SaaS subscriptions and API consumption.',
    },
    {
      id: 'expenses',
      title: 'Total Expenses (OPEX)',
      amount: metrics.totalExpenses,
      change: metrics.mom.expenseChange,
      changeLabel: 'vs prior period',
      isPositive: metrics.mom.expenseChange <= 0,
      sparkline: metrics.sparklines.expense,
      sparkColor: '#EC4899',
      accentColor: 'pink',
      icon: TrendingDown,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-600',
      tooltip: 'Consolidated OPEX including payroll, cloud, marketing, and facilities.',
    },
    {
      id: 'net_profit',
      title: 'Net Profit / Loss',
      amount: metrics.netProfit,
      subValue: `Margin: ${metrics.netMargin.toFixed(1)}%`,
      change: metrics.mom.profitChange,
      changeLabel: 'vs prior period',
      isPositive: metrics.netProfit >= 0,
      sparkline: metrics.sparklines.profit,
      sparkColor: '#10B981',
      accentColor: 'emerald',
      icon: Scale,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      tooltip: 'Operating Profit (EBITDA) minus statutory taxes.',
    },
    {
      id: 'available_cash',
      title: 'Available Cash',
      amount: metrics.availableCash,
      subValue: `Runway: ${metrics.cashRunwayMonths > 120 ? '> 10 yrs' : `${metrics.cashRunwayMonths.toFixed(1)} mo`}`,
      change: 4.8,
      changeLabel: 'reserve buffer',
      isPositive: metrics.hasHealthyReserve,
      sparkline: metrics.sparklines.cash,
      sparkColor: '#06B6D4',
      accentColor: 'cyan',
      icon: Wallet,
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      showPrivacyToggle: true,
      tooltip: 'Total balances across bank accounts and payment gateway settlements.',
    },
    {
      id: 'portfolio_value',
      title: 'Investment Portfolio',
      amount: metrics.portfolioValue,
      subValue: `Unrealized: +${formatCompactINR(metrics.unrealizedGains)}`,
      change: metrics.portfolioROI,
      changeLabel: 'portfolio ROI',
      isPositive: metrics.portfolioROI >= 0,
      sparkline: metrics.sparklines.revenue,
      sparkColor: '#8B5CF6',
      accentColor: 'violet',
      icon: PiggyBank,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      tooltip: 'T-Bills, overnight funds, and strategic tech assets.',
    },
    {
      id: 'operating_margin',
      title: 'Operating Margin (EBITDA)',
      isPercentCard: true,
      amount: metrics.operatingMargin,
      subValue: `EBITDA: ${formatCompactINR(metrics.operatingProfit)}`,
      change: metrics.operatingMargin - 22.0,
      changeLabel: 'vs 22% target',
      isPositive: metrics.operatingMargin >= 20,
      sparkline: metrics.sparklines.profit,
      sparkColor: '#F59E0B',
      accentColor: 'amber',
      icon: Percent,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      tooltip: 'Operating efficiency: (Revenue - OPEX - Payroll) / Revenue.',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const displayValue = isHidden
          ? '••••••'
          : card.isPercentCard
          ? `${card.amount.toFixed(1)}%`
          : formatCompactINR(card.amount);

        return (
          <div
            key={card.id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
            title={card.tooltip}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <span className="text-[11.5px] font-medium text-gray-500 leading-snug pr-2">
                {card.title}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                {card.showPrivacyToggle && (
                  <button
                    onClick={toggleHideBalance}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title={isHidden ? 'Reveal' : 'Hide'}
                  >
                    {isHidden
                      ? <EyeOff size={12} className="text-indigo-500" />
                      : <Eye size={12} />}
                  </button>
                )}
                <div className={`p-1.5 rounded-lg ${card.iconBg}`}>
                  <Icon size={13} className={card.iconColor} />
                </div>
              </div>
            </div>

            {/* Amount */}
            <div>
              <h3 className="text-[22px] font-bold text-gray-900 leading-none tracking-tight tabular-nums">
                {displayValue}
              </h3>
              {card.subValue && !isHidden && (
                <p className="text-[11px] text-gray-400 mt-1 font-medium">
                  {card.subValue}
                </p>
              )}
            </div>

            {/* Footer: trend + sparkline */}
            <div className="flex items-end justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1 text-[12px]">
                {card.isPositive ? (
                  <span className="flex items-center gap-0.5 text-emerald-600 font-semibold">
                    <ArrowUpRight size={13} />
                    {formatPercent(Math.abs(card.change), false)}
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-red-500 font-semibold">
                    <ArrowDownRight size={13} />
                    {formatPercent(Math.abs(card.change), false)}
                  </span>
                )}
                <span className="text-[11px] text-gray-400 truncate">{card.changeLabel}</span>
              </div>

              {!isHidden && (
                <div className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                  <Sparkline
                    data={card.sparkline}
                    color={card.sparkColor}
                    width={50}
                    height={20}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
