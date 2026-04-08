import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && token !== 'OTP_REQUIRED') {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        setUser({ id: payload.jti, sub: payload.sub, roles: payload.roles });
      } catch (e) {
        console.error('Token decoding error, clearing stale token:', e);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authApi.post('/login', { email, password });
      
      if (response.data.token === 'OTP_REQUIRED') {
        return { success: true, otpRequired: true };
      }
      
      const jwtToken = response.data.token;
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      return { success: true, role: response.data.role };
    } catch (error) {
      console.error('Login Failed', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const verifyLoginOtp = async (email, code) => {
    try {
      const response = await authApi.post('/verify-login-otp', { email, code });
      const jwtToken = response.data.token;
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      return { success: true, role: response.data.role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'OTP Verification failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      await authApi.post('/register', { username, email, password });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const verifyRegistration = async (email, code) => {
    try {
      await authApi.post('/verify-registration', { email, code });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Verification failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, verifyLoginOtp, verifyRegistration }}>
      {children}
    </AuthContext.Provider>
  );
};
