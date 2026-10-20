import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  FileSpreadsheet,
  PieChart,
  Users,
  LineChart,
  BrainCircuit,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  Command,
  Search,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const NAV_GROUPS = [
  {
    groupTitle: 'WORKSPACE',
    items: [
      { name: 'Overview', path: '/', icon: LayoutDashboard },
      { name: 'Transactions', path: '/transactions', icon: Receipt },
      { name: 'Investments', path: '/investments', icon: TrendingUp },
      { name: 'Profit & Loss', path: '/profit-loss', icon: FileSpreadsheet },
    ],
  },
  {
    groupTitle: 'FINANCIAL MANAGEMENT',
    items: [
      { name: 'Budgets', path: '/budgets', icon: PieChart },
      { name: 'Payroll & Team', path: '/payroll', icon: Users },
      { name: 'Cash Forecasts', path: '/forecasts', icon: LineChart },
    ],
  },
  {
    groupTitle: 'INTELLIGENCE & SYSTEM',
    items: [
      { name: 'AI Advisor', path: '/advisor', icon: BrainCircuit, badge: 'AI' },
      { name: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const {
    sidebarCollapsed,
    toggleSidebar,
    activeCompany,
    profile,
    openCommandPalette,
  } = useFinance();

  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <>
      {/* Mobile Backdrop with Blur */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Main Corporate Signature Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#0A0C14] border-r border-white/5 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Sidebar Navigation"
      >
        {/* Subtle Ambient Top Glow */}
        <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-neon-cyan/5 via-neon-violet/5 to-transparent blur-2xl pointer-events-none" />

        {/* Distinctive Floating Toggle Control at Sidebar Boundary */}
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'}
          aria-expanded={!sidebarCollapsed}
          className="hidden lg:flex items-center justify-center absolute -right-3.5 top-7 z-50 w-7 h-7 rounded-full bg-[#0E121E] border border-neon-cyan/40 text-[#939BB2] hover:text-white hover:border-neon-cyan hover:shadow-glow-cyan/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 active:scale-90 transition-all shadow-md shadow-black/80"
          title={sidebarCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar'}
        >
          <motion.div
            animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft size={14} className="stroke-[2.5]" />
          </motion.div>
        </button>

        {/* Brand Header */}
        <div className="relative flex items-center justify-between h-20 px-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Signature Geometric Delta Glyph with Animated Border */}
            <div className="relative shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-neon-cyan via-neon-violet to-neon-pink p-[1px] shadow-glow-violet/30 group cursor-pointer">
              <div className="w-full h-full bg-[#08090F] rounded-[11px] flex items-center justify-center relative overflow-hidden">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-neon-cyan group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3L2 20h20L12 3z" fill="rgba(34, 211, 238, 0.15)" />
                  <path d="M12 9l-4 8h8l-4-8z" stroke="#A855F7" fill="rgba(168, 85, 247, 0.3)" />
                </svg>
              </div>
            </div>

            {/* Brand Title & Tagline */}
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0 transition-opacity duration-300">
                <span className="text-lg font-black tracking-wider text-white font-sans flex items-center gap-1.5">
                  NexusCapFIN
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon-mint animate-pulse" />
                </span>
                <span className="text-[10px] uppercase tracking-widest text-neon-cyan font-mono font-medium truncate">
                  Corporate Terminal
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Active Company Pill (When expanded) */}
        {!sidebarCollapsed ? (
          <div className="px-3 pt-3 pb-1 shrink-0">
            <div className="p-2.5 rounded-xl bg-[#121624] border border-white/5 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-neon-violet/15 text-neon-cyan shrink-0">
                <Building2 size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {activeCompany.name}
                </p>
                <p className="text-[10px] text-[#939BB2] font-mono truncate">
                  {activeCompany.activeTier}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-3 pt-3 pb-1 flex justify-center shrink-0">
            <div
              className="p-2 rounded-xl bg-[#121624] border border-white/5 text-neon-cyan cursor-pointer"
              title={`${activeCompany.name} (${activeCompany.activeTier})`}
            >
              <Building2 size={16} />
            </div>
          </div>
        )}

        {/* Command Palette Quick Trigger in Sidebar */}
        <div className="px-3 py-2 shrink-0">
          <button
            onClick={openCommandPalette}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-xs text-[#939BB2] hover:text-white transition-all duration-200 ${
              sidebarCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Open Command Palette (Ctrl+K)"
          >
            <Command size={14} className="text-neon-cyan shrink-0" />
            {!sidebarCollapsed && (
              <>
                <span className="flex-1 text-left truncate font-sans">Command Palette</span>
                <kbd className="text-[10px] font-mono bg-white/5 border border-white/10 px-1.5 py-0.2 rounded text-[#737B92]">
                  ⌘K
                </kbd>
              </>
            )}
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 py-2 px-3 space-y-4 overflow-y-auto overflow-x-hidden">
          {NAV_GROUPS.map((group, groupIdx) => (
            <div key={group.groupTitle} className="space-y-1">
              {/* Section Header */}
              {!sidebarCollapsed ? (
                <div className="px-3 pt-2 pb-1 text-[10px] font-mono font-semibold tracking-wider text-[#6B7280] uppercase">
                  {group.groupTitle}
                </div>
              ) : (
                groupIdx > 0 && <div className="my-2 border-t border-white/5 mx-2" />
              )}

              {/* Items in Section */}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                    onMouseEnter={() => setHoveredItem(item.path)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={({ isActive: active }) =>
                      `group relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-medium outline-none ${
                        sidebarCollapsed ? 'justify-center px-0' : ''
                      } ${
                        active
                          ? 'text-white bg-gradient-to-r from-neon-violet/15 via-neon-cyan/5 to-transparent border border-neon-violet/30 shadow-glow-violet/20'
                          : 'text-[#939BB2] hover:text-[#F5F7FF] hover:bg-white/5 border border-transparent'
                      }`
                    }
                  >
                    {/* Signature Animated Active Indicator Bar */}
                    {isActive && (
                      <motion.span
                        layoutId="sidebarActiveIndicator"
                        className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-neon-cyan via-neon-violet to-neon-pink shadow-glow-violet"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}

                    {/* Luminous Icon */}
                    <Icon
                      size={18}
                      className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive
                          ? 'text-neon-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                          : 'text-[#939BB2] group-hover:text-white'
                      }`}
                    />

                    {/* Item Name */}
                    {!sidebarCollapsed && (
                      <span className={`truncate flex-1 ${isActive ? 'font-semibold text-white' : ''}`}>
                        {item.name}
                      </span>
                    )}

                    {/* Badge */}
                    {!sidebarCollapsed && item.badge && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet text-white shrink-0">
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed Tooltip on Hover/Focus */}
                    {sidebarCollapsed && hoveredItem === item.path && (
                      <div className="fixed left-20 ml-2 px-3 py-1.5 rounded-xl bg-[#121624] text-white text-xs whitespace-nowrap shadow-2xl border border-white/10 z-50 flex items-center gap-2 pointer-events-none">
                        <span className="font-semibold">{item.name}</span>
                        {item.badge && (
                          <span className="text-[9px] font-mono font-bold px-1 rounded bg-neon-cyan/20 text-neon-cyan">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Account / Role Footer */}
        <div className="p-3 border-t border-white/5 bg-[#08090F] shrink-0">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title={`${profile.name} • ${profile.role}`}
          >
            <div className="relative shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-neon-violet to-neon-cyan p-[2px]">
              <div className="w-full h-full rounded-full bg-[#121624] flex items-center justify-center text-xs font-bold text-white uppercase font-mono">
                {profile.name?.slice(0, 2) || 'PA'}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-neon-mint ring-2 ring-[#08090F]" />
            </div>

            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate">
                  {profile.name}
                </span>
                <span className="text-[10px] text-[#939BB2] truncate font-mono">
                  {profile.role}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
