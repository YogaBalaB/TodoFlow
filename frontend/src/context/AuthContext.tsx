import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api from '../services/api';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '../utils/storage';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const storedToken = await getItem(STORAGE_KEYS.token);
        const storedUser = await getItem(STORAGE_KEYS.user);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
        }
      } catch (err) {
        console.error('Error loading stored credentials:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredToken();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: userToken, email: userEmail, _id } = response.data;
      const userData = { id: _id, email: userEmail };

      await setItem(STORAGE_KEYS.token, userToken);
      await setItem(STORAGE_KEYS.user, JSON.stringify(userData));

      api.defaults.headers.common.Authorization = `Bearer ${userToken}`;
      setToken(userToken);
      setUser(userData);
    } catch (err: any) {
      let msg = 'Login failed. Please check credentials.';

      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          msg = err.response.data.message;
        } else if (err.request) {
          msg = 'Unable to reach the backend service. Please verify the server is running.';
        }
      } else if (err.message) {
        msg = err.message;
      }

      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', { email, password });
      const { token: userToken, email: userEmail, _id } = response.data;
      const userData = { id: _id, email: userEmail };

      await setItem(STORAGE_KEYS.token, userToken);
      await setItem(STORAGE_KEYS.user, JSON.stringify(userData));

      api.defaults.headers.common.Authorization = `Bearer ${userToken}`;
      setToken(userToken);
      setUser(userData);
    } catch (err: any) {
      let msg = 'Registration failed. Try again.';

      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          msg = err.response.data.message;
        } else if (err.request) {
          msg = 'Unable to reach the backend service. Please verify the server is running.';
        }
      } else if (err.message) {
        msg = err.message;
      }

      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await removeItem(STORAGE_KEYS.token);
      await removeItem(STORAGE_KEYS.user);
      delete api.defaults.headers.common.Authorization;
      setToken(null);
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Error deleting credentials during logout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
