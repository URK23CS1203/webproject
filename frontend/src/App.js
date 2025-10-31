import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ClientPage from './pages/ClientPage';
import TaskPage from './pages/TaskPage';
import AuditLogPage from './pages/AuditLogPage';
import MyTasksPage from './pages/MyTasksPage';
import MyDocumentsPage from './pages/MyDocumentsPage';
import AdminTasksPage from './pages/AdminTasksPage'; // <-- 1. IMPORT
import AppNavbar from './components/AppNavbar';

// Import Auth & Routing
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router> {/* <-- Make sure Router is on the outside */}
      <AuthProvider>
        <AppNavbar />
        <Container className="mt-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Private Routes Below */}
            <Route path="/" element={
              <PrivateRoute> <DashboardPage /> </PrivateRoute>
            } />
            
            {/* Admin / Auditor Routes */}
            <Route path="/clients" element={
              <PrivateRoute roles={['admin-ca', 'auditor']}> <ClientPage /> </PrivateRoute>
            } />
            <Route path="/tasks/:clientId" element={
               <PrivateRoute roles={['admin-ca', 'auditor']}> <TaskPage /> </PrivateRoute>
            } />
             <Route path="/audit-logs" element={
               <PrivateRoute roles={['admin-ca', 'auditor']}> <AuditLogPage /> </PrivateRoute>
            } />
            
            {/* --- 2. ADD THIS NEW ROUTE --- */}
            <Route path="/admin-tasks" element={
               <PrivateRoute roles={['admin-ca', 'auditor']}> <AdminTasksPage /> </PrivateRoute>
            } />

            {/* Client-specific Routes */}
            <Route path="/my-tasks" element={
               <PrivateRoute roles={['client']}> <MyTasksPage /> </PrivateRoute>
            } />
            <Route path="/my-documents" element={
               <PrivateRoute roles={['client']}> <MyDocumentsPage /> </PrivateRoute>
            } />
            
          </Routes>
        </Container>
      </AuthProvider>
    </Router>
  );
}

export default App;