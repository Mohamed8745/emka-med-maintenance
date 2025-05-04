"use client";

import React, { useState } from "react";
import styles from "../styles/AddStockModal.module.css";
import { useTranslation } from "next-i18next";

interface StockPieceFormData {
  name: string;
  reference: string;
  categorie: string;
  prxUnitaire: number;
  quantite: number;
  file?: File;
  stock?: string;
}

interface AddStockPieceModalProps {
  onClose: () => void;
  onSubmit: (formData: StockPieceFormData) => Promise<void>;
  stockId: string;
}

const AddStockPieceModal: React.FC<AddStockPieceModalProps> = ({ onClose, onSubmit, stockId }) => {
  const { t } = useTranslation("common");

  const [formData, setFormData] = useState<StockPieceFormData>({
    name: "",
    reference: "",
    categorie: "",
    prxUnitaire: 0,
    quantite: 0,
    file: undefined,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "prxUnitaire" || name === "quantite" ? Number(value) : value,
    }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file instanceof File) {
      setFormData((prev) => ({
        ...prev,
        file,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        file: undefined,
      }));
    }
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError(t("add_stock_piece_modal.errors.name_required"));
      return false;
    }
    if (!formData.reference.trim()) {
      setError(t("add_stock_piece_modal.errors.reference_required"));
      return false;
    }
    if (!formData.categorie.trim()) {
      setError(t("add_stock_piece_modal.errors.category_required"));
      return false;
    }
    if (formData.prxUnitaire <= 0) {
      setError(t("add_stock_piece_modal.errors.unit_price_invalid"));
      return false;
    }
    if (formData.quantite <= 0) {
      setError(t("add_stock_piece_modal.errors.quantity_invalid"));
      return false;
    }
    if (!stockId) {
      setError(t("add_stock_piece_modal.errors.stock_id_required"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({ ...formData, stock: stockId });
      onClose();
    } catch (error: any) {
      setError(error.message || t("add_stock_piece_modal.errors.generic"));
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{t("add_stock_piece_modal.title")}</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t("add_stock_piece_modal.name")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              className={styles.formInput}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t("add_stock_piece_modal.reference")}</label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              className={styles.formInput}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t("add_stock_piece_modal.category")}</label>
            <input
              type="text"
              name="categorie"
              value={formData.categorie}
              className={styles.formInput}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t("add_stock_piece_modal.unit_price")}</label>
            <input
              type="number"
              name="prxUnitaire"
              value={formData.prxUnitaire}
              className={styles.formInput}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t("add_stock_piece_modal.quantity")}</label>
            <input
              type="number"
              name="quantite"
              value={formData.quantite}
              className={styles.formInput}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className={styles.contentFile}>
            <div className={styles.file}>
              {t("add_stock_piece_modal.image")}
              <input
                type="file"
                name="image"
                className={styles.img}
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <span className={styles.fileName}>
              {formData.file
                ? formData.file.name.length > 14
                  ? `${formData.file.name.substring(0, 14)}...`
                  : formData.file.name
                : t("add_stock_piece_modal.no_file_selected")}
            </span>
          </div>
          <div className={styles.modalButtons}>
            <button type="submit" className={styles.addBtn}>
              {t("add_stock_piece_modal.add_button")}
            </button>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              {t("add_stock_piece_modal.cancel_button")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockPieceModal;