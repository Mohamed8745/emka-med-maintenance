"use client";

import React, { useState } from "react";
import styles from "../styles/AddStockModal.module.css";
import { useTranslation } from "next-i18next";

// Define the StockPiece interface
interface StockPiece {
  id: string;
  piece: {
    name: string;
    reference: string;
    categorie: string;
    prxUnitaire: number;
    image?: string; // Optional property
  };
  quantite: number;
}

interface AddStockPieceModalProps {
  onClose: () => void;
  onSubmit: (newStockPiece: Partial<StockPiece>) => void;
  stockId: string;
  stockPiece?: StockPiece; // Add this line to include the stockPiece prop
}

const AddStockPieceModal: React.FC<AddStockPieceModalProps> = ({ onClose, onSubmit, stockId }) => {
  const { t } = useTranslation("common");
  const [formData, setFormData] = useState({
    name: "",
    reference: "",
    categorie: "",
    prxUnitaire: 0,
    quantite: 0,
    image: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "prxUnitaire" || name === "quantite" ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{t("add_stock_piece_modal.title")}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>{t("add_stock_piece_modal.name")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("add_stock_piece_modal.reference")}</label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("add_stock_piece_modal.category")}</label>
            <input
              type="text"
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("add_stock_piece_modal.unit_price")}</label>
            <input
              type="number"
              name="prxUnitaire"
              value={formData.prxUnitaire}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("add_stock_piece_modal.quantity")}</label>
            <input
              type="number"
              name="quantite"
              value={formData.quantite}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("add_stock_piece_modal.image")} (URL)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
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