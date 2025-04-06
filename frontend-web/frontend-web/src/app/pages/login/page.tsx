"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/SignupRegister.module.css";
import { useAuth } from "@/app/context/AuthContext";
import { login } from "@/app/services/authService";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();

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
