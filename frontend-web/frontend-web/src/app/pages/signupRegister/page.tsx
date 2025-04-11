"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../styles/SignupRegister.module.css";
import { useTranslation } from "next-i18next"; // استيراد الترجمة

export default function SignupRegister() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "";

  const { t } = useTranslation("common"); // استخدام الترجمة من ملف common.json

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    numidentif: "",
    numtel: "",
    image: null as File | null,
    role: initialRole, // تعيين الدور الافتراضي من الرابط
  });

  const [error, setError] = useState<string | null>(null);

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
      setError(t("signup.error.role_required")); // ترجمة رسالة الخطأ
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("signup.error.password_mismatch")); // ترجمة رسالة الخطأ
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
      formDataToSend.append("role", formData.role); // ✅ إرسال الدور سواء كان الافتراضي أو المختار

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      console.log("🔹 البيانات المرسلة:", Object.fromEntries(formDataToSend.entries()));

      const response = await fetch("http://127.0.0.1:8000/utilisateurs/", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      if (!response.ok) {
        console.log("❌ خطأ في الاستجابة:", response.statusText);
        throw new Error(t("signup_failed")); // ترجمة رسالة الخطأ
      }

      router.push("/pages/login");
    } catch (error) {
      setError(t("signup_error")); // ترجمة رسالة الخطأ
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.blk}>
        <div className={styles.background}>
          <div className={styles.overlay}></div>

          <header className={styles.logo}>
            <img src="/images/logo.svg" alt={t("home.logo_alt")} width="193.1" height="82" /> {/* ترجمة النص البديل للصورة */}
          </header>

          <div className={styles.formContainer}>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                name="first_name"
                placeholder={t("signup.first_name")} // ترجمة النص داخل الحقل
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder={t("signup.last_name")} // ترجمة النص داخل الحقل
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="numidentif"
                placeholder={t("signup.numidentif")} // ترجمة النص داخل الحقل
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="numtel"
                placeholder={t("signup.numtel")} // ترجمة النص داخل الحقل
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder={t("signup.email")} // ترجمة النص داخل الحقل
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder={t("signup.password")} // ترجمة النص داخل الحقل
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder={t("signup.confirmPassword")} // ترجمة النص داخل الحقل
                className={styles.inputField}
                onChange={handleChange}
                required
              />
              <div className={styles.file}>
                {t("signup.choose_photo")} {/* ترجمة النص */}
                <input
                  type="file"
                  name="image"
                  className={styles.img}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                {t("signup.submit")} {/* ترجمة زر التسجيل */}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}