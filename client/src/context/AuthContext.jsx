import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('qa_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('qa_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('qa_admin_token');
      if (!storedToken) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/admin/me');
        if (res.data.success) {
          setAdmin(res.data.admin);
          localStorage.setItem('qa_admin_user', JSON.stringify(res.data.admin));
        }
      } catch (err) {
        console.error('Session verification failed:', err.message);
        localStorage.removeItem('qa_admin_token');
        localStorage.removeItem('qa_admin_user');
        setAdmin(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/admin/login', { email, password });
    if (res.data.success) {
      const { token: receivedToken, admin: adminData } = res.data;
      localStorage.setItem('qa_admin_token', receivedToken);
      localStorage.setItem('qa_admin_user', JSON.stringify(adminData));
      setToken(receivedToken);
      setAdmin(adminData);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('qa_admin_token');
    localStorage.removeItem('qa_admin_user');
    setAdmin(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

