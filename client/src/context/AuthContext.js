import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('devflow_token'));
  const [loading, setLoading] = useState(true);

  // Check user session on app initial load
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data.data.user);
        } catch (error) {
          console.error('Session restoration failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token: userToken, user: userData } = res.data.data;

    localStorage.setItem('devflow_token', userToken);
    localStorage.setItem('devflow_user', JSON.stringify(userData));

    setToken(userToken);
    setUser(userData);
    return res.data;
  };

  // Register handler
  const register = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    const { token: userToken, user: userData } = res.data.data;

    localStorage.setItem('devflow_token', userToken);
    localStorage.setItem('devflow_user', JSON.stringify(userData));

    setToken(userToken);
    setUser(userData);
    return res.data;
  };

  // Google Login handler
  const googleLogin = async (googleCredentialToken) => {
    const res = await API.post('/auth/google', { token: googleCredentialToken });
    const { token: userToken, user: userData } = res.data.data;

    localStorage.setItem('devflow_token', userToken);
    localStorage.setItem('devflow_user', JSON.stringify(userData));

    setToken(userToken);
    setUser(userData);
    return res.data;
  };


  // Logout handler
  const logout = () => {
    localStorage.removeItem('devflow_token');
    localStorage.removeItem('devflow_user');
    setToken(null);
    setUser(null);
  };

  // Update profile in state
  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('devflow_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateUserProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
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
