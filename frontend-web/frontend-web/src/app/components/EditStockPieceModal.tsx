"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/AddStockModal.module.css";
import { useTranslation } from "next-i18next";

interface StockPiece {
  name: string;
  reference: string;
  categorie: string;
  prxUnitaire: number;
  quantite: number;
  images?: string[];
}

interface EditStockPieceModalProps {
  onClose: () => void;
  onSubmit: (formData: {
    name: string;
    reference: string;
    categorie: string;
    prxUnitaire: number;
    quantite: number;
    files?: File[];
    images?: string[];
  }) => Promise<void>;
  stockId: string;
  stockPiece: StockPiece;
}

const EditStockPieceModal: React.FC<EditStockPieceModalProps> = ({ onClose, onSubmit, stockId, stockPiece }) => {
  const { t } = useTranslation("common");
  const [formData, setFormData] = useState<{
    name: string;
    reference: string;
    categorie: string;
    prxUnitaire: number;
    quantite: number;
    files: File[];
    images: string[];
  }>({
    name: stockPiece.name || "",
    reference: stockPiece.reference || "",
    categorie: stockPiece.categorie || "",
    prxUnitaire: stockPiece.prxUnitaire || 0,
    quantite: stockPiece.quantite || 0,
    files: [],
    images: stockPiece.images || [],
  });
  const [fileError, setFileError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for current image index
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableElementRef = useRef<HTMLInputElement>(null);

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

    firstFocusableElementRef.current?.focus();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "prxUnitaire" || name === "quantite" ? Number(value) : value,
    }));
    setFormError(null);
    setFileError(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      let hasError = false;

      for (const file of newFiles) {
        if (!validImageTypes.includes(file.type)) {
          setFileError(t("edit_stock_piece_modal.invalid_image_type"));
          hasError = true;
          break;
        }
        if (file.size > maxSize) {
          setFileError(t("edit_stock_piece_modal.image_too_large"));
          hasError = true;
          break;
        }
        const isValidImage = await new Promise<boolean>((resolve) => {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          img.onload = () => {
            URL.revokeObjectURL(img.src);
            resolve(true);
          };
          img.onerror = () => {
            URL.revokeObjectURL(img.src);
            resolve(false);
          };
        });

        if (!isValidImage) {
          setFileError(t("edit_stock_piece_modal.invalid_image"));
          hasError = true;
          break;
        }
      }

      if (!hasError) {
        setFileError(null);
        setFormData((prev) => ({
          ...prev,
          files: [...prev.files, ...newFiles],
        }));
      }
    }
  };

  const handleRemoveImage = (index: number, type: "file" | "url") => {
    if (type === "file") {
      setFormData((prev) => {
        const newFiles = [...prev.files];
        newFiles.splice(index, 1);
        return { ...prev, files: newFiles };
      });
    } else {
      setFormData((prev) => {
        const newImages = [...prev.images];
        newImages.splice(index, 1);
        return { ...prev, images: newImages };
      });
    }
    // Adjust currentImageIndex if necessary
    if (index <= currentImageIndex) {
      setCurrentImageIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => Math.min(prev + 1, allImages.length - 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFileError(null);

    if (!formData.name.trim()) {
      setFormError(t("edit_stock_piece_modal.name_required"));
      setIsSubmitting(false);
      return;
    }
    if (!formData.reference.trim()) {
      setFormError(t("edit_stock_piece_modal.reference_required"));
      setIsSubmitting(false);
      return;
    }
    if (!formData.categorie.trim()) {
      setFormError(t("edit_stock_piece_modal.category_required"));
      setIsSubmitting(false);
      return;
    }
    if (formData.prxUnitaire <= 0) {
      setFormError(t("edit_stock_piece_modal.unit_price_error"));
      setIsSubmitting(false);
      return;
    }
    if (formData.quantite <= 0) {
      setFormError(t("edit_stock_piece_modal.quantity_error"));
      setIsSubmitting(false);
      return;
    }

    try {
      const dataToSubmit = {
        name: formData.name,
        reference: formData.reference,
        categorie: formData.categorie,
        prxUnitaire: formData.prxUnitaire,
        quantite: formData.quantite,
        files: formData.files.length > 0 ? formData.files : undefined,
        images: formData.files.length > 0 ? [] : formData.images.length > 0 ? formData.images : [],
      };
      console.log("Submitting form data:", dataToSubmit);
      await onSubmit(dataToSubmit);
      onClose();
    } catch (err: any) {
      setFormError(err.message || t("edit_stock_piece_modal.submit_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const allImages = [
    ...formData.images.map((url) => ({ type: "url" as const, src: url })),
    ...formData.files.map((file) => ({ type: "file" as const, src: URL.createObjectURL(file) })),
  ];

  return (
    <div className={styles.modalOverlay} role="dialog" aria-labelledby="edit-modal-title" aria-modal="true">
      <div className={styles.modal} ref={modalRef}>
        <h2 id="edit-modal-title" className={styles.title}>
          {t("edit_stock_piece_modal.title")}
        </h2>
        {(formError || fileError) && (
          <div className={styles.error} role="alert">
            {formError || fileError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="name">
              {t("edit_stock_piece_modal.name")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              className={styles.formInput}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              ref={firstFocusableElementRef}
              aria-invalid={!!formError && !formData.name.trim()}
              aria-describedby={!!formError && !formData.name.trim() ? "name-error" : undefined}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="reference">
              {t("edit_stock_piece_modal.reference")}
            </label>
            <input
              type="text"
              id="reference"
              name="reference"
              value={formData.reference}
              className={styles.formInput}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              aria-invalid={!!formError && !formData.reference.trim()}
              aria-describedby={!!formError && !formData.reference.trim() ? "reference-error" : undefined}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="categorie">
              {t("edit_stock_piece_modal.category")}
            </label>
            <input
              type="text"
              id="categorie"
              name="categorie"
              value={formData.categorie}
              className={styles.formInput}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              aria-invalid={!!formError && !formData.categorie.trim()}
              aria-describedby={!!formError && !formData.categorie.trim() ? "category-error" : undefined}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="prxUnitaire">
              {t("edit_stock_piece_modal.unit_price")}
            </label>
            <input
              type="number"
              id="prxUnitaire"
              name="prxUnitaire"
              value={formData.prxUnitaire}
              className={styles.formInput}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
              disabled={isSubmitting}
              aria-invalid={!!formError && formData.prxUnitaire <= 0}
              aria-describedby={!!formError && formData.prxUnitaire <= 0 ? "unit-price-error" : undefined}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="quantite">
              {t("edit_stock_piece_modal.quantity")}
            </label>
            <input
              type="number"
              id="quantite"
              name="quantite"
              value={formData.quantite}
              className={styles.formInput}
              onChange={handleChange}
              min="1"
              required
              disabled={isSubmitting}
              aria-invalid={!!formError && formData.quantite <= 0}
              aria-describedby={!!formError && formData.quantite <= 0 ? "quantity-error" : undefined}
            />
          </div>

          <div className={styles.contentFile}>
            <div className={styles.contentFile1}>
              <div className={styles.file}>
                <label htmlFor="images">{t("edit_stock_piece_modal.image")}</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  className={styles.img}
                  onChange={handleImageChange}
                  accept="image/jpeg,image/png,image/gif"
                  multiple
                  disabled={isSubmitting}
                />
              </div>
              <span className={styles.imageNote}>
                {t("edit_stock_piece_modal.image_note")}
              </span>
            </div>
            {allImages.length > 0 && (
              <div className={styles.imageGallery}>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={handlePrevImage}
                  disabled={currentImageIndex === 0}
                  aria-label={t("edit_stock_piece_modal.prev_image")}
                >
                  {"<"}
                </button>
                <div className={styles.imageContainer}>
                  <div className={styles.imagePreview}>
                    <img
                      src={allImages[currentImageIndex].src}
                      alt={`${allImages[currentImageIndex].type === "url" ? "Existing" : "New"} image ${currentImageIndex + 1}`}
                      className={styles.previewImage}
                      onLoad={(e) => {
                        if (allImages[currentImageIndex].type === "file") URL.revokeObjectURL(e.currentTarget.src);
                      }}
                    />
                    <button
                      type="button"
                      className={styles.removeImageBtn}
                      onClick={() => handleRemoveImage(currentImageIndex, allImages[currentImageIndex].type)}
                      disabled={isSubmitting}
                      aria-label={t("edit_stock_piece_modal.remove_image", { index: currentImageIndex + 1 })}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={handleNextImage}
                  disabled={currentImageIndex === allImages.length - 1}
                  aria-label={t("edit_stock_piece_modal.next_image")}
                >
                  {">"}
                </button>
              </div>
            )}
          </div>

          <div className={styles.modalButtons}>
            <button
              type="submit"
              className={styles.addBtn}
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? t("edit_stock_piece_modal.submitting") : t("edit_stock_piece_modal.save_button")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            >
              {t("edit_stock_piece_modal.cancel_button")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStockPieceModal;