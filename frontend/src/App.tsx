import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardLayout } from './components/DashboardLayout';
import { OverviewPage } from './pages/OverviewPage';
import { UploadPage } from './pages/UploadPage';
import { BillsPage } from './pages/BillsPage';
import { ComparePage } from './pages/ComparePage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { SavingsPage } from './pages/SavingsPage';
import { DisputesPage } from './pages/DisputesPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('urjamitra_token');
  return token ? <>{children}</> : <Navigate to="/login" />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <OverviewPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/upload"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <UploadPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/bills"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <BillsPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/compare"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ComparePage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/ai-insights"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <AIInsightsPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/savings"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <SavingsPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/disputes"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <DisputesPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/notifications"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <div className="p-6 bg-white rounded-xl border border-slate-200">
                  <h2 className="text-xl font-bold mb-2">Notification Center</h2>
                  <p className="text-sm text-slate-500">Alerts regarding upcoming bill due dates and slab changes.</p>
                </div>
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <div className="p-6 bg-white rounded-xl border border-slate-200">
                  <h2 className="text-xl font-bold mb-2">Account & Tariff Settings</h2>
                  <p className="text-sm text-slate-500">Configure your default DISCOM, state, and sanctioned load parameters.</p>
                </div>
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
