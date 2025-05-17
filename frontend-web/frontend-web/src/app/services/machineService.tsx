// services/machineService.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/",
  withCredentials: true,
});

// Define the Machine type to match your frontend
type Machine = {
  id: number;
  name: string;
  type: string;
  status: string;
  image: string;
  lastMaintenance: string;
};

const machineService = {
  getAll: async (): Promise<Machine[]> => {
    try {
      const res = await API.get<Machine[]>("/machines/");
      return res.data;
    } catch (err) {
      console.error("Failed to fetch machines", err);
      return [];
    }
  },

  getById: async (id: number): Promise<Machine | null> => {
    try {
      const res = await API.get<Machine>(`/machines/${id}/`);
      return res.data;
    } catch (err) {
      console.error(`Failed to fetch machine with ID ${id}`, err);
      return null;
    }
  },

  create: async (data: FormData): Promise<Machine | null> => {
    try {
      const res = await API.post<Machine>("/machines/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      console.error("Failed to create machine", err);
      return null;
    }
  },

  update: async (id: number, data: FormData): Promise<Machine | null> => {
    try {
      const res = await API.put<Machine>(`/machines/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      console.error(`Failed to update machine with ID ${id}`, err);
      return null;
    }
  },

  delete: async (id: number): Promise<boolean> => {
    try {
      await API.delete(`/machines/${id}/`);
      return true;
    } catch (err) {
      console.error(`Failed to delete machine with ID ${id}`, err);
      return false;
    }
  },
};

export default machineService;