import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  TrendingUp,
  FileSpreadsheet,
  Users,
  BrainCircuit,
  ArrowRight,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const QuickActions = () => {
  const { openComposer } = useFinance();
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Post Transaction',
      description: 'Record revenue or expenses',
      icon: PlusCircle,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      onClick: () => openComposer('operating_expense'),
    },
    {
      title: 'Investments',
      description: 'Model ROI & payback',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      onClick: () => navigate('/investments'),
    },
    {
      title: 'Headcount Sim',
      description: 'Test salary & new hires',
      icon: Users,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      onClick: () => navigate('/payroll'),
    },
    {
      title: 'Audit P&L',
      description: 'Inspect EBITDA waterfall',
      icon: FileSpreadsheet,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      onClick: () => navigate('/profit-loss'),
    },
    {
      title: 'AI Advisor',
      description: 'Ask finance questions',
      icon: BrainCircuit,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-600',
      onClick: () => navigate('/advisor'),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.title}
            onClick={act.onClick}
            className="p-4 rounded-xl bg-white border border-gray-200 text-left group flex flex-col justify-between hover:border-gray-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className={`p-2 rounded-lg ${act.iconBg}`}>
                <Icon size={15} className={act.iconColor} />
              </div>
              <ArrowRight
                size={13}
                className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
              />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-900">{act.title}</p>
              <p className="text-[11.5px] text-gray-400 mt-0.5 truncate">{act.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
