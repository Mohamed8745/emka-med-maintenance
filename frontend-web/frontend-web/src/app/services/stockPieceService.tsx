import axios from "axios";
const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/",
    withCredentials: true, // يدعم الـ JWT في HttpOnly cookies
  });

const stockPieceService = {
    getStockPieces: async (stockId: string) => {
        try {
            if (!stockId) {
                throw new Error("Stock ID is required");
            }
            const response = await API.get(`/stockpieces?stock=${stockId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching stock pieces:", error);
            throw error;
        }
    },

    addStockPiece: async (stockPieceData: Record<string, any>) => {
        try {
            const response = await API.post("/stockpieces/", stockPieceData);
            return response.data;
        } catch (error) {
            console.error("Error adding stock piece:", error);
            throw error;
        }
    },

    updateStockPiece: async (id: string, stockPieceData: Record<string, any>) => {
        try {
            const response = await API.put(`/stockpieces/${id}`, stockPieceData);
            return response.data;
        } catch (error) {
            console.error("Error updating stock piece:", error);
            throw error;
        }
    },

    deleteStockPiece: async (id: string) => {
        try {
            await API.delete(`/stockpieces/${id}`);
            return true;
        } catch (error) {
            console.error("Error deleting stock piece:", error);
            throw error;
        }
    },
};

export default stockPieceService;