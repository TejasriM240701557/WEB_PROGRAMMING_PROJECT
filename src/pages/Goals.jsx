import React, { useState } from 'react';
import {
  Target,
  Plus,
  Calendar,
  Sparkles,
  TrendingUp,
  DollarSign,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Coins,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export const Goals = () => {
  const { goals, addGoal, updateGoal, deleteGoal, contributeToGoal, profile } = useFinance();

  // Modal states
  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [contributeTarget, setContributeTarget] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionNote, setContributionNote] = useState('');

  // Goal Form State
  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'Savings',
    color: '#22D3EE',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleOpenNewGoal = () => {
    setEditingGoal(null);
    setGoalForm({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      category: 'Savings',
      color: '#22D3EE',
      notes: '',
    });
    setFormErrors({});
    setIsNewGoalOpen(true);
  };

  const handleOpenEditGoal = (goal) => {
    setEditingGoal(goal);
    setGoalForm({
      name: goal.name,
      targetAmount: String(goal.targetAmount),
      currentAmount: String(goal.currentAmount),
      targetDate: goal.targetDate ? goal.targetDate.slice(0, 10) : '',
      category: goal.category || 'Savings',
      color: goal.color || '#22D3EE',
      notes: goal.notes || '',
    });
    setFormErrors({});
    setIsNewGoalOpen(true);
  };

  const handleOpenContribute = (goal) => {
    setContributeTarget(goal);
    setContributionAmount('');
    setContributionNote('');
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    const errors = {};
    if (!goalForm.name.trim()) errors.name = 'Goal title is required';
    const targetAmt = parseFloat(goalForm.targetAmount);
    if (!goalForm.targetAmount || isNaN(targetAmt) || targetAmt <= 0) {
      errors.targetAmount = 'Enter a valid target amount greater than 0';
    }
    if (!goalForm.targetDate) errors.targetDate = 'Target date is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        name: goalForm.name.trim(),
        targetAmount: targetAmt,
        currentAmount: parseFloat(goalForm.currentAmount) || 0,
        targetDate: goalForm.targetDate,
        category: goalForm.category,
        color: goalForm.color,
        notes: goalForm.notes.trim(),
      });
    } else {
      addGoal({
        name: goalForm.name.trim(),
        targetAmount: targetAmt,
        currentAmount: parseFloat(goalForm.currentAmount) || 0,
        targetDate: goalForm.targetDate,
        category: goalForm.category,
        color: goalForm.color,
        notes: goalForm.notes.trim(),
      });
    }
    setIsNewGoalOpen(false);
  };

  const handleConfirmContribution = (e) => {
    e.preventDefault();
    const amt = parseFloat(contributionAmount);
    if (!amt || amt <= 0) return;

    contributeToGoal(contributeTarget.id, amt, contributionNote.trim());
    setContributeTarget(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Financial Goals & Milestone Targets
          </h2>
          <p className="text-xs text-[#9298AD] mt-0.5">
            Dedicated capital pots, reserve velocity, and milestone completion
          </p>
        </div>

        <Button
          variant="neon"
          size="sm"
          icon={Plus}
          onClick={handleOpenNewGoal}
        >
          Initialize New Goal
        </Button>
      </div>

      {/* Goal Cards Grid */}
      {goals.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#11131D] border border-white/10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#181B29] mx-auto flex items-center justify-center text-[#9298AD] mb-3">
            <Target size={24} />
          </div>
          <h3 className="text-sm font-bold text-white">No Financial Goals Active</h3>
          <p className="text-xs text-[#9298AD] mt-1 max-w-sm mx-auto">
            Create your first target pot for emergency runways, gear upgrades, or expeditions.
          </p>
          <div className="mt-4">
            <Button variant="neon" size="sm" onClick={handleOpenNewGoal}>
              Create Goal
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {goals.map((goal) => {
            const current = Number(goal.currentAmount) || 0;
            const target = Number(goal.targetAmount) || 1;
            const remaining = Math.max(0, target - current);
            const progress = Math.min(100, (current / target) * 100);
            const isCompleted = current >= target;

            // Target date days remaining
            const targetDateObj = new Date(goal.targetDate);
            const daysLeft = Math.ceil((targetDateObj - new Date()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={goal.id}
                className="p-6 rounded-2xl bg-[#11131D] border border-white/10 shadow-card-depth transition-all duration-300 hover:border-white/20 flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Ambient Top Glow Line */}
                <div
                  className="absolute top-0 inset-x-0 h-1"
                  style={{ backgroundColor: goal.color || '#22D3EE' }}
                />

                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: goal.color || '#22D3EE' }}
                        />
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#9298AD]">
                          {goal.category || 'General'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight mt-1">
                        {goal.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditGoal(goal)}
                        className="p-1.5 text-[#9298AD] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        title="Edit goal"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1.5 text-[#9298AD] hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete goal"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {goal.notes && (
                    <p className="text-xs text-[#9298AD] mb-4 line-clamp-2">
                      {goal.notes}
                    </p>
                  )}

                  {/* Amounts */}
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      <span className="text-xs text-[#9298AD] block">Saved so far</span>
                      <span className="text-2xl font-mono font-bold text-white">
                        {formatCurrency(current, profile.currency)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[#9298AD] block">Target Goal</span>
                      <span className="text-base font-mono font-semibold text-[#9298AD]">
                        {formatCurrency(target, profile.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#08090F] h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5 my-2">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: goal.color || '#22D3EE',
                        boxShadow: `0 0 12px ${goal.color || '#22D3EE'}80`,
                      }}
                    />
                  </div>

                  {/* Meta: Progress % and Days left */}
                  <div className="flex items-center justify-between text-xs font-mono text-[#9298AD] mt-2">
                    <span className="font-bold text-white">
                      {progress.toFixed(1)}% Completed
                    </span>
                    <span>
                      {isCompleted
                        ? '🎉 Target Achieved!'
                        : `${formatCurrency(remaining, profile.currency)} remaining`}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-[#9298AD] font-mono">
                    <Clock size={13} />
                    <span>
                      {daysLeft > 0 ? `${daysLeft} days remaining` : 'Target date reached'}
                    </span>
                  </div>

                  <Button
                    variant="cyan"
                    size="sm"
                    icon={Coins}
                    onClick={() => handleOpenContribute(goal)}
                  >
                    Contribute
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New / Edit Goal Modal */}
      <Modal
        isOpen={isNewGoalOpen}
        onClose={() => setIsNewGoalOpen(false)}
        title={editingGoal ? 'Edit Financial Goal' : 'Initialize New Financial Goal'}
        subtitle="Define target reserves, deadline parameters, and categories"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[#9298AD] mb-1.5">
              Goal Title
            </label>
            <input
              type="text"
              placeholder="e.g., M4 Max Studio, Tokyo Expedition, Emergency Runway"
              value={goalForm.name}
              onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
              className="w-full bg-[#181B29] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-violet outline-none"
            />
            {formErrors.name && (
              <p className="text-xs text-rose-400 mt-1">• {formErrors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#9298AD] mb-1.5">
                Target Amount ({profile.currency || 'INR'})
              </label>
              <input
                type="number"
                step="50"
                min="1"
                placeholder="5000"
                value={goalForm.targetAmount}
                onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                className="w-full bg-[#181B29] text-white font-mono text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-violet outline-none"
              />
              {formErrors.targetAmount && (
                <p className="text-xs text-rose-400 mt-1">• {formErrors.targetAmount}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#9298AD] mb-1.5">
                Current Initial Deposit
              </label>
              <input
                type="number"
                step="50"
                min="0"
                placeholder="0"
                value={goalForm.currentAmount}
                onChange={(e) => setGoalForm({ ...goalForm, currentAmount: e.target.value })}
                className="w-full bg-[#181B29] text-white font-mono text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-violet outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#9298AD] mb-1.5">
                Target Deadline Date
              </label>
              <input
                type="date"
                value={goalForm.targetDate}
                onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                className="w-full bg-[#181B29] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-violet outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#9298AD] mb-1.5">
                Category
              </label>
              <select
                value={goalForm.category}
                onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value })}
                className="w-full bg-[#181B29] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-violet outline-none cursor-pointer"
              >
                <option value="Savings">General Savings</option>
                <option value="Tech & Hardware">Tech & Hardware</option>
                <option value="Travel">Travel & Expedition</option>
                <option value="Security">Security & Runway</option>
                <option value="Education">Education & Courses</option>
                <option value="Real Estate">Property & Housing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#9298AD] mb-1.5">
              Description / Milestone Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Target 6 months expenses liquid in high-yield account"
              value={goalForm.notes}
              onChange={(e) => setGoalForm({ ...goalForm, notes: e.target.value })}
              className="w-full bg-[#181B29] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-violet outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsNewGoalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="neon" size="sm">
              {editingGoal ? 'Update Goal' : 'Save Goal'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Contribute Modal */}
      <Modal
        isOpen={Boolean(contributeTarget)}
        onClose={() => setContributeTarget(null)}
        title={`Deposit toward "${contributeTarget?.name}"`}
        subtitle="Allocate savings to increase progress toward this milestone"
        maxWidth="max-w-md"
      >
        {contributeTarget && (
          <form onSubmit={handleConfirmContribution} className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0E1018] border border-white/5">
              <label className="block text-xs font-semibold uppercase font-mono tracking-wider text-[#9298AD] mb-2">
                Deposit Amount ({profile.currency || 'INR'})
              </label>
              <input
                type="number"
                step="1"
                min="1"
                placeholder="250"
                autoFocus
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="w-full bg-[#181B29] text-center font-mono font-bold text-2xl text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#9298AD] mb-1.5">
                Note / Allocation Memo (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Sprint bonus, monthly transfer, side client"
                value={contributionNote}
                onChange={(e) => setContributionNote(e.target.value)}
                className="w-full bg-[#181B29] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-cyan outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setContributeTarget(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="mint" size="sm" icon={Sparkles}>
                Confirm Contribution
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
