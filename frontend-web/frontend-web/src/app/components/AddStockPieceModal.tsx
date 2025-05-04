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
  files?: File[];
  stock?: string;
}

interface AddStockPieceModalProps {
  onClose: () => void;
  onSubmit: (formData: StockPieceFormData) => void;
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
    files: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "prxUnitaire" || name === "quantite" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`Invalid file type for ${file.name}. Only JPEG, PNG, and GIF are allowed.`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    setFormData((prev) => ({
      ...prev,
      files: validFiles,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.prxUnitaire <= 0) {
      alert(t("add_stock_piece_modal.unit_price_error"));
      return;
    }
    if (formData.quantite <= 0) {
      alert(t("add_stock_piece_modal.quantity_error"));
      return;
    }
    onSubmit({ ...formData, stock: stockId });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{t("add_stock_piece_modal.title")}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t("add_stock_piece_modal.name")}</label>
            <input type="text" name="name" value={formData.name} className={styles.formInput} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t("add_stock_piece_modal.reference")}</label>
            <input type="text" name="reference" value={formData.reference} className={styles.formInput} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t("add_stock_piece_modal.category")}</label>
            <input type="text" name="categorie" value={formData.categorie} className={styles.formInput} onChange={handleChange} required />
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
                name="images"
                className={styles.img}
                onChange={handleFileChange}
                multiple
                accept="image/jpeg,image/png,image/gif"
              />
            </div>
            <span className={styles.fileName}>
              {formData.files && formData.files.length > 0
                ? formData.files.map((file) => file.name).join(", ")
                : t("add_stock_piece_modal.no_file_selected")}
            </span>
          </div>
          <div className={styles.modalButtons}>
            <button type="submit" className={styles.addBtn}>{t("add_stock_piece_modal.add_button")}</button>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>{t("add_stock_piece_modal.cancel_button")}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockPieceModal;