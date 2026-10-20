// Client-side API Service for FINORA Single-Company Access & Security
const TOKEN_KEY = 'finora_auth_token_v3';

export const apiService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  setToken(token, remember = true) {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(endpoint, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // If 401 Unauthorized, token is expired or invalid
        if (response.status === 401 && endpoint !== '/api/auth/login') {
          this.clearToken();
          window.dispatchEvent(new CustomEvent('finora_auth_unauthorized'));
        }
        const error = new Error(data.error || 'API Request failed');
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.status) throw err;
      // Network or offline error
      const netErr = new Error('Unable to connect to FINORA security server. Please check your network.');
      netErr.status = 503;
      throw netErr;
    }
  },

  // Authentication
  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token, true);
    }
    return data;
  },

  async getMe() {
    return this.request('/api/auth/me', { method: 'GET' });
  },

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore network errors on logout
    } finally {
      this.clearToken();
    }
  },

  async forgotPassword(email) {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Company Profile
  async getCompany() {
    return this.request('/api/company', { method: 'GET' });
  },

  // Security Audit Logs
  async getAuditLogs() {
    return this.request('/api/audit-logs', { method: 'GET' });
  },

  async recordAudit(action, details) {
    return this.request('/api/audit-logs', {
      method: 'POST',
      body: JSON.stringify({ action, details }),
    });
  },

  // User Management
  async getUsers() {
    return this.request('/api/users', { method: 'GET' });
  },

  async createUser(userData) {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Payroll Permission Barrier Check
  async checkPayrollPermission() {
    return this.request('/api/payroll/permissions-check', { method: 'GET' });
  },
};
