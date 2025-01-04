import React, { createContext, useContext, useState, ReactNode } from 'react';
import AuthService from '../services/AuthService';

interface AuthContextType {
  isLoggedIn: boolean;
  isLibrarian: boolean;
  login: (username: string, password: string ) => Promise<any>;
  logout: () => void;
  register: (userData: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(AuthService.isLoggedIn());
  const [isLibrarian, setIsLibrarian] = useState(AuthService.isLibrarian());

  const login = async (username: string, password: string ) => {
    const response = await AuthService.login({"username": username, "password": password});
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('is_librarian', response.data.is_librarian);
      setIsLoggedIn(true);
      setIsLibrarian(response.data.is_librarian);
    }
    return response;
  };

  const logout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setIsLibrarian(false);
  };

  const register = async (userData: any) => {
    return await AuthService.register(userData);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLibrarian, login, logout, register }}>
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
