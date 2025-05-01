// services/tacheService.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/",
  withCredentials: true,
});

const tacheService = {
  ajouterTache: async (data: Record<string, any>) => {
    try {
      const res = await API.post("/taches/", data);
      return res.data;
    } catch (err) {
      console.error("Erreur lors de l'envoi de la tâche", err);
      return null;
    }
  },
};

export default tacheService;
