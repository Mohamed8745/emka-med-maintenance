"use client";
import { useState, FormEvent } from "react";
import styles from "../../styles/TechniForm.module.css"; 

const techniForm = () => {
  // الحالة (state) لكل مدخل من مدخلات النموذج
  const [description, setDescription] = useState("Remplacer le filtre d'huile");
  const [showAI, setShowAI] = useState(false);
  const [technicien, setTechnicien] = useState("Jean Dupont");
  const [dateDebut, setDateDebut] = useState("2025-04-10");
  const [dateFin, setDateFin] = useState("2025-04-12");
  const [assignedTo, setAssignedTo] = useState("Jean Dupont");
  const [statut, setStatut] = useState("En cours");

  // عند الضغط على زر "Enregistrer"
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        technicien,
        dateDebut,
        dateFin,
        assignedTo,
        statut,
      }),
    });

    if (res.ok) {
      alert("تم حفظ المهمة بنجاح");
    } else {
      alert("حدث خطأ أثناء حفظ المهمة");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles["tache-form"]}>
      {/* عنوان النموذج */}
      <div className={styles.header}>
        <h2>Modifier une Tâche</h2>
      </div>

      {/* وصف المهمة */}
      <div className={styles["form-group"]}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          required
          autoComplete="off"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className={styles["ai-toggle-container"]}>
  {!showAI ? (
    <button
      type="button"
      className={styles["ai-button"]}
      onClick={() => setShowAI(true)}
    >
      Analyses IA
    </button>
  ) : (
    <div className={styles["ai-placeholder"]}></div>
  )}
</div>

      {/* التقني المسؤول */}
      <div className={styles["form-group"]}>
        <label htmlFor="technicien">Technicien responsable</label>
        <input
          type="text"
          id="technicien"
          name="technicien"
          required
          autoComplete="name"
          value={technicien}
          onChange={(e) => setTechnicien(e.target.value)}
        />
      </div>

      {/* تاريخ البداية */}
      <div className={styles["form-group"]}>
        <label htmlFor="dateDebut">Date de début</label>
        <input
          type="date"
          id="dateDebut"
          name="dateDebut"
          required
          value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)}
        />
      </div>

      {/* تاريخ الانتهاء */}
      <div className={styles["form-group"]}>
        <label htmlFor="dateFin">Date de fin</label>
        <input
          type="date"
          id="dateFin"
          name="dateFin"
          required
          value={dateFin}
          onChange={(e) => setDateFin(e.target.value)}
        />
      </div>

      {/* اسم التقني المُكلف */}
      <div className={styles["form-group"]}>
        <label htmlFor="assigne">Assigné à</label>
        <input
          type="text"
          id="assigne"
          name="assigne"
          required
          autoComplete="name"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />
      </div>

      {/* الحالة */}
      <div className={styles["form-group1"]}>
        <label htmlFor="statut">Statut</label>
        <select
          id="statut"
          name="statut"
          required
          value={statut}
          onChange={(e) => setStatut(e.target.value)}
        >
          <option value="En attente">En attente</option>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
        </select>
      </div>

      {/* زر الحفظ */}
      <div className={styles.footer}>
        <button type="submit">
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default techniForm;
