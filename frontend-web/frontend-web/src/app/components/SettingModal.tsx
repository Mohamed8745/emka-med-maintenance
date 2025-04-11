// components/SettingModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/setting.module.css";
import { useTranslation } from "next-i18next"; // استيراد الترجمة
import { useRouter } from "next/navigation"; // استيراد useRouter لتحديث الصفحة

interface SettingModalProps {
  onClose: () => void;
}

const SettingModal: React.FC<SettingModalProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation("common"); // استخدام الترجمة من ملف common.json
  const [pos, setPos] = useState({ x: 200, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // جلب الثيم واللغة من localStorage عند أول تحميل
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");
  const [language, setLanguage] = useState(() => localStorage.getItem("lang") || "fr");
  const router = useRouter();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  // تطبيق الثيم وتخزينه
  useEffect(() => {
    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // تخزين اللغة
  useEffect(() => {
    localStorage.setItem("lang", language);
    i18n.changeLanguage(language); // تغيير اللغة فورا
  }, [language, i18n]); // تأكد من أنه يتم تحديث اللغة عند التغيير

  return (
    <div className={styles.modal} style={{ left: pos.x, top: pos.y }}>
      <div className={styles.modalHeader} onMouseDown={handleMouseDown}>
        <span>⚙️ {t("settings.title")}</span> {/* ترجمة عنوان النافذة */}
        <button onClick={onClose}>✖</button>
      </div>
      <div className={styles.modalContent}>
        <h3>🎨 {t("settings.theme")}</h3> {/* ترجمة عنوان الثيم */}
        <div className={styles.radioGroup}>
          {[{ value: "light", label: t("settings.theme_options.light") },
            { value: "dark", label: t("settings.theme_options.dark") },
            { value: "system", label: t("settings.theme_options.system") }].map((option) => (
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

        <h3 style={{ marginTop: "16px" }}>🌐 {t("settings.language")}</h3> {/* ترجمة عنوان اللغة */}
        <div className={styles.radioGroup}>
          {[{ value: "ar", label: t("settings.language_options.ar") },
            { value: "fr", label: t("settings.language_options.fr") },
            { value: "en", label: t("settings.language_options.en") }].map((option) => (
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
