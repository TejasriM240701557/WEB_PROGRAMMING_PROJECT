import {
  COMPANIES,
  INITIAL_TRANSACTIONS,
  INITIAL_INVESTMENTS,
  INITIAL_INVESTMENT_OPPORTUNITIES,
  INITIAL_EMPLOYEES,
  INITIAL_DEPARTMENT_BUDGETS,
  INITIAL_USER_PROFILE,
  INITIAL_CORPORATE_NOTIFICATIONS,
} from '../data/initialData';

const STORAGE_KEYS = {
  COMPANIES: 'finora_companies_corp_v2',
  TRANSACTIONS: 'finora_transactions_corp_v2',
  INVESTMENTS: 'finora_investments_corp_v2',
  OPPORTUNITIES: 'finora_opportunities_corp_v2',
  EMPLOYEES: 'finora_employees_corp_v2',
  BUDGETS: 'finora_budgets_corp_v2',
  PROFILE: 'finora_profile_corp_v2',
  NOTIFICATIONS: 'finora_notifications_corp_v2',
  INITIALIZED: 'finora_corp_initialized_flag_v2',
};

export const storageService = {
  initializeDefaults() {
    try {
      const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
      if (!isInit) {
        localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(COMPANIES));
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
        localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(INITIAL_INVESTMENTS));
        localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(INITIAL_INVESTMENT_OPPORTUNITIES));
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(INITIAL_DEPARTMENT_BUDGETS));
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_CORPORATE_NOTIFICATIONS));
        localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      }
    } catch (err) {
      console.warn('LocalStorage error during initialization:', err);
    }
  },

  resetDemoData() {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(COMPANIES));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(INITIAL_INVESTMENTS));
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(INITIAL_INVESTMENT_OPPORTUNITIES));
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(INITIAL_DEPARTMENT_BUDGETS));
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_CORPORATE_NOTIFICATIONS));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      return true;
    } catch (err) {
      console.error('Failed to reset corporate demo data:', err);
      return false;
    }
  },

  // Companies
  getCompanies() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPANIES);
      return data ? JSON.parse(data) : COMPANIES;
    } catch {
      return COMPANIES;
    }
  },

  // Transactions
  getTransactions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  },

  saveTransactions(transactions) {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (err) {
      console.error('Error saving transactions:', err);
    }
  },

  // Investments
  getInvestments() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
      return data ? JSON.parse(data) : INITIAL_INVESTMENTS;
    } catch {
      return INITIAL_INVESTMENTS;
    }
  },

  saveInvestments(investments) {
    try {
      localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(investments));
    } catch (err) {
      console.error('Error saving investments:', err);
    }
  },

  // Opportunities
  getOpportunities() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
      return data ? JSON.parse(data) : INITIAL_INVESTMENT_OPPORTUNITIES;
    } catch {
      return INITIAL_INVESTMENT_OPPORTUNITIES;
    }
  },

  saveOpportunities(opps) {
    try {
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
    } catch (err) {
      console.error('Error saving opportunities:', err);
    }
  },

  // Employees & Payroll
  getEmployees() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return data ? JSON.parse(data) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  },

  saveEmployees(employees) {
    try {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    } catch (err) {
      console.error('Error saving employees:', err);
    }
  },

  // Budgets
  getBudgets() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      return data ? JSON.parse(data) : INITIAL_DEPARTMENT_BUDGETS;
    } catch {
      return INITIAL_DEPARTMENT_BUDGETS;
    }
  },

  saveBudgets(budgets) {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (err) {
      console.error('Error saving budgets:', err);
    }
  },

  // Profile & Preferences
  getProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const parsed = data ? JSON.parse(data) : INITIAL_USER_PROFILE;
      return { ...INITIAL_USER_PROFILE, ...parsed };
    } catch {
      return INITIAL_USER_PROFILE;
    }
  },

  saveProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  },

  // Notifications
  getNotifications() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_CORPORATE_NOTIFICATIONS;
    } catch {
      return INITIAL_CORPORATE_NOTIFICATIONS;
    }
  },

  saveNotifications(notifs) {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    } catch (err) {
      console.error('Error saving notifications:', err);
    }
  },

  // Export complete JSON backup
  exportJSON() {
    const backup = {
      platform: 'NexusCapFIN Corporate Financial Intelligence',
      version: '2.0-Enterprise',
      exportedAt: new Date().toISOString(),
      companies: this.getCompanies(),
      transactions: this.getTransactions(),
      investments: this.getInvestments(),
      opportunities: this.getOpportunities(),
      employees: this.getEmployees(),
      budgets: this.getBudgets(),
      profile: this.getProfile(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NexusCapFIN_Corporate_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Export Transactions CSV
  exportTransactionsCSV() {
    const transactions = this.getTransactions();
    const headers = ['Transaction ID', 'Date', 'Type', 'Description', 'Amount (INR)', 'Category', 'Department', 'Counterparty', 'Account', 'Notes'];
    const rows = transactions.map(t => [
      t.id,
      t.date,
      t.type,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.amount,
      t.category,
      t.department || '',
      `"${(t.counterparty || '').replace(/"/g, '""')}"`,
      t.account || '',
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NexusCapFIN_Corporate_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
};
