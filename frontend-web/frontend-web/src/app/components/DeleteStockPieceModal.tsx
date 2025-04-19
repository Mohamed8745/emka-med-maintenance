"use client";

import React, { useState } from "react";
import styles from "../styles/delete.module.css";
import { useTranslation } from "next-i18next";

interface DeleteStockPieceModalProps {
  onClose: () => void;
  onDelete: () => Promise<void>;
  pieceName: string;
  stockPieceId: string;
}

const DeleteStockPieceModal: React.FC<DeleteStockPieceModalProps> = ({ onClose, onDelete, pieceName, stockPieceId }) => {
  const { t } = useTranslation("common");
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const isConfirmed = (): boolean => {
    const parts = inputValue.trim().split(" ");
    const matches = parts.filter((word) => word === pieceName);
    return matches.length === 4;
  };

  const handleDelete = async () => {
    if (!isConfirmed()) return;
    setIsLoading(true);
    try {
      await onDelete();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.warningTitle}>{t("delete_stock_piece_modal.title")}</h2>
        <p className={styles.warningText}>
          {t("delete_stock_piece_modal.confirm_message")}
          <br />
          {t("delete_stock_piece_modal.warning_message")}
          <br />
          {t("delete_stock_piece_modal.confirm_prompt")}
          <br />
          <strong>{t("delete_stock_piece_modal.type_instruction")}</strong>
          <br />
          <span className={styles.noteText}>{t("delete_stock_piece_modal.space_note")}</span>
        </p>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={t("delete_stock_piece_modal.placeholder")}
          className={styles.deleteInput}
        />
        <div className={styles.modalButtons}>
          <button
            onClick={handleDelete}
            className={styles.deleteBtn}
            disabled={!isConfirmed() || isLoading}
            title={t("delete_stock_piece_modal.input_title")}
          >
            {isLoading ? t("delete_stock_piece_modal.delete_loading") : t("delete_stock_piece_modal.delete_button")}
          </button>
          <button
            onClick={onClose}
            className={styles.cancelBtn}
            disabled={isLoading}
          >
            {t("delete_stock_piece_modal.cancel_button")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStockPieceModal;