import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import {
  Search,
  Plus,
  Bell,
  Calendar,
  Check,
  CheckCheck,
  ChevronDown,
  Building2,
  Eye,
  EyeOff,
  Sliders,
  LogOut,
  LayoutDashboard,
  Receipt,
  TrendingUp,
  FileSpreadsheet,
  PieChart,
  Users,
  LineChart,
  BrainCircuit,
  Settings,
  Wifi,
  X,
  Menu,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';

// Navigation items matching Zentra layout (horizontal tabs)
const NAV_ITEMS = [
  { name: 'Home', path: '/', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: Receipt },
  { name: 'Balances', path: '/profit-loss', icon: FileSpreadsheet },
  { name: 'Investments', path: '/investments', icon: TrendingUp },
  { name: 'Budgets', path: '/budgets', icon: PieChart },
  { name: 'Payroll', path: '/payroll', icon: Users },
  { name: 'Forecasts', path: '/forecasts', icon: LineChart },
  { name: 'AI Advisor', path: '/advisor', icon: BrainCircuit },
  { name: 'Settings', path: '/settings', icon: Settings },
];

import { NexusCapLogo } from '../ui/NexusCapLogo';

export const TopNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, permissions, company, logout } = useAuth();

  const {
    openComposer,
    openCommandPalette,
    activePeriod,
    setActivePeriod,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    clearAllNotifications,
    profile,
    toggleHideBalance,
  } = useFinance();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileMenuOpen(false);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsNotifOpen(false);
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // User initials
  const initials = (user?.name || 'PA').slice(0, 2).toUpperCase();

  return (
    <>
      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-[0_1px_0_#E5E7EB]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-6">

            {/* Logo */}
            <div className="flex-shrink-0">
              <NexusCapLogo />
            </div>

            {/* Horizontal Nav Tabs — Desktop */}
            <nav
              className="hidden lg:flex items-center gap-0.5 flex-1"
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive: active }) =>
                      `relative px-3.5 py-1.5 rounded-lg text-[13.5px] font-medium transition-all duration-150 whitespace-nowrap ${
                        active
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2 ml-auto">

              {/* Search trigger */}
              <button
                onClick={openCommandPalette}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 text-[13px] text-gray-500 hover:text-gray-700 transition-all group"
                title="Search (Ctrl+K)"
              >
                <Search size={14} className="text-gray-400" />
                <span className="hidden lg:inline">Search...</span>
                <kbd className="hidden lg:inline text-[11px] font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-400">
                  ⌘K
                </kbd>
              </button>

              {/* Privacy toggle */}
              <button
                onClick={toggleHideBalance}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                title={profile.hideBalance ? 'Show balances' : 'Hide balances'}
                aria-label="Toggle balance visibility"
              >
                {profile.hideBalance
                  ? <EyeOff size={16} className="text-indigo-500" />
                  : <Eye size={16} />}
              </button>

              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  aria-expanded={isNotifOpen}
                  className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={16} />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-1.5 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] overflow-hidden z-50 animate-fadeIn">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13px] font-semibold text-gray-900">Notifications</h4>
                        {unreadNotificationCount > 0 && (
                          <span className="text-[11px] bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full font-medium">
                            {unreadNotificationCount}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={clearAllNotifications}
                        className="text-[12px] text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
                      >
                        <CheckCheck size={13} />
                        Mark all read
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-[13px] text-gray-400">
                          No pending notifications
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-start gap-3 transition-colors ${
                              !n.read ? 'bg-indigo-50/40' : ''
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 mt-2 rounded-full flex-shrink-0 ${
                                !n.read ? 'bg-indigo-500' : 'bg-transparent'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[13px] font-medium text-gray-900 truncate">{n.title}</p>
                                <span className="text-[11px] text-gray-400 flex-shrink-0">{n.time}</span>
                              </div>
                              <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Profile Menu */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 text-[13px] text-gray-700 transition-all"
                  title="Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white">
                    {initials}
                  </div>
                  <span className="hidden md:block font-medium">{user?.name || 'Admin'}</span>
                  <ChevronDown size={12} className="text-gray-400 hidden md:block" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-2 z-50 animate-fadeIn">
                    {/* User identity */}
                    <div className="px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100 mb-2">
                      <p className="text-[13px] font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                      <p className="text-[12px] text-gray-500">{user?.email || 'admin@nexuscapfin.com'}</p>
                      <span className="inline-flex mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-700">
                        {permissions?.roleName || 'Administrator'}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-400 px-3 pb-1.5 border-b border-gray-100 mb-1">
                      {company?.name || 'NexusCap Corp'}
                    </div>

                    <button
                      onClick={() => { setIsProfileMenuOpen(false); navigate('/settings'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <Sliders size={14} className="text-gray-400" />
                      Settings
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-medium"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>

              {/* Add Transaction CTA */}
              {!permissions?.isReadOnly && (
                <button
                  onClick={() => openComposer('operating_expense')}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  Add
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-sm z-30 animate-fadeIn">
          <div className="max-w-[1440px] mx-auto px-4 py-3 space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
