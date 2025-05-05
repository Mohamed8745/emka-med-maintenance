// services/rapportService.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/",
  withCredentials: true, // Pour envoyer les cookies (authentification via JWT)
});

const rapportService = {
  ajouterRapport: async (data: Record<string, any>) => {
    try {
      const res = await API.post("/rapports/", data);
      return res.data;
    } catch (err) {
      console.error("Échec de l'envoi du rapport", err);
      return null;
    }
  },

  getRapports: async () => {
    try {
      const res = await API.get("/rapports/");
      return res.data;
    } catch (err) {
      console.error("Échec de la récupération des rapports", err);
      return [];
    }
  },
};

export default rapportService;
