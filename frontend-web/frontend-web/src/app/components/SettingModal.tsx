"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/setting.module.css";

interface SettingModalProps {
  onClose: () => void;
}

const SettingModal: React.FC<SettingModalProps> = ({ onClose }) => {
  const [pos, setPos] = useState({ x: 200, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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

  return (
    <div className={styles.modal} style={{ left: pos.x, top: pos.y }}>
      <div className={styles.modalHeader} onMouseDown={handleMouseDown}>
        <span>⚙️ Setting App Web</span>
        <button onClick={onClose}>✖</button>
      </div>
      <div className={styles.modalContent}>
        <p>🔧 Paramètres d'affichage</p>
        <p>🌐 Langue, thème, notifications...</p>
      </div>
    </div>
  );
};

export default SettingModal;
