"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Rapper.module.css";

const Rapport = () => {
  const [role, setRole] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  const router = useRouter();


  return (
    <div className={styles.body}>
    <form>
      <div className={styles.rapportContainer}>
        <div className={styles.inputRow}>
          <input
            type="text"
            className={styles.inputText}
            value={currentDate}
            readOnly
          />
        </div>
        <div className={styles.inputRow}>
          <input
            type="text"
            className={styles.inputText}
            placeholder="Type de rapport..."
          />
        </div>
        <textarea
          className={styles.textarea}
          placeholder="Description de rapport.............................................."
        ></textarea>
        <div className={styles.footer}>
          <button type="submit" className={styles.submitButton}>
            Envoyer
          </button>
        </div>
      </div>
    </form>
    </div>
  );
};

export default Rapport;
