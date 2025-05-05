"use client";

import { useState, FormEvent } from "react";
import styles from "../../styles/TechniForm.module.css";
import tacheService from "../../services/tacheService";
import { useTranslation } from "next-i18next";
import Header from "../../components/header";
import SearchBar from "../../components/searchbar";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

const TechniForm = () => {
  const { t } = useTranslation("common");

  const [description, setDescription] = useState("Remplacer le filtre d'huile");
  const [showAI, setShowAI] = useState(false);
  const [technicien, setTechnicien] = useState("Jean Dupont");
  const [dateDebut, setDateDebut] = useState("2025-04-10");
  const [dateFin, setDateFin] = useState("2025-04-12");
  const [assignedTo, setAssignedTo] = useState("Jean Dupont");
  const [statut, setStatut] = useState("En cours");
  const [message, setMessage] = useState("");

  const handleSearch = (query: string) => {
    console.log("Recherche :", query);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = {
      description,
      technicien,
      date_debut: dateDebut,
      date_fin: dateFin,
      assigne_a: assignedTo,
      statut,
    };

    const res = await tacheService.ajouterTache(data);

    if (res) {
      setMessage(t("techni_form.success_message"));
    } else {
      setMessage(t("techni_form.error_message"));
    }
  };

  return (
    <>
    <ProtectedRoute>
      <Header>
        <SearchBar onSearch={handleSearch} />
      </Header>
    </ProtectedRoute>
    <div className={styles["mainContainer"]}>
      <form onSubmit={handleSubmit} className={styles["tache-form"]}>
        <div className={styles.header}>
          <h2>{t("techni_form.title")}</h2>
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="description">{t("techni_form.description")}</label>
          <textarea
            id="description"
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles["ai-toggle-container"]}>
          {!showAI ? (
            <button
              type="button"
              className={styles["ai-button"]}
              onClick={() => setShowAI(true)}
            >
              {t("techni_form.ai_analysis")}
            </button>
          ) : (
            <div className={styles["ai-placeholder"]}>{t("techni_form.ai_placeholder")}</div>
          )}
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="technicien">{t("techni_form.technician")}</label>
          <input
            type="text"
            id="technicien"
            required
            value={technicien}
            onChange={(e) => setTechnicien(e.target.value)}
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="dateDebut">{t("techni_form.start_date")}</label>
          <input
            type="date"
            id="dateDebut"
            required
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="dateFin">{t("techni_form.end_date")}</label>
          <input
            type="date"
            id="dateFin"
            required
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="assigne">{t("techni_form.assigned_to")}</label>
          <input
            type="text"
            id="assigne"
            required
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />
        </div>

        <div className={styles["form-group1"]}>
          <label htmlFor="statut">{t("techni_form.status")}</label>
          <select
            id="statut"
            required
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
          >
            <option value="En attente">{t("techni_form.status_pending")}</option>
            <option value="En cours">{t("techni_form.status_in_progress")}</option>
            <option value="Terminé">{t("techni_form.status_done")}</option>
          </select>
        </div>

        <div className={styles.footer}>
          <button type="submit">{t("techni_form.submit")}</button>
          {message && <p>{message}</p>}
        </div>
      </form>
      </div>
    </>
  );
};

export default TechniForm;
