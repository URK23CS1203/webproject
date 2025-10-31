import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- 1. ADD THEME STATE ---
  // It gets the saved theme from localStorage, or defaults to 'light'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const navigate = useNavigate();

  // --- 2. ADD EFFECT TO APPLY THEME ---
  // This runs when the 'theme' state changes
  useEffect(() => {
    // Set the attribute on the main <html> tag
    document.documentElement.setAttribute('data-bs-theme', theme);
    // Save the choice in localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // --- 3. ADD THEME TOGGLE FUNCTION ---
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['x-auth-token'] = token;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['x-auth-token'];
    navigate('/login');
  };

  // --- 4. ADD THEME CONTROLS TO THE VALUE ---
  const authContextValue = {
    user,
    loading,
    login,
    logout,
    theme,       // <-- Add this
    toggleTheme, // <-- Add this
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };