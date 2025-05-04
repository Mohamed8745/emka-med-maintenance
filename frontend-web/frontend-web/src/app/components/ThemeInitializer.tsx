"use client";

import { useEffect } from "react";

const ThemeInitializer = () => {
  useEffect(() => {
    // تهيئة اللغة
    if (!localStorage.getItem("lang")) {
      const systemLang = navigator.language.split('-')[0];
      const supportedLangs = ["ar", "fr", "en"];
      const defaultLang = supportedLangs.includes(systemLang) ? systemLang : "fr";
      localStorage.setItem("lang", defaultLang);
      document.documentElement.setAttribute("lang", defaultLang);
      document.documentElement.setAttribute("dir", defaultLang === "ar" ? "rtl" : "ltr");
    } else {
      const savedLang = localStorage.getItem("lang") || "fr";
      document.documentElement.setAttribute("lang", savedLang);
      document.documentElement.setAttribute("dir", savedLang === "ar" ? "rtl" : "ltr");
    }

    // تهيئة الثيم
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "system");
    }
  }, []);

  return null;
};

export default ThemeInitializer;