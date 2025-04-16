'use client';

import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useAuth } from './context/AuthContext';
import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next"; // استيراد الترجمة

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation("common"); // استخدام الترجمة من ملف common.json

  if (user) {
    router.push(`/pages/dashboard`);
    return null; // Prevent rendering anything while redirecting
  }

  return (
    <main className={styles.container}>
      {/* خلفية الصورة مع الـ Gradient */}
      <div className={styles.background}>
        <div className={styles.gradientOverlay}></div>
      </div>

      {/* المحتوى */}
      <div className={styles.content}>
        <header className={styles.logo}>
          <img src="/images/logo.svg" alt={t("home.logo_alt")} /> {/* ترجمة النص البديل للصورة */}
        </header>
        <h1 className={styles.title}>
          {t("home.title")} {/* ترجمة العنوان */}
        </h1>
        <p className={styles.description}>
          {t("home.description")} {/* ترجمة الوصف */}
        </p>
        <div className={styles.buttons}>
          <Link href="./pages/login">
            <button className={`${styles.btn} ${styles.btnDark}`}>
              {t("home.login")} {/* ترجمة زر تسجيل الدخول */}
            </button>
          </Link>
          <Link href="./pages/signupRole">
            <button className={`${styles.btn} ${styles.btnLight}`}>
              {t("home.signup")} {/* ترجمة زر التسجيل */}
            </button>
          </Link>
        </div>
        <Link href="./pages/OperatorForm"><button className={`${styles.btn} ${styles.btnLight}`}>Sign up</button></Link>

      </div>
    </main>
  );
}
