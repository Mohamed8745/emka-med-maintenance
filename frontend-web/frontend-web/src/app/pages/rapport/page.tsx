"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Rapper.module.css";
import Header from "../../components/header";
import SearchBar from "../../components/searchbar";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { useTranslation } from "next-i18next"; // استيراد الترجمة
import rapportService from "../../services/rapportService";

const Rapport = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [typeRapport, setTypeRapport] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const { t } = useTranslation("common");

  const router = useRouter();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setCurrentDate(today);
  }, []);

  const handleSearch = (query: string) => {
    console.log("Recherche :", query);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      date: currentDate,
      type: typeRapport,
      description: description,
    };

    const res = await rapportService.ajouterRapport(data);

    if (res) {
      setMessage(t("rapport_form.success"));
      setTypeRapport("");
      setDescription("");
    } else {
      setMessage(t("rapport_form.error"));
    }
  };

  return (
    <>
    <ProtectedRoute>
      <Header>
        <SearchBar onSearch={handleSearch} />
      </Header>
      </ProtectedRoute>
      <div className={styles.mainContainer}>
        <div className={styles.pageWrapper}>
          <form onSubmit={handleSubmit}>
            <div className={styles.rapportContainer}>
              <div className={`${styles.inputRow} ${styles.rightAlign}`}>
                <input
                  type="text"
                  className={`${styles.inputText} ${styles.smallInput}`}
                  value={currentDate}
                  readOnly
                />
              </div>
              <div className={`${styles.inputRow} ${styles.leftAlign}`}>
                <input
                  type="text"
                  className={`${styles.inputText} ${styles.smallInput}`}
                  placeholder={t("rapport_form.type_placeholder")}
                  value={typeRapport}
                  onChange={(e) => setTypeRapport(e.target.value)}
                />
              </div>
            </div>

            <textarea
              className={styles.textarea}
              placeholder={t("rapport_form.description_placeholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className={styles.footer}>
              <button type="submit" className={styles.submitButton}>
                {t("rapport_form.send")}
              </button>
              {message && <p>{message}</p>}
            </div>
          </form>
        </div>
      </div>
    
    </>
  );
};

export default Rapport;
