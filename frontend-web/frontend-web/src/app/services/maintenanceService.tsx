import axios from "axios";
import { Machine, Schedule, Task } from "../types";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/",
});

const maintenanceService = {
  // جلب قائمة الآلات
  getMachines: async (): Promise<Machine[]> => {
    try {
      const res = await API.get<Machine[]>("/machines/");
      return res.data;
    } catch (err) {
      console.error("فشل في جلب الآلات", err);
      return [];
    }
  },

  // جلب جدول الصيانة
  getMaintenanceSchedule: async (): Promise<Schedule[]> => {
    try {
      const res = await API.get<Schedule[]>("/maintenance/");
      return res.data;
    } catch (err) {
      console.error("فشل في جلب جدول الصيانة", err);
      return [];
    }
  },

  // جلب المهام الجديدة
  getNewTasks: async (): Promise<Task[]> => {
    try {
      const res = await API.get<Task[]>("/tasks/");
      return res.data;
    } catch (err) {
      console.error("فشل في جلب المهام الجديدة", err);
      return [];
    }
  },

  // إضافة موعد صيانة جديد
  addMaintenance: async (data: Omit<Schedule, 'id'>): Promise<Schedule | null> => {
    try {
      const res = await API.post<Schedule>("/maintenance/", data);
      return res.data;
    } catch (err) {
      console.error("فشل في إضافة موعد الصيانة", err);
      return null;
    }
  },

  // حذف مهمة
  deleteTask: async (id: number): Promise<boolean> => {
    try {
      await API.delete(`/tasks/${id}/`);
      return true;
    } catch (err) {
      console.error("فشل في حذف المهمة", err);
      return false;
    }
  }
};

export default maintenanceService;