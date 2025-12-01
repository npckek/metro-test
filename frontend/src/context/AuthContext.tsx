import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';   
import { loginAdmin, logoutAdmin, checkAuthStatus } from '@/api/stations';
import type { TokenRequest } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: TokenRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [isInitializing, setIsInitializing] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      const authenticated = await checkAuthStatus();
      
      setIsAuthenticated(authenticated);
      setIsInitializing(false); 
      
      if (authenticated && window.location.pathname === '/login') {
         navigate('/admin/dashboard', { replace: true });
      }
    };

    checkStatus();
  }, [navigate]);


  const login = async (credentials: TokenRequest) => {
    try {
      await loginAdmin(credentials);
      setIsAuthenticated(true);
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      setIsAuthenticated(false);
      const msg = axios.isAxiosError(error) && error.response?.status === 401 
                  ? "Неверный email или пароль." 
                  : "Произошла ошибка при входе.";
      throw new Error(msg);
    }
  };

  const logout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  if (isInitializing) {
      return null; 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};