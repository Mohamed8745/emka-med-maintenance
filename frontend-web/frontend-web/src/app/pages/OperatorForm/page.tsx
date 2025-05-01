"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/OperatForm.module.css";
import operatorReportService from "../../services/operatorReportService";
import Header from "../../components/header";
import SearchBar from "../../components/searchbar";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";

const OperatorForm = () => {
  const { t } = useTranslation("common");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Ouvert");
  const [dateSignalement, setDateSignalement] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [fileName, setFileName] = useState(t("operator_form.no_file"));
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    const now = new Date();
    setDateSignalement(now.toISOString().slice(0, 16));
  }, []);

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setFileName(file.name);
    }
  };

  const resetForm = () => {
    setDescription("");
    setStatus("Ouvert");
    setDateSignalement(new Date().toISOString().slice(0, 16));
    setImage(null);
    setFileName(t("operator_form.no_file"));
    setShowAI(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", description);
    formData.append("status", status);
    formData.append("dateSignalement", dateSignalement);
    if (image) formData.append("image", image);

    const result = await operatorReportService.send(formData);

    if (result) {
      alert(t("operator_form.success_message")); // ✅ تم
      resetForm();
    } else {
      alert(t("operator_form.error_message")); // ❌ فشل
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <Header>
          <SearchBar onSearch={handleSearch} />
        </Header>
        <div className={styles["mainContainer"]}>
        <div className={styles["rapport-container"]}>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h2 className={styles.title}>{t("operator_form.title")}</h2>

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
                <option value="Ouvert">{t("operator_form.status_open")}</option>
                <option value="En cours">{t("operator_form.status_processing")}</option>
                <option value="Résolu">{t("operator_form.status_resolved")}</option>
              </select>
            </div>

            <textarea
              className={styles.textarea}
              placeholder={t("operator_form.description_placeholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <div className={styles["ai-toggle-container"]}>
              {!showAI ? (
                <button
                  type="button"
                  className={styles["ai-button"]}
                  onClick={() => setShowAI(true)}
                >
                  {t("operator_form.ai_analysis")}
                </button>
              ) : (
                <div className={styles["ai-placeholder"]}></div>
              )}
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="file" className={styles["form-label"]}>
                {t("operator_form.attach_file")}
              </label>
              <div className={styles["file-upload"]}>
                <input
                  type="file"
                  id="file"
                  className={styles["form-file"]}
                  onChange={handleFileChange}
                />
                <label htmlFor="file" className={styles["file-label"]}>
                  {t("operator_form.choose_file")}
                </label>
                <span className={styles["file-name"]}>{fileName}</span>
              </div>
            </div>

            <div className={styles.footer}>
              <button type="submit" className={styles["submit-button"]}>
                {t("operator_form.submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
};

export default OperatorForm;
