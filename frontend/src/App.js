import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './components/theme-provider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import RegisterSuccessPage from './pages/register-success';
import DashboardPage from './pages/dashboard';
import DocumentsPage from './pages/documents';
import ProfilePage from './pages/profile';
import SettingsPage from './pages/settings';
import AnnouncementPage from './pages/announcement';

// Admin Pages
import AdminDashboard from './pages/admin/dashboard';
import AdminRegistrations from './pages/admin/manage-registrations';
import AdminDocuments from './pages/admin/documents';
import AdminStudents from './pages/admin/students';
import AdminReports from './pages/admin/reports';
import AdminPeriod from './pages/admin/period';
import AdminQuota from './pages/admin/quota';
import ParentAccounts from './pages/admin/parent-accounts';

// Headmaster Pages
import HeadmasterDashboard from './pages/headmaster/dashboard';
import HeadmasterStudents from './pages/headmaster/students';
import HeadmasterTeachers from './pages/headmaster/teachers';
import HeadmasterReports from './pages/headmaster/reports';
import HeadmasterSettings from './pages/headmaster/settings';

// Super Admin Pages
import SuperAdminDashboard from './pages/super-admin/dashboard';
import SuperAdminAdmins from './pages/super-admin/admins';
import SuperAdminActivityLogs from './pages/super-admin/activity-logs';
import SuperAdminProgramManagement from './pages/super-admin/program-management';
import SuperAdminSettings from './pages/super-admin/settings';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="madrasah-theme">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/success" element={<RegisterSuccessPage />} />

          {/* Wali Siswa Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute allowedRoles={['wali']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard/documents" element={<DocumentsPage />} />
          <Route path="/dashboard/announcement" element={<AnnouncementPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/registrations" element={<AdminRegistrations />} />
          <Route path="/admin/documents" element={<AdminDocuments />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/period" element={<AdminPeriod />} />
          <Route path="/admin/quota" element={<AdminQuota />} />
          <Route path="/admin/parent-accounts" element={<ParentAccounts />} />

          {/* Headmaster Routes */}
          <Route
            path="/headmaster/*"
            element={
              <ProtectedRoute allowedRoles={['headmaster']}>
                <HeadmasterDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/headmaster/students" element={<HeadmasterStudents />} />
          <Route path="/headmaster/teachers" element={<HeadmasterTeachers />} />
          <Route path="/headmaster/reports" element={<HeadmasterReports />} />
          <Route path="/headmaster/settings" element={<HeadmasterSettings />} />

          {/* Super Admin Routes */}
          <Route
            path="/super-admin/*"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/super-admin/admins" element={<SuperAdminAdmins />} />
          <Route path="/super-admin/activity-logs" element={<SuperAdminActivityLogs />} />
          <Route path="/super-admin/program-management" element={<SuperAdminProgramManagement />} />
          <Route path="/super-admin/settings" element={<SuperAdminSettings />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;