"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableElementRef = useRef<HTMLInputElement>(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError(null); // Clear error on input change
  };

  // Simplified confirmation: type the piece name once
  const isConfirmed = (): boolean => {
    const parts = inputValue.trim().toLowerCase().split(/\s+/);
    const matches = parts.filter((word) => word === pieceName.toLowerCase());
    return matches.length === 4; // Require typing the name twice
  };

  // Handle deletion with error handling
  const handleDelete = async () => {
    if (!isConfirmed()) return;
    setIsLoading(true);
    setError(null);
    try {
      await onDelete();
      onClose(); // Close modal on success
    } catch (err: any) {
      setError(t("delete_stock_piece_modal.delete_error") + (err.message ? `: ${err.message}` : ""));
    } finally {
      setIsLoading(false);
    }
  };

  // Focus trapping for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements) return;
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Set focus to the first focusable element on mount
    firstFocusableElementRef.current?.focus();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={styles.modalOverlay} role="dialog" aria-labelledby="delete-modal-title" aria-modal="true">
      <div className={styles.modal} ref={modalRef}>
        <h2 id="delete-modal-title" className={styles.warningTitle}>
          {t("delete_stock_piece_modal.title")}
        </h2>
        <p className={styles.warningText}>
          {t("delete_stock_piece_modal.confirm_message", { pieceName })}
          <br />
          {t("delete_stock_piece_modal.warning_message")}
          <br />
          {t("delete_stock_piece_modal.confirm_prompt", { pieceName })}
          <br />
          <strong>{t("delete_stock_piece_modal.type_instruction", { pieceName })}</strong>
        </p>
        {error && <div className={styles.error} role="alert">{error}</div>}
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={t("delete_stock_piece_modal.placeholder", { pieceName })}
          className={styles.deleteInput}
          aria-label={t("delete_stock_piece_modal.input_aria_label", { pieceName })}
          ref={firstFocusableElementRef}
          disabled={isLoading}
        />
        {!isConfirmed() && inputValue.length > 0 && (
          <p className={styles.validationMessage}>
            {t("delete_stock_piece_modal.validation_message", { pieceName })}
          </p>
        )}
        <div className={styles.modalButtons}>
          <button
            onClick={handleDelete}
            className={styles.deleteBtn}
            disabled={!isConfirmed() || isLoading}
            aria-disabled={!isConfirmed() || isLoading}
            title={t("delete_stock_piece_modal.input_title")}
          >
            {isLoading ? t("delete_stock_piece_modal.delete_loading") : t("delete_stock_piece_modal.delete_button")}
          </button>
          <button
            onClick={onClose}
            className={styles.cancelBtn}
            disabled={isLoading}
            aria-disabled={isLoading}
          >
            {t("delete_stock_piece_modal.cancel_button")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStockPieceModal;