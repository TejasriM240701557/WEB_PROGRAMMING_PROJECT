import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { TopNavbar } from '../navigation/TopNavbar';
import { CommandPalette } from '../navigation/CommandPalette';
import { ToastContainer } from '../ui/ToastContainer';
import { TransactionComposerModal } from '../transactions/TransactionComposerModal';
import { useFinance } from '../../context/FinanceContext';

export const AppLayout = () => {
  const location = useLocation();
  const {
    openComposer,
    isCommandPaletteOpen,
    closeCommandPalette,
  } = useFinance();

  // Reset scroll on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#111827] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-800 overflow-x-hidden">

      {/* Sticky Top Navigation */}
      <TopNavbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Modals, Command Palette & Notifications */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={closeCommandPalette}
      />
      <TransactionComposerModal />
      <ToastContainer />
    </div>
  );
};
