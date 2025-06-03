// services/calendarService.tsx
import axios from "axios";

export type Task = {
  id: number;
  description: string;
  statut: string;
  date_debut: string;
  date_fin?: string;
  technicien: number;
  assigned_to?: number;
  schedule: number;
  isAI?: boolean;
  priority: string;
};

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/",
  withCredentials: true,
});

const calendarService = {
  getTasks: async (): Promise<Task[]> => {
    try {
      const res = await API.get<Task[]>("/taches/");
      return res.data;
    } catch (err) {
      console.error("فشل في جلب المهام", err);
      return [];
    }
  },

  addTask: async (task: Omit<Task, 'id'>): Promise<Task | null> => {
    try {
      const res = await API.post<Task>("/taches/", task);
      return res.data;
    } catch (err) {
      console.error("فشل في إضافة المهمة", err);
      return null;
    }
  },

  deleteTask: async (id: number): Promise<boolean> => {
    try {
      await API.delete(`/taches/${id}/`);
      return true;
    } catch (err) {
      console.error("فشل في حذف المهمة", err);
      return false;
    }
  },

  updateTask: async (id: number, task: Partial<Task>): Promise<Task | null> => {
    try {
      const res = await API.patch<Task>(`/taches/${id}/`, task);
      return res.data;
    } catch (err) {
      console.error("فشل في تعديل المهمة", err);
      return null;
    }
  },

  accomplishTask: async (id: number): Promise<boolean> => {
    try {
      await API.post(`/taches/${id}/accomplir/`);
      return true;
    } catch (err) {
      console.error("فشل في إتمام المهمة", err);
      return false;
    }
  },

  getAITasks: async (): Promise<Task[]> => {
    try {
      const res = await API.get<Task[]>("/taches/", {
        params: { isAI: true },
      });
      return res.data;
    } catch (err) {
      console.error("فشل في جلب مهام الذكاء الاصطناعي", err);
      return [];
    }
  },

  getUrgentTasks: async (): Promise<Task[]> => {
    try {
      const res = await API.get<Task[]>("/taches/", {
        params: { priority: 'urgent' },
      });
      return res.data;
    } catch (err) {
      console.error("فشل في جلب المهام العاجلة", err);
      return [];
    }
  },
};

export default calendarService;