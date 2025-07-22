import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import EnhancedDashboard from './components/dashboard/EnhancedDashboard';
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

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
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
                <EnhancedDashboard />
              </ProtectedRoute>
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

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
