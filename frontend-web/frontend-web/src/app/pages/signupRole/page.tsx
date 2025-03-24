"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/RoleSelection.module.css";

export default function RoleSelection() {
  const router = useRouter();

  const handleRoleSelect = async (role: string) => {
    try {
      // تخزين الدور في LocalStorage
      localStorage.setItem("selected_role", role);

      console.log("الدور المختار:", role);
      router.push(`/pages/signupRegister?role=${role}`);
    // الانتقال لصفحة التسجيل بدون إرسال الدور
    } catch (error) {
      console.error("خطأ أثناء تخزين الدور:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.overlay}></div>

        <header className={styles.logo}>
          <img src="/images/logo.svg" alt="Logo"/>
        </header>

        <div className={styles.rolesContainer}>
          {["Magasinier", "Technicien", "Responsable", "Operateur"].map(
            (role, index) => (
              <div
                key={role}
                className={`${styles.card} ${
                  index % 2 === 0 ? styles.whiteCard : styles.blackCard
                }`}
                onClick={() => handleRoleSelect(role)}
              >
                {role}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
