import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (token in localStorage)
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user profile
      apiService.getProfile()
        .then(response => {
          if (response.success) {
            setCurrentUser(response.data);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
          }
        })
        .catch(error => {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      
      if (response.success) {
        setCurrentUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await apiService.register(name, email, password);
      
      if (response.success) {
        setCurrentUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
    }
  };

  const updateUserTestProgress = async () => {
    if (currentUser) {
      try {
        // Refresh user profile from server to get updated stats
        const response = await apiService.getProfile();
        if (response.success) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error('Failed to update user progress:', error);
      }
    }
  };

  const addWritingSubmission = async (submission) => {
    if (currentUser) {
      try {
        // Refresh user profile from server to get updated stats
        const response = await apiService.getProfile();
        if (response.success) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error('Failed to update writing submission:', error);
      }
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUserTestProgress,
    addWritingSubmission,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};