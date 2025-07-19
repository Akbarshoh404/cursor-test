import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';

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
    // Check if user is already logged in (stored in localStorage)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock authentication - in real app, this would be an API call
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true };
    } else {
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const register = async (name, email, password) => {
    // Mock registration - in real app, this would be an API call
    const existingUser = mockUsers.find(u => u.email === email);
    
    if (existingUser) {
      return { success: false, error: 'User already exists with this email' };
    }

    const newUser = {
      id: mockUsers.length + 1,
      name,
      email,
      password, // In real app, this would be hashed
      joinDate: new Date().toISOString().split('T')[0],
      lastTestDate: null,
      testsThisWeek: 0,
      writingHistory: []
    };

    mockUsers.push(newUser);
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUserTestProgress = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        testsThisWeek: currentUser.testsThisWeek + 1,
        lastTestDate: new Date().toISOString().split('T')[0]
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const addWritingSubmission = (submission) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        writingHistory: [...currentUser.writingHistory, submission]
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
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