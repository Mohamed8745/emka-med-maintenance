"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/SignupRegister.module.css";
import { useAuth } from "@/app/context/AuthContext";
import { login } from "@/app/services/authService";
import { useTranslation } from "next-i18next"; // استيراد الترجمة

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const { t } = useTranslation("common"); // استخدام الترجمة من ملف common.json

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = await login(email, password);
      setUser({ token: token.access });
      router.push('/pages/dashboard'); // بعد النجاح ننتقل إلى صفحة dashboard
    } catch (error) {
      console.error('Login failed:', error);
      setError(t("login.error")); // ترجمة رسالة الخطأ
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.blk}>
        <div className={styles.background}>
          <header className={styles.logo}>
            <img src="/images/logo.svg" alt={t("home.logo_alt")} width="193.1" height="82" /> {/* ترجمة النص البديل للصورة */}
          </header>
          <div className={styles.formContainer}>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                name="email"
                placeholder={t("login.email")} // ترجمة النص داخل الحقل
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder={t("login.password")} // ترجمة النص داخل الحقل
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <button type="submit" className={styles.submitButton}>
                {t("login.submit")} {/* ترجمة زر تسجيل الدخول */}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
