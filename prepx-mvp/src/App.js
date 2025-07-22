import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import EnhancedDashboard from './components/dashboard/EnhancedDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import Settings from './components/settings/Settings';
import MockTest from './components/test/MockTest';
import WritingPractice from './components/writing/WritingPractice';
import SpeakingPractice from './components/speaking/SpeakingPractice';
import PremiumPlans from './components/premium/PremiumPlans';
import LearningResources from './components/resources/LearningResources';

import './App.css';
import './styles/theme.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to appropriate dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return children;
  
  // Redirect admin users to admin panel, regular users to dashboard
  return currentUser.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
};

// Admin Route Component (only for admin users)
const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  return currentUser.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

// Dashboard Router Component (redirects admin users to admin panel)
const DashboardRouter = () => {
  const { currentUser } = useAuth();
  return currentUser?.role === 'admin' ? <Navigate to="/admin" /> : <EnhancedDashboard />;
};

// Default Redirect Component (handles initial routing)
const DefaultRedirect = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  return currentUser.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/test" element={
                <ProtectedRoute>
                  <MockTest />
                </ProtectedRoute>
              } />
              <Route path="/writing" element={
                <ProtectedRoute>
                  <WritingPractice />
                </ProtectedRoute>
              } />
              <Route path="/speaking" element={
                <ProtectedRoute>
                  <SpeakingPractice />
                </ProtectedRoute>
              } />
              <Route path="/premium" element={
                <ProtectedRoute>
                  <PremiumPlans />
                </ProtectedRoute>
              } />
              <Route path="/writing/task1" element={
                <ProtectedRoute>
                  <WritingPractice />
                </ProtectedRoute>
              } />
              <Route path="/writing/task2" element={
                <ProtectedRoute>
                  <WritingPractice />
                </ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute>
                  <LearningResources />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />

              {/* Default redirect */}
              <Route path="/" element={<DefaultRedirect />} />
              <Route path="*" element={<DefaultRedirect />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
