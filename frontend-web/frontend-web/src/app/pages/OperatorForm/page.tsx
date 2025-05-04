"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/OperatForm.module.css"; 
import { body } from "framer-motion/client";

const OperatorForm = () => {
  const [showAI, setShowAI] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("Ouvert");
  const [dateSignalement, setDateSignalement] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("Aucun fichier sélectionné");

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16); 
    setDateSignalement(formattedDate);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", description);
    formData.append("status", status);
    formData.append("dateSignalement", dateSignalement);
    if (image) formData.append("image", image);

    const res = await fetch("/api/reports", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("تم إرسال التقرير بنجاح");
      setDescription("");
      setStatus("Ouvert");
      setDateSignalement(new Date().toISOString().slice(0, 16));
      setImage(null);
      setFileName("Aucun fichier sélectionné");
    } else {
      alert("حدث خطأ أثناء الإرسال");
    }
  };

  return (
    <div className={styles.body}>
    <div className={styles["rapport-container"]}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <h2 className={styles.title}>Rapport de l'opérateur</h2>

        <div className={styles["input-row"]}>
          <input
            type="datetime-local"
            className={styles["input-text"]}
            value={dateSignalement}
            readOnly
          />
          <select
            className={styles["input-text"]}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Ouvert">Ouvert</option>
            <option value="En cours">En cours de traitement</option>
            <option value="Résolu">Résolu</option>
          </select>
        </div>

        <textarea
          className={styles.textarea}
          placeholder="Entrez la description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <div className={styles["ai-toggle-container"]}>
  {!showAI ? (
    <button
      type="button"
      className={styles["ai-button"]}
      onClick={() => setShowAI(true)}
    >
      Analyses IA
    </button>
  ) : (
    <div className={styles["ai-placeholder"]}></div>
  )}
</div>

        <div className={styles["form-group"]}>
          <label htmlFor="file" className={styles["form-label"]}>Joindre un fichier</label>
          <div className={styles["file-upload"]}>
            <input
              type="file"
              id="file"
              className={styles["form-file"]}
              onChange={handleFileChange}
            />
            <label htmlFor="file" className={styles["file-label"]}>
              Choisir un fichier
            </label>
            <span className={styles["file-name"]}>{fileName}</span>
          </div>
        </div>

        <div className={styles.footer}>
          <button type="submit" className={styles["submit-button"]}>
            Envoyer le rapport
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default OperatorForm;
