"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Rapper.module.css";

const Rapport = () => {
  const [role, setRole] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/user");
        const data = await res.json();
        setRole(data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setCurrentDate(formattedDate);

    fetchUserRole();
  }, []);

  if (!role) return <p>Loading...</p>;

  return (
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
  );
};

export default Rapport;
