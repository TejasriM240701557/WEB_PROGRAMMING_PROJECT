import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Investments } from './pages/Investments';
import { ProfitLoss } from './pages/ProfitLoss';
import { Budgets } from './pages/Budgets';
import { Payroll } from './pages/Payroll';
import { Forecasts } from './pages/Forecasts';
import { FinancialAdvisor } from './pages/FinancialAdvisor';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Company Authentication Gateway */}
            <Route path="/login" element={<Login />} />

            {/* Authenticated Internal Company Platform */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="investments" element={<Investments />} />
              <Route path="profit-loss" element={<ProfitLoss />} />
              <Route path="budgets" element={<Budgets />} />
              <Route path="payroll" element={<Payroll />} />
              <Route path="forecasts" element={<Forecasts />} />
              <Route path="advisor" element={<FinancialAdvisor />} />
              <Route path="settings" element={<Settings />} />

              {/* Legacy route redirects */}
              <Route path="analytics" element={<Navigate to="/forecasts" replace />} />
              <Route path="goals" element={<Navigate to="/investments" replace />} />

              {/* Wildcard redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FinanceProvider>
    </AuthProvider>
  );
}
