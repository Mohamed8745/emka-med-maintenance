"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/RoleSelection.module.css";
import { useTranslation } from "next-i18next"; // استيراد الترجمة

export default function RoleSelection() {
  const router = useRouter();
  const { t } = useTranslation("common"); // استخدام الترجمة من ملف common.json

  const handleRoleSelect = async (role: string) => {
    try {
      // تخزين الدور في LocalStorage
      localStorage.setItem("selected_role", role);

      console.log("الدور المختار:", role);
      router.push(`/pages/signupRegister?role=${role}`);
    } catch (error) {
      console.error("خطأ أثناء تخزين الدور:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.overlay}></div>

        <header className={styles.logo}>
          <img src="/images/logo.svg" alt={t("role_selection.logo_alt")} /> {/* ترجمة النص البديل للصورة */}
        </header>

        <h1 className={styles.title}>{t("role_selection.select_role_title")}</h1> {/* ترجمة العنوان */}

        <div className={styles.rolesContainer}>
          {[
            { key: "magasinier", label: t("role_selection.role_magasinier") },
            { key: "technicien", label: t("role_selection.role_technicien") },
            { key: "responsable", label: t("role_selection.role_responsable") },
            { key: "operateur", label: t("role_selection.role_operateur") },
          ].map((role, index) => (
            <div
              key={role.key}
              className={`${styles.card} ${
                index % 2 === 0 ? styles.whiteCard : styles.blackCard
              }`}
              onClick={() => handleRoleSelect(role.key)}
            >
              {role.label} {/* ترجمة اسم الدور */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
