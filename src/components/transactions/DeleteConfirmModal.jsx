import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';

export const DeleteConfirmModal = ({ isOpen, onClose, transaction, onConfirm }) => {
  const { profile } = useFinance();

  if (!transaction) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Transaction"
      subtitle="Are you sure you want to permanently remove this financial record?"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-[#181B29] border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              {transaction.title}
            </p>
            <p className="text-xs text-[#9298AD] capitalize">
              {transaction.category?.replace(/_/g, ' ')} • {transaction.type}
            </p>
          </div>
          <span
            className={`font-mono text-sm font-bold ${
              transaction.type === 'expense' ? 'text-neon-pink' : 'text-neon-mint'
            }`}
          >
            {transaction.type === 'expense' ? '-' : '+'}
            {formatCurrency(transaction.amount, profile.currency)}
          </span>
        </div>

        <p className="text-xs text-[#9298AD] leading-relaxed">
          This will immediately update your calculated totals, charts, and budget utilization metrics. This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => {
              onConfirm(transaction.id);
              onClose();
            }}
          >
            Delete Record
          </Button>
        </div>
      </div>
    </Modal>
  );
};
