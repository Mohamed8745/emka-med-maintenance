"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../styles/SignupRegister.module.css";
import { useTranslation } from "react-i18next";

export default function SignupRegister() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "";
  const { t, i18n } = useTranslation("common");
  const [currentLng, setCurrentLng] = useState(i18n.language || "fr");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    numidentif: "",
    numtel: "",
    image: null as File | null,
    role: initialRole,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("lang", currentLng);
  }, [currentLng]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "image") {
      if (e.target.files && e.target.files[0]) {
        setFormData({ ...formData, image: e.target.files[0] });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!formData.role) {
      setError(t("signup.error.role_required"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("signup.error.password_mismatch"));
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("first_name", formData.first_name);
      formDataToSend.append("last_name", formData.last_name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("numidentif", formData.numidentif);
      formDataToSend.append("numtel", formData.numtel);
      formDataToSend.append("role", formData.role);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch("http://127.0.0.1:8000/utilisateurs/", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(t("signup_failed"));
      }

      router.push("/pages/login");
    } catch (error) {
      setError(t("signup_error"));
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
      <div className={styles.blk}>
        <div className={styles.background}>
          <div className={styles.overlay}></div>

          <header className={styles.logo}>
            <img src="/images/logo.svg" alt={t("home.logo_alt")} width="193.1" height="82" />
          </header>

          <div className={styles.formContainer}>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                name="first_name"
                placeholder={t("signup.first_name")}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder={t("signup.last_name")}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="numidentif"
                placeholder={t("signup.numidentif")}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="numtel"
                placeholder={t("signup.numtel")}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder={t("signup.email")}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder={t("signup.password")}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder={t("signup.confirmPassword")}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <div className={styles.file}>
                {t("signup.choose_photo")}
                <input
                  type="file"
                  name="image"
                  className={styles.img}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                {t("signup.submit")}
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