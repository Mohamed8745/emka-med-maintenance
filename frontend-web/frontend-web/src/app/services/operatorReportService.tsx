// services/operatorReportService.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  withCredentials: true,
});

const operatorReportService = {
  send: async (formData: FormData) => {
    try {
      const res = await API.post("/operator-reports/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      console.error("Échec de l'envoi du rapport:", error);
      return null;
    }
  },
};

export default operatorReportService;
