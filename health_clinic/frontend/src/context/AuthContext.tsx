import React, { createContext, useContext, useState, ReactNode } from 'react';
import AuthService from '../services/AuthService';

interface AuthContextType {
  isLoggedIn: boolean;
  isPatient: boolean;
  login: (username: string, password: string ) => Promise<any>;
  logout: () => void;
  register: (userData: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(AuthService.isLoggedIn());
  const [isPatient, setIsPatient] = useState(AuthService.isPatient());

  const login = async (username: string, password: string ) => {
    const response = await AuthService.login({"username": username, "password": password});
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('is_patient', response.data.is_patient);
      setIsLoggedIn(true);
      setIsPatient(response.data.is_patient);
    }
    return response;
  };

  const logout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setIsPatient(false);
  };

  const register = async (userData: any) => {
    return await AuthService.register(userData);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isPatient, login, logout, register }}>
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
