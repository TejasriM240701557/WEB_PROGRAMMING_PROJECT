import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { DEPARTMENTS } from '../../utils/constants';
import { formatCurrency, formatCompactINR } from '../../utils/formatters';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Light-themed department colors
const LIGHT_COLORS = ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#F43F5E'];

export const CategoryDonut = () => {
  const { metrics } = useFinance();
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState(null);

  const data = useMemo(() => {
    return DEPARTMENTS.map((d, idx) => {
      const spend = metrics.departmentSpend[d.id] || 0;
      return {
        id: d.id,
        name: d.name,
        code: d.code,
        color: LIGHT_COLORS[idx % LIGHT_COLORS.length],
        value: spend,
        percentage: metrics.totalExpenses > 0 ? (spend / metrics.totalExpenses) * 100 : 0,
      };
    }).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
  }, [metrics]);

  const activeDept = selectedDept ? data.find(d => d.id === selectedDept) : data[0];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">Cost Centers</h3>
          <p className="text-[12px] text-gray-400 mt-0.5">Expense distribution by department</p>
        </div>
        <button
          onClick={() => navigate('/budgets')}
          className="text-[12px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium"
        >
          Budgets
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Donut + Legend */}
      <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
        {/* Donut */}
        <div className="relative w-44 h-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={70}
                paddingAngle={3}
                stroke="none"
                onClick={(entry) => setSelectedDept(entry.id)}
                cursor="pointer"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.id}
                    fill={entry.color}
                    opacity={selectedDept && selectedDept !== entry.id ? 0.3 : 1}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-[12px] shadow-md">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p style={{ color: item.color }} className="mt-0.5 font-medium">
                          {formatCompactINR(item.value)} ({item.percentage.toFixed(1)}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
              {activeDept?.code || 'TOTAL'}
            </span>
            <span className="text-[14px] font-bold text-gray-900 mt-0.5">
              {formatCompactINR(activeDept ? activeDept.value : metrics.totalExpenses)}
            </span>
            <span className="text-[11px] text-indigo-500 font-medium">
              {activeDept ? `${activeDept.percentage.toFixed(0)}%` : '100%'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1.5 min-w-0 w-full">
          {data.map((dept) => {
            const isSelected = selectedDept === dept.id;
            return (
              <div
                key={dept.id}
                onClick={() => setSelectedDept(isSelected ? null : dept.id)}
                className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                  isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: dept.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-gray-700 truncate">{dept.name}</p>
                    <div className="w-16 bg-gray-200 h-1 rounded-full mt-0.5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${dept.percentage}%`, backgroundColor: dept.color }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[12px] font-semibold text-gray-900 block">
                    {formatCompactINR(dept.value)}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {dept.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
