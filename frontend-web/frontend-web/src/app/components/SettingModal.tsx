"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/setting.module.css";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

interface SettingModalProps {
  onClose: () => void;
}

const SettingModal: React.FC<SettingModalProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();

  // حالة تحديد موقع المودال
  const [pos, setPos] = useState({ x: 200, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // حالة الثيم واللغة
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");
  const [language, setLanguage] = useState(() => localStorage.getItem("lang") || "fr");

  // التعامل مع السحب (Dragging)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  }, [pos]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  }, [isDragging, offset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // إضافة وإزالة مستمعي الأحداث للسحب
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // تطبيق الثيم وتخزينه
  useEffect(() => {
    const applyTheme = () => {
      if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
      } else {
        document.documentElement.setAttribute("data-theme", theme);
      }
      localStorage.setItem("theme", theme);
    };

    applyTheme();

    // استماع لتغييرات النظام إذا كان الثيم "system"
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme]);

  // تطبيق اللغة فورًا وتخزينها
  useEffect(() => {
    localStorage.setItem("lang", language);
    i18n.changeLanguage(language);
     // إعادة تحميل الصفحة لتطبيق اللغة على Server Components
  }, [language, i18n, router]);

  return (
    <div className={styles.modal} style={{ left: pos.x, top: pos.y }}>
      <div className={styles.modalHeader} onMouseDown={handleMouseDown}>
        <span>⚙️ {t("settings.title")}</span>
        <button onClick={onClose} className={styles.closeButton}>✖</button>
      </div>
      <div className={styles.modalContent}>
        <h3 className={styles.sectionTitle}>🎨 {t("settings.theme")}</h3>
        <div className={styles.radioGroup}>
          {[
            { value: "light", label: t("settings.theme_options.light") },
            { value: "dark", label: t("settings.theme_options.dark") },
            { value: "system", label: t("settings.theme_options.system") },
          ].map((option) => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                type="radio"
                name="theme"
                value={option.value}
                checked={theme === option.value}
                onChange={(e) => setTheme(e.target.value)}
                className={styles.radioInput}
              />
              <span className={styles.radioCustom}></span>
              {option.label}
            </label>
          ))}
        </div>

        <h3 className={styles.sectionTitle}>🌐 {t("settings.language")}</h3>
        <div className={styles.radioGroup}>
          {[
            { value: "ar", label: t("settings.language_options.ar") },
            { value: "fr", label: t("settings.language_options.fr") },
            { value: "en", label: t("settings.language_options.en") },
          ].map((option) => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                type="radio"
                name="language"
                value={option.value}
                checked={language === option.value}
                onChange={(e) => setLanguage(e.target.value)}
                className={styles.radioInput}
              />
              <span className={styles.radioCustom}></span>
              {option.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingModal;