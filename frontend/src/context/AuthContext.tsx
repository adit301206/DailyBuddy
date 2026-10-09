import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthContextType, AuthUser, LoginCredentials } from '../types/auth';
import {
  getMe,
  getStoredToken,
  loginOwner,
  logoutOwner,
  setOnUnauthorizedCallback,
  setStoredToken,
} from '../lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize 401 callback with React state
  useEffect(() => {
    setOnUnauthorizedCallback(() => {
      setToken(null);
      setUser(null);
    });

    return () => {
      setOnUnauthorizedCallback(null);
    };
  }, []);

  // On initial mount, verify stored token validity with the backend
  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      const stored = getStoredToken();
      if (!stored) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const userInfo = await getMe();
        if (isMounted) {
          setUser(userInfo);
          setToken(stored);
        }
      } catch {
        // Token was invalid or revoked
        if (isMounted) {
          setStoredToken(null);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await loginOwner(credentials);
    setToken(response.token);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await logoutOwner();
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
