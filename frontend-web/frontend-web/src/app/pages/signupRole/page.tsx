"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/RoleSelection.module.css";
import { useTranslation } from "react-i18next";

export default function RoleSelection() {
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const [currentLng, setCurrentLng] = useState(i18n.language || "fr");

  useEffect(() => {
    document.documentElement.setAttribute("lang", currentLng);
  }, [currentLng]);

  const handleRoleSelect = async (role: string) => {
    try {
      localStorage.setItem("selected_role", role);
      router.push(`/pages/signupRegister?role=${role}`);
    } catch (error) {
      console.error("خطأ أثناء تخزين الدور:", error);
    }
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      setCurrentLng(lang);
      localStorage.setItem("lang", lang);
      document.documentElement.setAttribute("lang", lang);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.overlay}></div>

        <header className={styles.logo}>
          <img src="/images/logo.svg" alt={t("role_selection.logo_alt")} />
        </header>

        <h1 className={styles.title}>{t("role_selection.select_role_title")}</h1>

        <div className={styles.rolesContainer}>
          {[
            { key: "magasinier", label: t("role_selection.role_magasinier") },
            { key: "technicien", label: t("role_selection.role_technicien") },
            { key: "responsable", label: t("role_selection.role_responsable") },
            { key: "operateur", label: t("role_selection.role_operateur") },
          ].map((role, index) => (
            <div
              key={role.key}
              className={`${styles.card} ${index % 2 === 0 ? styles.whiteCard : styles.blackCard}`}
              onClick={() => handleRoleSelect(role.key)}
            >
              {role.label}
            </div>
          ))}
        </div>
      </div>
      <footer className={styles.languageFooter}>
        {[
          { code: "ar", label: t("settings.language_options.ar") },
          { code: "fr", label: t("settings.language_options.fr") },
          { code: "en", label: t("settings.language_options.en") },
        ].map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`${styles.languageButton} ${currentLng === lang.code ? styles.active : ""}`}
          >
            {lang.label}
          </button>
        ))}
      </footer>
    </div>
  );
}