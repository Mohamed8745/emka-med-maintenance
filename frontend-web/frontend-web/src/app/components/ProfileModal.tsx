"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/profil.module.css"; // استيراد ملف CSS
import { updateUser } from "../services/authService";
import getCookie from "../utils/getCookie";
import { useTranslation } from "next-i18next"; // استيراد الترجمة

interface ProfileModalProps {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    role: string;
    username: string;
    email: string;
    numidentif: string;
    numtel: string;
    image?: string | null;
  };
  onClose: () => void;
  onSave: (updatedUser: any) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onSave }) => {
  const { t } = useTranslation("common"); // استخدام الترجمة من ملف common.json
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [originalUser, setOriginalUser] = useState(user);
  const [updatedUser, setUpdatedUser] = useState({ ...user, id: user.id });
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file); // Save the new image to state
    }
  };

  const handleSave = async () => {
    console.log("Attempting to save:", updatedUser); // ✅ للمتابعة
    try {
      const formData = new FormData();

      // إرسال الحقول التي تم تعديلها فقط
      if (updatedUser.first_name !== originalUser.first_name) {
        formData.append("first_name", updatedUser.first_name);
      }

      if (updatedUser.last_name !== originalUser.last_name) {
        formData.append("last_name", updatedUser.last_name);
      }

      if (updatedUser.email !== originalUser.email) {
        formData.append("email", updatedUser.email);
      }

      if (updatedUser.numidentif !== originalUser.numidentif) {
        formData.append("numidentif", updatedUser.numidentif);
      }

      if (updatedUser.numtel !== originalUser.numtel) {
        formData.append("numtel", updatedUser.numtel);
      }

      // إرسال الصورة فقط إذا كانت موجودة
      if (newImage) {
        formData.append("image", newImage);
      }

      // استدعاء وظيفة التحديث
      const data = await updateUser(updatedUser, formData);
      const safeData = { ...data, id: updatedUser.id || user.id };
      setUpdatedUser(safeData);
      setOriginalUser(safeData);
      onSave(safeData);
      onClose();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className={styles.modal} style={{ left: pos.x, top: pos.y }}>
      <div className={styles.modalHeader} onMouseDown={handleMouseDown}>
        <span>👤 {t("profile.profile_user")}</span> {/* ترجمة عنوان النافذة */}
        <button onClick={onClose}>✖</button>
      </div>

      <div className={styles.modalContent}>
        <div className={styles.imtx}>
          {/* صورة المستخدم */}
          <div
            className={styles.userImageContainer}
            onClick={() => document.getElementById("imageUpload")?.click()} // Trigger file input click
          >
            <img
              src={updatedUser.image || "/default-avatar.png"}
              alt={t("profile.user_avatar")} // ترجمة النص البديل للصورة
              className={styles.userImage}
            />
            <span className={styles.userImageOverlay}>{t("profile.edit")}</span> {/* ترجمة كلمة Edit */}
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              style={{ display: "none" }} // Hide the file input
              onChange={handleImageChange} // Handle image upload
            />
          </div>
          <div>
            <div className={styles.txt}>
              <p>
                <strong>{t("profile.username")}:</strong> {updatedUser.username}
              </p>
              <p>
                <strong>{t("profile.role")}:</strong> {updatedUser.role}
              </p>
            </div>
          </div>
        </div>

        {/* الحقول القابلة للتحرير */}
        <div style={{ display: "flex", gap: "-10px", marginBottom: "10px", width: "100%", marginRight: "0px" }}>
          <input
            type="text"
            value={updatedUser.first_name}
            onChange={(e) => setUpdatedUser({ ...updatedUser, first_name: e.target.value })}
            placeholder={t("profile.first_name")} // ترجمة النص داخل الحقل
            className={styles.inputField}
            style={{ width: "100%" }}
          />
          <input
            type="text"
            value={updatedUser.last_name}
            onChange={(e) => setUpdatedUser({ ...updatedUser, last_name: e.target.value })}
            placeholder={t("profile.last_name")} // ترجمة النص داخل الحقل
            className={styles.inputField}
            style={{ width: "100%", margin: "0 20px" }}
          />
        </div>
        <input
          type="email"
          value={updatedUser.email}
          onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
          placeholder={t("profile.email")} // ترجمة النص داخل الحقل
          className={styles.inputField}
        />
        <input
          type="text"
          value={updatedUser.numidentif}
          onChange={(e) => setUpdatedUser({ ...updatedUser, numidentif: e.target.value })}
          placeholder={t("profile.num_identif")} // ترجمة النص داخل الحقل
          className={styles.inputField}
        />
        <input
          type="text"
          value={updatedUser.numtel}
          onChange={(e) => setUpdatedUser({ ...updatedUser, numtel: e.target.value })}
          placeholder={t("profile.num_tel")} // ترجمة النص داخل الحقل
          className={styles.inputField}
        />

        {/* زر الحفظ */}
        <button onClick={handleSave} className={styles.saveButton}>
          {t("profile.save")} {/* ترجمة النص داخل الزر */}
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
