import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './components/theme-provider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import HomePage from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import RegisterSuccessPage from './pages/register-success';
import DashboardPage from './pages/wali-siswa/dashboard';
import DocumentsPage from './pages/wali-siswa/documents';
import AnnouncementPage from './pages/wali-siswa/announcement';
import StudentRegistrationPage from './pages/student-registration';

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

// Super Admin Pages
import SuperAdminDashboard from './pages/super-admin/dashboard';
import SuperAdminAdmins from './pages/super-admin/admins';
import SuperAdminActivityLogs from './pages/super-admin/activity-logs';
import SuperAdminProgramManagement from './pages/super-admin/program-management';

function App() {
  return (
    <ErrorBoundary>
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
                <ProtectedRoute allowedRoles={['orang_tua']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard/documents" element={<DocumentsPage />} />
            <Route path="/dashboard/announcement" element={<AnnouncementPage />} />
            <Route
              path="/student-registration"
              element={
                <ProtectedRoute allowedRoles={['orang_tua']}>
                  <StudentRegistrationPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin_tu']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/manage-registrations" element={<AdminRegistrations />} />
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
                <ProtectedRoute allowedRoles={['kepala_sekolah']}>
                  <HeadmasterDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/headmaster/students" element={<HeadmasterStudents />} />

            {/* Super Admin Routes */}
            <Route
              path="/super-admin/*"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/super-admin/admins" element={<SuperAdminAdmins />} />
            <Route path="/super-admin/activity-logs" element={<SuperAdminActivityLogs />} />
            <Route path="/super-admin/program-management" element={<SuperAdminProgramManagement />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;