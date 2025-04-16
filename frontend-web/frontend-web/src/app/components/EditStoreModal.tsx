"use client";

import React, { useState } from "react";
import styles from "../styles/AddStockModal.module.css";
import authService from "../services/authService";
import { useTranslation } from "next-i18next";

interface EditStoreModalProps {
  onClose: () => void;
  onSubmit: (updatedWarehouse: {
    id: number;
    name: string;
    capacite: number;
    capacite_utilisee: number;
    capacite_libre: number;
    content: string;
  }) => void;
  warehouse: {
    id: number;
    name: string;
    capacite: number;
    capacite_utilisee: number;
    capacite_libre: number;
    content: string;
  };
}

const EditStoreModal: React.FC<EditStoreModalProps> = ({
  onClose,
  onSubmit,
  warehouse,
}) => {
  const { t } = useTranslation("common");

  const [formData, setFormData] = useState({
    name: warehouse.name,
    content: warehouse.content,
    capacite: warehouse.capacite,
    capacite_utilisee: warehouse.capacite_utilisee,
    capacite_libre: warehouse.capacite_libre,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("capacite") ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedWarehouse = await authService.updateStock(
        warehouse.id,
        formData
      );
      if (updatedWarehouse) {
        console.log(t("edit_store_modal.success_message"), updatedWarehouse);
        onSubmit({ id: warehouse.id, ...formData });
        onClose();
      } else {
        console.error(t("edit_store_modal.error_failed"));
      }
    } catch (error) {
        console.error(t("edit_store_modal.error_occurred"), error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{t("edit_store_modal.title")}</h2>
        <form onSubmit={handleSubmit}>
          <label className={styles.formLabel}>{t("edit_store_modal.store_name")}</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("edit_store_modal.store_name")}
            required
            className={styles.formInput}
          />
          <label className={styles.formLabel}>{t("edit_store_modal.store_content")}</label>
          <input
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder={t("edit_store_modal.store_content")}
            required
            className={styles.formInput}
          />
          <label className={styles.formLabel}>{t("edit_store_modal.quantity_total")}</label>
          <input
            name="capacite"
            type="number"
            value={formData.capacite}
            onChange={handleChange}
            placeholder={t("edit_store_modal.quantity_total")}
            required
            className={styles.formInput}
          />
          <label className={styles.formLabel}>{t("edit_store_modal.quantity_used")}</label>
          <input
            name="capacite_utilisee"
            type="number"
            value={formData.capacite_utilisee}
            onChange={handleChange}
            placeholder={t("edit_store_modal.quantity_used")}
            required
            className={styles.formInput}
            disabled
          />
          <label className={styles.formLabel}>{t("edit_store_modal.quantity_free")}</label>
          <input
            name="capacite_libre"
            type="number"
            value={formData.capacite_libre}
            onChange={handleChange}
            placeholder={t("edit_store_modal.quantity_free")}
            required
            className={styles.formInput}
            disabled
          />
          <div className={styles.modalButtons}>
            <button type="submit" className={styles.addBtn}>
              {t("edit_store_modal.save_button")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              {t("edit_store_modal.cancel_button")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStoreModal;