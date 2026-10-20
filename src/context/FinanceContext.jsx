import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { storageService } from '../services/storageService';
import {
  calculateCorporateMetrics,
  generateCashFlowForecast,
  simulateSalaryAffordability,
  evaluateInvestmentOpportunity,
  generateAIAdvisorResponse,
} from '../utils/calculations';
import { useAuth } from './AuthContext';
import { apiService } from '../services/apiService';
import { CORPORATE_ACCOUNTS, SINGLE_COMPANY, COMPANIES } from '../utils/constants';

const FinanceContext = createContext(null);

export const FinanceProvider = ({ children }) => {
  const auth = useAuth();
  const user = auth?.user;
  const permissions = auth?.permissions;
  const authCompany = auth?.company;

  // Ensure default data is seeded
  useEffect(() => {
    storageService.initializeDefaults();
  }, []);

  const [companies, setCompanies] = useState(() => storageService.getCompanies());
  const [transactions, setTransactions] = useState(() => storageService.getTransactions());
  const [investments, setInvestments] = useState(() => storageService.getInvestments());
  const [opportunities, setOpportunities] = useState(() => storageService.getOpportunities());
  const [employees, setEmployees] = useState(() => storageService.getEmployees());
  const [budgets, setBudgets] = useState(() => storageService.getBudgets());
  const [profile, setProfile] = useState(() => storageService.getProfile());
  const [notifications, setNotifications] = useState(() => storageService.getNotifications());
  const [accounts, setAccounts] = useState(CORPORATE_ACCOUNTS);

  // Synchronize profile with authenticated company user
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name,
        role: user.designation || user.role,
        email: user.email,
        handle: `@${user.name.toLowerCase().replace(/\s+/g, '_')}`,
      }));
    }
  }, [user]);

  // Single Predefined Company Scope
  const activeCompany = authCompany || SINGLE_COMPANY;
  const activeCompanyId = 'comp-1';

  // UI state
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerInitialType, setComposerInitialType] = useState('operating_expense');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [activePeriod, setActivePeriod] = useState('current_month'); // 'current_month' | 'q3_fy26' | 'fy26'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('finora_sidebar_collapsed') === 'true';
  });
  const [toasts, setToasts] = useState([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openCommandPalette = () => setIsCommandPaletteOpen(true);
  const closeCommandPalette = () => setIsCommandPaletteOpen(false);
  const toggleCommandPalette = () => setIsCommandPaletteOpen((prev) => !prev);

  // Toast Notification Manager
  const showToast = (title, message = '', type = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    const newToast = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('finora_sidebar_collapsed', String(next));
      return next;
    });
  };

  const toggleHideBalance = () => {
    setProfile((prev) => {
      const updated = { ...prev, hideBalance: !prev.hideBalance };
      storageService.saveProfile(updated);
      return updated;
    });
  };

  const updateProfile = (newProfileData) => {
    setProfile((prev) => {
      const updated = { ...prev, ...newProfileData };
      storageService.saveProfile(updated);
      showToast('Settings Updated', 'Company preferences and thresholds updated.', 'success');
      return updated;
    });
  };

  const switchCompany = () => {
    // Single company architecture: only Apex Technologies is active
  };

  // Scoped transactions for active company
  const companyTransactions = useMemo(() => {
    return transactions.filter(t => !t.companyId || t.companyId === activeCompanyId);
  }, [transactions, activeCompanyId]);

  // Scoped investments for active company
  const companyInvestments = useMemo(() => {
    return investments.filter(i => !i.companyId || i.companyId === activeCompanyId);
  }, [investments, activeCompanyId]);

  // Authoritative Financial Calculations
  const metrics = useMemo(() => {
    return calculateCorporateMetrics(companyTransactions, companyInvestments, accounts, profile);
  }, [companyTransactions, companyInvestments, accounts, profile]);

  // Cash flow forecast projections (6 months)
  const cashFlowForecast = useMemo(() => {
    return generateCashFlowForecast(metrics, 6);
  }, [metrics]);

  // Transaction Operations
  const addTransaction = (txData) => {
    const newTx = {
      ...txData,
      id: `tx-${Date.now()}`,
      companyId: activeCompanyId,
      amount: Number(txData.amount) || 0,
      date: txData.date || new Date().toISOString(),
      status: 'completed',
    };

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    storageService.saveTransactions(updated);

    showToast(
      newTx.type === 'revenue' ? 'Revenue Recorded' : 'Corporate Outlay Saved',
      `₹${(newTx.amount / 100000).toFixed(2)}L booked under ${newTx.title}`,
      newTx.type === 'revenue' ? 'success' : 'info'
    );
    return newTx;
  };

  const updateTransaction = (id, updatedData) => {
    const updated = transactions.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          ...updatedData,
          amount: Number(updatedData.amount) || t.amount,
        };
      }
      return t;
    });

    setTransactions(updated);
    storageService.saveTransactions(updated);
    showToast('Transaction Modified', 'Financial statement updated and recalculated.', 'success');
  };

  const deleteTransaction = (id) => {
    const target = transactions.find((t) => t.id === id);
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    storageService.saveTransactions(updated);

    showToast(
      'Transaction Removed',
      target ? `"${target.title}" removed from corporate ledger.` : 'Record deleted.',
      'warning'
    );
  };

  // Investment Operations
  const addInvestment = (invData) => {
    const newInv = {
      ...invData,
      id: `inv-${Date.now()}`,
      companyId: activeCompanyId,
      investedAmount: Number(invData.investedAmount) || 0,
      currentValue: Number(invData.currentValue) || Number(invData.investedAmount) || 0,
      realizedReturns: Number(invData.realizedReturns) || 0,
      unrealizedGains: (Number(invData.currentValue) || 0) - (Number(invData.investedAmount) || 0),
      status: 'Active',
    };
    const updated = [...investments, newInv];
    setInvestments(updated);
    storageService.saveInvestments(updated);
    showToast('Investment Added', `"${newInv.name}" added to treasury portfolio.`, 'success');
    return newInv;
  };

  const updateInvestment = (id, updatedData) => {
    const updated = investments.map(inv => {
      if (inv.id === id) {
        const investedAmount = Number(updatedData.investedAmount) || inv.investedAmount;
        const currentValue = Number(updatedData.currentValue) || inv.currentValue;
        return {
          ...inv,
          ...updatedData,
          investedAmount,
          currentValue,
          unrealizedGains: currentValue - investedAmount,
        };
      }
      return inv;
    });
    setInvestments(updated);
    storageService.saveInvestments(updated);
    showToast('Investment Updated', 'Asset valuation synchronized.', 'success');
  };

  const deleteInvestment = (id) => {
    const target = investments.find(i => i.id === id);
    const updated = investments.filter(i => i.id !== id);
    setInvestments(updated);
    storageService.saveInvestments(updated);
    showToast('Investment Removed', target ? `"${target.name}" removed.` : 'Asset removed.', 'warning');
  };

  // Opportunity Operations
  const addOpportunity = (oppData) => {
    const newOpp = {
      ...oppData,
      id: `opp-${Date.now()}`,
      proposedAmount: Number(oppData.proposedAmount) || 0,
      expectedAnnualRevenue: Number(oppData.expectedAnnualRevenue) || 0,
      expectedAnnualCost: Number(oppData.expectedAnnualCost) || 0,
      status: 'Under Evaluation',
    };
    const updated = [newOpp, ...opportunities];
    setOpportunities(updated);
    storageService.saveOpportunities(updated);
    showToast('Proposal Submitted', `"${newOpp.name}" is now being modeled.`, 'success');
    return newOpp;
  };

  // Employee & Payroll Operations
  const addEmployee = (empData) => {
    const newEmp = {
      ...empData,
      id: `EMP-${Date.now().toString().slice(-3)}`,
      baseSalary: Number(empData.baseSalary) || 0,
      allowances: Number(empData.allowances) || 0,
      deductions: Number(empData.deductions) || 0,
      employerOverhead: Number(empData.employerOverhead) || Math.round((Number(empData.baseSalary) || 0) * 0.15),
      status: 'Active',
    };
    const updated = [...employees, newEmp];
    setEmployees(updated);
    storageService.saveEmployees(updated);
    showToast('Employee Added', `${newEmp.name} enrolled in payroll system.`, 'success');
    return newEmp;
  };

  const updateEmployee = (id, updatedData) => {
    const updated = employees.map(emp => {
      if (emp.id === id) {
        return {
          ...emp,
          ...updatedData,
          baseSalary: Number(updatedData.baseSalary) || emp.baseSalary,
        };
      }
      return emp;
    });
    setEmployees(updated);
    storageService.saveEmployees(updated);
    showToast('Payroll Profile Updated', 'Compensation and deductions updated.', 'success');
  };

  const deleteEmployee = (id) => {
    const target = employees.find(e => e.id === id);
    const updated = employees.filter(e => e.id !== id);
    setEmployees(updated);
    storageService.saveEmployees(updated);
    showToast('Employee Offboarded', target ? `${target.name} removed from roster.` : 'Employee removed.', 'warning');
  };

  // Budgets Operations
  const updateBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    storageService.saveBudgets(newBudgets);
    showToast('Department Budgets Saved', 'Spending caps and variance alerts updated.', 'success');
  };

  // Notification Operations
  const markNotificationRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    storageService.saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    storageService.saveNotifications(updated);
    showToast('Notifications Cleared', 'All alerts marked as read.', 'info');
  };

  // Reset to Demo Data
  const resetToDemoData = () => {
    storageService.resetDemoData();
    setCompanies(storageService.getCompanies());
    setTransactions(storageService.getTransactions());
    setInvestments(storageService.getInvestments());
    setOpportunities(storageService.getOpportunities());
    setEmployees(storageService.getEmployees());
    setBudgets(storageService.getBudgets());
    setProfile(storageService.getProfile());
    setNotifications(storageService.getNotifications());
    showToast('Corporate Reset Complete', 'Seeded enterprise dataset restored.', 'success');
  };

  // Composer Helpers
  const openComposer = (type = 'operating_expense', txToEdit = null) => {
    if (permissions?.isReadOnly || permissions?.canManageTransactions === false) {
      showToast('Permission Restricted', 'Your account has read-only authorization. Modifications are prohibited.', 'warning');
      return;
    }
    setComposerInitialType(type);
    setEditingTransaction(txToEdit);
    setIsComposerOpen(true);
  };

  const closeComposer = () => {
    setIsComposerOpen(false);
    setEditingTransaction(null);
  };

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const value = {
    companies,
    activeCompanyId,
    activeCompany,
    switchCompany,
    transactions: companyTransactions,
    allTransactions: transactions,
    investments: companyInvestments,
    opportunities,
    employees,
    budgets,
    accounts,
    profile,
    notifications,
    unreadNotificationCount,
    metrics,
    cashFlowForecast,
    toasts,
    removeToast,
    showToast,
    sidebarCollapsed,
    toggleSidebar,
    toggleHideBalance,
    updateProfile,
    isComposerOpen,
    composerInitialType,
    editingTransaction,
    openComposer,
    closeComposer,
    isCommandPaletteOpen,
    openCommandPalette,
    closeCommandPalette,
    toggleCommandPalette,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    addOpportunity,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    updateBudgets,
    markNotificationRead,
    clearAllNotifications,
    resetToDemoData,
    globalSearch,
    setGlobalSearch,
    activePeriod,
    setActivePeriod,
    exportJSON: () => storageService.exportJSON(),
    exportCSV: () => storageService.exportTransactionsCSV(),
    runSalarySimulation: (params) => simulateSalaryAffordability(metrics, employees, params),
    evaluateOpportunity: (opp) => evaluateInvestmentOpportunity(opp, metrics),
    askAIAdvisor: (query) => generateAIAdvisorResponse(query, metrics, companyTransactions, employees, companyInvestments),
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
