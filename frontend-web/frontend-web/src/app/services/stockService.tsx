import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/",
  withCredentials: true, // يدعم الـ JWT في HttpOnly cookies
});

const stockService = {
  getStocks: async () => {
    try {
      const res = await API.get("/stocks/");
      return res.data;
    } catch (err) {
      console.error("فشل في جلب المخازن", err);
      return null;
    }
  },

  addStock: async (data: Record<string, any>) => {
    try {
      const res = await API.post("/stocks/", data);
      return res.data;
    } catch (err) {
      console.error("فشل في إضافة المخزن", err);
      return null;
    }
  },

  updateStock: async (id: number, data: Record<string, any>) => {
    try {
      const res = await API.put(`/stocks/${id}/`, data);
      return res.data;
    } catch (err) {
      console.error("فشل في تحديث المخزن", err);
      return null;
    }
  },

  deleteStock: async (id: number) => {
    try {
      const res = await API.delete(`/stocks/${id}/`);
      return res.data;
    } catch (err) {
      console.error("فشل في حذف المخزن", err);
      return null;
    }
  },

  // يمكن إضافة خدمات أخرى لاحقًا
};

export default stockService;
