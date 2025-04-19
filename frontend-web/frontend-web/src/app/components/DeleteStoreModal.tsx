"use client";

import React, { useState } from "react";
import styles from "../styles/delete.module.css";
import stockService from "../services/stockService";
import { useTranslation } from "next-i18next";

interface DeleteStoreModalProps {
  onClose: () => void;
  onDelete: () => void;
  storeName: string;
  stockId: number;
}

const DeleteStoreModal: React.FC<DeleteStoreModalProps> = ({
  onClose,
  onDelete,
  storeName,
  stockId,
}) => {
  const { t } = useTranslation("common");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const isConfirmed = () => {
    const parts = inputValue.trim().split(" ");
    const matches = parts.filter((word) => word === storeName);
    return matches.length === 4;
  };

  const handleDelete = async () => {
    if (!isConfirmed()) return;
    setIsLoading(true);
    const result = await stockService.deleteStock(stockId);
    setIsLoading(false);
    if (result !== null) {
      onDelete();
      onClose();
    } else {
      alert(t("delete_store_modal.error_failed"));
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.warningTitle}>{t("delete_store_modal.title")}</h2>
        <p className={styles.warningText}>
          {t("delete_store_modal.confirm_message")}
          <br />
          {t("delete_store_modal.warning_message")}
          <br />
          {t("delete_store_modal.confirm_prompt")}
          <br />
          <strong>{t("delete_store_modal.type_instruction")}</strong>
          <br />
          <span className={styles.noteText}>{t("delete_store_modal.space_note")}</span>
        </p>

        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={t("delete_store_modal.placeholder")}
          className={styles.deleteInput}
        />

        <div className={styles.modalButtons}>
          <button
            onClick={handleDelete}
            className={styles.deleteBtn}
            disabled={!isConfirmed() || isLoading}
            title={t("delete_store_modal.input_title")}
          >
            {isLoading ? t("delete_store_modal.delete_loading") : t("delete_store_modal.delete_button")}
          </button>
          <button
            onClick={onClose}
            className={styles.cancelBtn}
            disabled={isLoading}
          >
            {t("delete_store_modal.cancel_button")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStoreModal;