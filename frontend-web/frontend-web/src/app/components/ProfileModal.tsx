"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/profil.module.css"; // استيراد ملف CSS

interface ProfileModalProps {
  user: {
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
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [updatedUser, setUpdatedUser] = useState(user);
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
      setNewImage(e.target.files[0]);
    }
  };

  const handleSaveImage = () => {
    if (newImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setUpdatedUser({ ...updatedUser, image: reader.result as string });
        setIsEditingImage(false);
      };
      reader.readAsDataURL(newImage);
    }
  };

  const handleSave = () => {
    onSave(updatedUser);
  };

  return (
    <div className={styles.modal} style={{ left: pos.x, top: pos.y }}>
      <div className={styles.modalHeader} onMouseDown={handleMouseDown}>
        <span>👤 Profile User</span>
        <button onClick={onClose}>✖</button>
      </div>
     
      <div className={styles.modalContent}>
      <div className={styles.imtx}>
        {/* صورة المستخدم */}
        <div
          className={styles.userImageContainer}
          onMouseEnter={() => setIsEditingImage(true)}
          onMouseLeave={() => setIsEditingImage(false)}
        >
          <img
            src={updatedUser.image || "/default-avatar.png"}
            alt="User Avatar"
            className={styles.userImage}
          />
          {isEditingImage && (
            <span className={styles.userImageOverlay}>Edit</span>
          )}
          {isEditingImage && (
            <input
              type="file"
              accept="image/*"
              className={styles.userImageInput}
              onChange={handleImageChange}
            />
          )}
        </div>
        <div>
        <div className={styles.txt}>
          <p><strong>Username:</strong> {updatedUser.username}</p>
          <p><strong>Role:</strong> {updatedUser.role}</p>
        </div>
        </div>
        </div>

        {/* الحقول القابلة للتحرير */}
        <div style={{ display: "flex", gap: "-10px", marginBottom: "10px", width: "100%", marginRight:"0px" }}>
          <input
            type="text"
            value={updatedUser.first_name}
            onChange={(e) => setUpdatedUser({ ...updatedUser, first_name: e.target.value })}
            placeholder="First Name"
            className={styles.inputField}
            style={{ width: "100%"}}
          />
          <input
            type="text"
            value={updatedUser.last_name}
            onChange={(e) => setUpdatedUser({ ...updatedUser, last_name: e.target.value })}
            placeholder="Last Name"
            className={styles.inputField}
            style={{ width: "100%", margin: "0 20px"
            }}
          />
        </div>
        <input
          type="email"
          value={updatedUser.email}
          onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
          placeholder="Email"
          className={styles.inputField}
        />
        <input
          type="text"
          value={updatedUser.numidentif}
          onChange={(e) => setUpdatedUser({ ...updatedUser, numidentif: e.target.value })}
          placeholder="Num Identif"
          className={styles.inputField}
        />
        <input
          type="text"
          value={updatedUser.numtel}
          onChange={(e) => setUpdatedUser({ ...updatedUser, numtel: e.target.value })}
          placeholder="Num Tel"
          className={styles.inputField}
        />

        {/* زر الحفظ */}
        <button onClick={handleSave} className={styles.saveButton}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
