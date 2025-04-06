'use client';

import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useAuth } from './context/AuthContext';
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

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
        <header className={styles.logo}><img src="/images/logo.svg" alt="" /></header>
        <h1 className={styles.title}>
          Bienvenue dans notre système intelligent de gestion de maintenance !
        </h1>
        <p className={styles.description}>
          Optimisez l'efficacité de vos équipements avec l'IA : anticipez les
          pannes, réduisez les arrêts imprévus et assurez une maintenance
          préventive. Suivez les opérations en temps réel et prenez des
          décisions précises via une plateforme intuitive.🔧💡
        </p>
        <div className={styles.buttons}>
          <Link href="./pages/login"><button className={`${styles.btn} ${styles.btnDark}`}>Log in</button></Link>
          <Link href="./pages/signupRole"><button className={`${styles.btn} ${styles.btnLight}`}>Sign up</button></Link>
        </div>
      </div>
    </main>
  );
}
