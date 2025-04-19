"use client";

import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";

export default function HomeClient() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation("common");

  if (user) {
    router.push(`/pages/dashboard`);
    return null;
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
          <Link href="./pages/login">
            <button className={`${styles.btn} ${styles.btnDark}`}>
              {t("home.login")}
            </button>
          </Link>
          <Link href="./pages/signupRole">
            <button className={`${styles.btn} ${styles.btnLight}`}>
              {t("home.signup")}
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}