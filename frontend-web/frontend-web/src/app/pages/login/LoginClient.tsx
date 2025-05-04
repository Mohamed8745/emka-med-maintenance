"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/SignupRegister.module.css";
import { useAuth } from "@/app/context/AuthContext";
import { useTranslation } from "react-i18next";

interface LoginClientProps {
  lng: string;
}

export default function LoginClient({ lng }: LoginClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { i18n, t, ready } = useTranslation("common");
  const [currentLng, setCurrentLng] = useState(i18n.language || "fr");
  const { login, loading } = useAuth();


  useEffect(() => {
      document.documentElement.setAttribute("lang", currentLng);
    }, [currentLng]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError(null);
      await login(email, password);
      router.push("/pages/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError(t("login.error"));
    }
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      setCurrentLng(lang);
      localStorage.setItem("lang", lang);
      document.documentElement.setAttribute("lang", lang);
    });
  };

  if (!ready || loading) {
    return <div>جارٍ التحميل...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.blk}>
        <div className={styles.background}>
          <header className={styles.logo}>
            <img src="/images/logo.svg" alt={t("home.logo_alt")} width="193.1" height="82" />
          </header>
          <div className={styles.formContainer}>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                name="email"
                placeholder={t("login.email")}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder={t("login.password")}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? t("loading") : t("login.submit")}
              </button>
            </form>
          </div>
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