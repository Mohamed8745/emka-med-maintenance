"use client";

import React, { useState } from "react";
import styles from "../styles/AddStockModal.module.css";
import stockService from "../services/stockService";
import { useTranslation } from "next-i18next";

interface AddStoreModalProps {
  onClose: () => void;
  onSubmit: (newWarehouse: {
    name: string;
    content: string;
    capacite: number;
    capacite_utilisee: number;
    capacite_libre: number;
  }) => void;
}

const AddStoreModal: React.FC<AddStoreModalProps> = ({ onClose, onSubmit }) => {
  const { t } = useTranslation("common");

  const [formData, setFormData] = useState({
    name: "",
    content: "",
    capacite: 0,
    capacite_utilisee: 0,
    capacite_libre: 0,
  });

  const [newWarehouse, setNewWarehouse] = useState<{
    name: string;
    content: string;
    capacite: number;
    capacite_utilisee: number;
    capacite_libre: number;
  }>({
    name: "",
    content: "",
    capacite: 0,
    capacite_utilisee: 0,
    capacite_libre: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("capacite") ? Number(value) : value,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewWarehouse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const addedWarehouse = await stockService.addStock(formData);
      if (addedWarehouse) {
        onSubmit(formData);
        onClose();
      } else {
        console.error(t("add_store_modal.error_failed"));
      }
    } catch (error) {
      console.error(t("add_store_modal.error_occurred"), error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{t("add_store_modal.title")}</h2>
        <form onSubmit={handleSubmit}>
          <label className={styles.formLabel}>{t("add_store_modal.store_name")}</label>
          <input
            name="name"
            className={styles.formInput}
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label className={styles.formLabel}>{t("add_store_modal.store_content")}</label>
          <input
            name="content"
            className={styles.formInput}
            value={formData.content}
            onChange={handleChange}
            required
          />
          <label className={styles.formLabel}>{t("add_store_modal.quantity_total")}</label>
          <input
            name="capacite"
            type="number"
            className={styles.formInput}
            value={formData.capacite}
            onChange={handleChange}
            required
          />

          <div className={styles.modalButtons}>
            <button type="submit" className={styles.addBtn}>
              {t("add_store_modal.add_button")}
            </button>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              {t("add_store_modal.cancel_button")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoreModal;