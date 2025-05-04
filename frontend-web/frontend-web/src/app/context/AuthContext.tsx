"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUser, login as loginService, logout as logoutService } from "../services/authService";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  numidentif: string;
  numtel: string;
  image: string | null;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(false); // تتبع حالة تسجيل الخروج

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await loginService(email, password);
      const userData = await getUser();
      setUser(userData);
      setIsLoggedOut(false); // إعادة تعيين حالة تسجيل الخروج
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutService();
      setUser(null);
      setIsLoggedOut(true); // تعيين حالة تسجيل الخروج
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedOut) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoggedOut]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};