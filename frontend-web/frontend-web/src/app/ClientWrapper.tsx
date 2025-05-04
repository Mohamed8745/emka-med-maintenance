"use client";

import { ReactNode, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import ThemeInitializer from "./components/ThemeInitializer";
import i18n from "../i18n";
import { LanguageProvider } from "./context/LanguageContext";

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  useEffect(() => {
    i18n.init();
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeInitializer />
        {children}
      </LanguageProvider>
    </AuthProvider>
  );
}