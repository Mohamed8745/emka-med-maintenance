"use client";

import { useEffect } from "react";

const ThemeInitializer = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      if (savedTheme === "system") {
        document.documentElement.setAttribute("data-theme", mediaQuery.matches ? "dark" : "light");
      } else {
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    };

    applyTheme(); // نطبق الثيم أول مرة

    if (savedTheme === "system") {
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  

  // 🌐 Language
  const savedLang = localStorage.getItem("lang") || "fr";
  document.documentElement.setAttribute("lang", savedLang);
}, []);

  return null;
};

export default ThemeInitializer;
