"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../styles/SignupRegister.module.css";

export default function SignupRegister() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "";

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
      setError("يرجى اختيار دور المستخدم");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمتا المرور غير متطابقتان");
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
        throw new Error("فشل في التسجيل");
      }

      router.push("/pages/login");
    } catch (error) {
      setError("حدث خطأ أثناء التسجيل");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.blk}>
        <div className={styles.background}>
          <div className={styles.overlay}></div>

          <header className={styles.logo}>
            <img src="/images/logo.svg" alt="Logo" width="193.1" height="82" />
          </header>

          <div className={styles.formContainer}>
            {/*<h2 className={styles.h2}>Inscrivez-vous</h2>*/}
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
              <input type="text" name="first_name" placeholder="Nom" className={styles.inputField} onChange={handleChange} required />
              <input type="text" name="last_name" placeholder="Prenom" className={styles.inputField} onChange={handleChange} required />
              <input type="text" name="numidentif" placeholder="Carte d'identité" className={styles.inputField} onChange={handleChange} required />
              <input type="text" name="numtel" placeholder="Numéro de téléphone" className={styles.inputField} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" className={styles.inputField} onChange={handleChange} required />
              <input type="password" name="password" placeholder="Mot de passe" className={styles.inputField} onChange={handleChange} required />
              <input type="password" name="confirmPassword" placeholder="Confirmez le mot de passe" className={styles.inputField} onChange={handleChange} required />
              <div className={styles.file}>
                choisir une photo
                <input type="file" className={styles.img} />
              </div>

              <button type="submit" className={styles.submitButton}>Sign up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}