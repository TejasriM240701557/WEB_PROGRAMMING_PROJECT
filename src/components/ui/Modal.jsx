import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  showClose = true,
}) => {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#08090F]/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Dialog Content */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full ${maxWidth} bg-[#11131D] border border-white/10 rounded-2xl shadow-card-depth overflow-hidden z-10 my-8`}
            role="dialog"
            aria-modal="true"
          >
            {/* Ambient Top Glow Line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink opacity-80" />

            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-start justify-between p-6 border-b border-white/5">
                <div>
                  {title && (
                    <h3 className="text-xl font-bold tracking-tight text-[#F5F7FF]">
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="text-sm text-[#9298AD] mt-1 font-normal">
                      {subtitle}
                    </p>
                  )}
                </div>

                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-1.5 text-[#9298AD] hover:text-white rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
                    aria-label="Close dialog"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 max-h-[calc(85vh-120px)] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
