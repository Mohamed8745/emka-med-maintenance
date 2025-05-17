"use client";
import React, { useState, useEffect } from "react";
import styles from "../../styles/machine.module.css";
import machineService from "../../services/machineService";
import Header from "../../components/header";
import SearchBar from "../../components/searchbar";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { useTranslation } from "react-i18next";

type Machine = {
  id: number;
  name: string;
  type: string;
  status: string;
  image: string;
  lastMaintenance: string;
};

export default function App() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState<"ajouter" | "modifier" | "supprimer" | "">("");
  const [imagePreview, setImagePreview] = useState("https://via.placeholder.com/150");
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const data = await machineService.getAll();
      setMachines(data);
    } catch (error) {
      showMessage("error", t("machine.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleOpenModal = (type: "ajouter" | "modifier" | "supprimer", machine: Machine | null = null) => {
    setFormType(type);
    setSelectedMachine(machine);
    setImagePreview(machine?.image || "https://via.placeholder.com/150");
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setFormType("");
    setSelectedMachine(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setImagePreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    try {
      if (formType === "ajouter") {
        await machineService.create(formData);
        showMessage("success", t("machine.addedSuccessfully"));
      } else if (formType === "modifier" && selectedMachine) {
        await machineService.update(selectedMachine.id, formData);
        showMessage("success", t("machine.updatedSuccessfully"));
      }
      await fetchMachines();
      handleCloseModal();
    } catch (error) {
      showMessage("error", t("machine.formSubmitError"));
    }
  };

  const handleDelete = async () => {
    if (!selectedMachine) return;
    try {
      await machineService.delete(selectedMachine.id);
      showMessage("success", t("machine.deletedSuccessfully"));
      await fetchMachines();
      handleCloseModal();
    } catch (error) {
      showMessage("error", t("machine.deleteError"));
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.textarea}>
        <label htmlFor="machine-name">{t("machine.machineName")}</label>
        <input type="text" name="name" id="machine-name" required defaultValue={selectedMachine?.name || ""} />
      </div>
      <div className={styles.textarea}>
        <label htmlFor="machine-type">{t("machine.machineType")}</label>
        <input type="text" name="type" id="machine-type" required defaultValue={selectedMachine?.type || ""} />
      </div>
      <div className={styles.formRow}>
        <div className={styles.halfWidth}>
          <label htmlFor="machine-status">{t("machine.status")}</label>
          <select name="status" id="machine-status" required defaultValue={selectedMachine?.status || "Fonctionnel"}>
            <option value="Fonctionnel">{t("machine.functional")}</option>
            <option value="En panne">{t("machine.broken")}</option>
            <option value="Maintenance">{t("machine.inMaintenance")}</option>
          </select>
        </div>
        <div className={styles.halfWidth}>
          <label htmlFor="image">{t("machine.image")}</label>
          <input type="file" name="image" id="image" accept="image/*" onChange={handleImageChange} />
          <img src={imagePreview} alt="Preview" className={styles.previewImage} />
        </div>
      </div>
      <div className={styles.textarea}>
        <label htmlFor="lastMaintenance">{t("machine.lastMaintenance")}</label>
        <input type="date" name="lastMaintenance" id="lastMaintenance" required defaultValue={selectedMachine?.lastMaintenance || ""} />
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.btnPrimary}>
          {formType === "ajouter" ? t("machine.add") : t("machine.update")}
        </button>
        <button type="button" className={styles.btnCancel} onClick={handleCloseModal}>
          {t("machine.cancel")}
        </button>
      </div>
    </form>
  );

  return (
    <ProtectedRoute>
      <Header>
        <SearchBar onSearch={(query) => console.log("Recherche:", query)} />
      </Header>
      <div className={styles.body}>
        <div className={styles.container}>
          <h1 className={styles.h1}>{t("machine.machineManagement")}</h1>
          {message && <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>}
          <div className={styles.actionButtons}>
            <button className={styles.btnPrimary} onClick={() => handleOpenModal("ajouter")}>
              + {t("machine.addMachine")}
            </button>
          </div>

          {loading ? (
            <p>{t("machine.loading")}...</p>
          ) : (
            <div className={styles.machineList}>
              {machines.map((machine) => (
                <div className={styles.machineCard} key={machine.id}>
                  <img src={machine.image} alt={machine.name} className={styles.machineImage} />
                  <h3>{machine.name}</h3>
                  <p><strong>{t("machine.type")}:</strong> {machine.type}</p>
                  <p><strong>{t("machine.status")}:</strong> {machine.status}</p>
                  <p><strong>{t("machine.lastMaintenance")}:</strong> {new Date(machine.lastMaintenance).toLocaleDateString()}</p>
                  <div className={styles.cardActions}>
                    <button onClick={() => handleOpenModal("modifier", machine)}>{t("machine.update")}</button>
                    <button className={styles.btnDanger} onClick={() => handleOpenModal("supprimer", machine)}>
                      {t("machine.delete")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {modalVisible && <div className={styles.overlay} onClick={handleCloseModal}></div>}

          {modalVisible && (
            <div className={styles.modal}>
              <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                  <h3>
                    {formType === "ajouter"
                      ? t("machine.addMachine")
                      : formType === "modifier"
                      ? t("machine.updateMachine")
                      : t("machine.deleteMachine")}
                  </h3>
                  <button className={styles.closeBtn} onClick={handleCloseModal}>&times;</button>
                </div>

                {formType === "supprimer" ? (
                  <div className={styles.confirmation}>
                    <p>{t("machine.deleteConfirmation")}</p>
                    <div className={styles.machinePreview}>
                      <img src={selectedMachine?.image} alt={selectedMachine?.name} />
                      <strong>{selectedMachine?.name} - {selectedMachine?.type}</strong>
                    </div>
                    <div className={styles.formActions}>
                      <button className={styles.btnDanger} onClick={handleDelete}>{t("machine.delete")}</button>
                      <button className={styles.btnCancel} onClick={handleCloseModal}>{t("machine.cancel")}</button>
                    </div>
                  </div>
                ) : (
                  renderForm()
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
