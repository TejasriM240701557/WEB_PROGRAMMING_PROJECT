import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize session verification
  const verifySession = useCallback(async () => {
    const token = apiService.getToken();
    if (!token) {
      setUser(null);
      setCompany(null);
      setPermissions(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiService.getMe();
      setUser(data.user);
      setCompany(data.company);
      setPermissions(data.permissions);
      setAuthError(null);
    } catch {
      apiService.clearToken();
      setUser(null);
      setCompany(null);
      setPermissions(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();

    // Listen for unauthorized 401 events from apiService
    const handleUnauthorized = () => {
      setUser(null);
      setCompany(null);
      setPermissions(null);
    };

    window.addEventListener('finora_auth_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('finora_auth_unauthorized', handleUnauthorized);
  }, [verifySession]);

  // Login handler
  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const data = await apiService.login(email, password);
      setUser(data.user);
      setCompany(data.company);
      setPermissions(data.permissions);
      setIsLoading(false);
      return { success: true, user: data.user };
    } catch (err) {
      setIsLoading(false);
      const message = err.message || 'Invalid work email or password. Please verify credentials with your IT administrator.';
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  // Logout handler
  const logout = async () => {
    setIsLoading(true);
    await apiService.logout();
    setUser(null);
    setCompany(null);
    setPermissions(null);
    setIsLoading(false);
  };

  // Forgot Password handler
  const forgotPassword = async (email) => {
    return apiService.forgotPassword(email);
  };

  const value = {
    user,
    company,
    permissions,
    isAuthenticated: Boolean(user),
    isLoading,
    authError,
    setAuthError,
    login,
    logout,
    forgotPassword,
    refreshSession: verifySession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
