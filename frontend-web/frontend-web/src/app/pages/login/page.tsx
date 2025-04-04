"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/SignupRegister.module.css";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Échec de la connexion");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access);
      localStorage.setItem("user", JSON.stringify({ username: data.username, image: data.image , role : data.role}));

      router.push(`/pages/dashboard`);
    } catch (error) {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.blk}>
        <div className={styles.background}>
          <header className={styles.logo}>
            <img src="/images/logo.svg" alt="Logo" width="193.1" height="82" />
          </header>
          <div className={styles.formContainer}>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
              <input type="email" name="email" placeholder="Email" className={styles.inputField} onChange={handleChange} required />
              <input type="password" name="password" placeholder="Mot de passe" className={styles.inputField} onChange={handleChange} required />
              <button type="submit" className={styles.submitButton}>Se connecter</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
