"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import i18next from "i18next";

interface LanguageContextType {
  language: string;
  changeLanguage: (lng: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<string>("fr");

  // تحميل اللغة من ملف تعريف الارتباط عند التحميل الأولي
  useEffect(() => {
    const savedLang = document.cookie
      .split("; ")
      .find((row) => row.startsWith("i18next="))
      ?.split("=")[1];
    if (savedLang && ["en", "fr", "ar"].includes(savedLang)) {
      setLanguage(savedLang);
      i18next.changeLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lng: string) => {
    if (!["en", "fr", "ar"].includes(lng)) return;
    setLanguage(lng);
    i18next.changeLanguage(lng);
    // حفظ اللغة في ملف تعريف الارتباط
    document.cookie = `i18next=${lng}; path=/; max-age=31536000`;
    // إعادة تحميل الصفحة لتحديث Server Components
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}