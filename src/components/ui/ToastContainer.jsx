import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useFinance();

  const getToastConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={17} />,
          classes: 'border-emerald-200 bg-emerald-50',
          titleClass: 'text-emerald-900',
          msgClass: 'text-emerald-700',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="text-amber-500 flex-shrink-0" size={17} />,
          classes: 'border-amber-200 bg-amber-50',
          titleClass: 'text-amber-900',
          msgClass: 'text-amber-700',
        };
      case 'error':
        return {
          icon: <XCircle className="text-red-500 flex-shrink-0" size={17} />,
          classes: 'border-red-200 bg-red-50',
          titleClass: 'text-red-900',
          msgClass: 'text-red-700',
        };
      default:
        return {
          icon: <Info className="text-indigo-500 flex-shrink-0" size={17} />,
          classes: 'border-indigo-200 bg-indigo-50',
          titleClass: 'text-indigo-900',
          msgClass: 'text-indigo-700',
        };
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = getToastConfig(toast.type);
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-[0_8px_25px_rgba(0,0,0,0.1)] ${config.classes}`}
            >
              <div className="mt-0.5">{config.icon}</div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-[13px] font-semibold leading-tight ${config.titleClass}`}>
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className={`text-[12px] mt-0.5 leading-relaxed ${config.msgClass}`}>
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-black/10 transition-colors flex-shrink-0"
                aria-label="Dismiss"
              >
                <X size={13} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
