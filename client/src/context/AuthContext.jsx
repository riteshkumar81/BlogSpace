import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('blogging_token');
    const storedUser = localStorage.getItem('blogging_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem('blogging_token');
        localStorage.removeItem('blogging_user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      // Assuming the response contains { success: true, token, data: { user } }
      if (response.success) {
        const { token, data } = response;
        setToken(token);
        setUser(data.user);
        setIsAuthenticated(true);
        // Store in localStorage
        localStorage.setItem('blogging_token', token);
        localStorage.setItem('blogging_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Unknown error' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, data } = response;
      if (response.success) {
        setToken(token);
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('blogging_token', token);
        localStorage.setItem('blogging_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Unknown error' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('blogging_token');
    localStorage.removeItem('blogging_user');
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};