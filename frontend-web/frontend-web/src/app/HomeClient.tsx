"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";
import { useLanguage } from "./context/LanguageContext";
import i18n from "@/i18n";

export default function HomeClient() {
  const { user } = useAuth();
  const router = useRouter();
  const { t , ready } = useTranslation("common");
  const [currentLng, setCurrentLng] = useState(i18n.language || "fr");
  const { login, loading } = useAuth();
  

  useEffect(() => {
    document.documentElement.setAttribute("lang", currentLng);
  }, [currentLng]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      setCurrentLng(lang);
      localStorage.setItem("lang", lang);
      document.documentElement.setAttribute("lang", lang);
    });
  };

  if (user) {
    router.push("/pages/dashboard");
    return null;
  }

  if (!ready || loading) {
    return <div>جارٍ التحميل...</div>;
  }
  return (
    <main className={styles.container}>
      <div className={styles.background}>
        <div className={styles.gradientOverlay}></div>
      </div>
      <div className={styles.content}>
        <header className={styles.logo}>
          <Image
            src="/images/logo.svg"
            alt={t("home.logo_alt")}
            width={160}
            height={60}
            priority
          />
        </header>
        <h1 className={styles.title}>{t("home.title")}</h1>
        <p className={styles.description}>{t("home.description")}</p>
        <div className={styles.buttons}>
          <Link href="/pages/login">
            <button className={`${styles.btn} ${styles.btnDark}`}>
              {t("home.login")}
            </button>
          </Link>
          <Link href="/pages/signupRole">
            <button className={`${styles.btn} ${styles.btnLight}`}>
              {t("home.signup")}
            </button>
          </Link>
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
      
    </main>
  );
}