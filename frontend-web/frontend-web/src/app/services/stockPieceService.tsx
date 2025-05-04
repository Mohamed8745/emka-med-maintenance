import axios from "axios";

// Define or import the StockPiece type
interface StockPiece {
  id: string;
  name: string;
  reference: string;
  categorie: string;
  prxUnitaire: number;
  quantite: number;
  stock: string;
}

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/",
  withCredentials: true, // Supports JWT in HttpOnly cookies
});

const stockPieceService = {
  /*
  getStockPieces: async (stockId: string): Promise<StockPiece[]> => {
    const response = await API.get(`/stockpieces/?stock=${stockId}`);
    return response.data as StockPiece[];
  },*/
   
  getStockPieces: async (stockId: string) => {
    try {
      const response = await API.get(`/stockpieces/?stock=${stockId}`);
      console.log("Response data:", response.data);

      
      if (response.data && typeof response.data === "object") {
        for (let [key, value] of Object.entries(response.data as Record<string, unknown>)) {
          console.log(`${key}: ${value}`);
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching stock pieces:", error);
      throw error;
    }
  },

  addStockPiece: async (formData: FormData) => {
    const response = await API.post(`/pieces/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  // Add a new piece to stock (creates both PieceDeRechange and StockPiece)
  /*
  addStockPiece: async (formData: {
    name: string;
    reference: string;
    categorie: string;
    prxUnitaire: number;
    quantite: number;
    files?: File[];
    stock: string;
  }) => {
    try {
      // Validate required fields before sending
      if (!formData.name || !formData.reference || !formData.categorie) {
        throw new Error("Name, reference, and category are required.");
      }
      if (formData.prxUnitaire <= 0) {
        throw new Error("Unit price must be greater than 0.");
      }
      if (formData.quantite <= 0) {
        throw new Error("Quantity must be greater than 0.");
      }
      if (!formData.stock) {
        throw new Error("Stock ID is required.");
      }

      const data = new FormData();
      data.append("name", formData.name);
      data.append("reference", formData.reference);
      data.append("categorie", formData.categorie);
      data.append("prxUnitaire", String(formData.prxUnitaire));
      data.append("quantite", String(formData.quantite));
      data.append("stock_id", formData.stock);
      if (formData.files && formData.files.length > 0) {
        formData.files.forEach((file, index) => {
          data.append(`images[${index}]`, file);
        });
      }

      // Log FormData for debugging
      for (let [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await API.post("/pieces/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error adding stock piece:", error);
      if (error.response) {
        console.error("Response data:", JSON.stringify(error.response.data, null, 2));
        console.error("Response status:", error.response.status);
        if (error.response.status === 400) {
          if (error.response.data.reference) {
            throw new Error("This reference already exists.");
          }
          if (error.response.data.stock_id) {
            throw new Error("Invalid stock ID. The specified stock does not exist.");
          }
          // Combine all other validation errors into a single message
          const errors = Object.entries(error.response.data)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
            .join("; ");
          throw new Error(errors || "Invalid data provided. Please check the form inputs.");
        }
        if (error.response.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        }
      }
      throw new Error(error.message || "An error occurred while adding the stock piece.");
    }
  },*/

  updateStockPiece: async (pieceId: string, updatedData: FormData) => {
    try {
      // Validate required fields before sending
      const name = updatedData.get("name") as string;
      const reference = updatedData.get("reference") as string;
      const categorie = updatedData.get("categorie") as string;
      const prxUnitaire = parseFloat(updatedData.get("prxUnitaire") as string);
      const quantite = parseInt(updatedData.get("quantite") as string);
  
      if (!name || !name.trim()) {
        throw new Error("Name is required and cannot be empty.");
      }
      if (!reference || !reference.trim()) {
        throw new Error("Reference is required and cannot be empty.");
      }
      if (!categorie || !categorie.trim()) {
        throw new Error("Category is required and cannot be empty.");
      }
      if (isNaN(prxUnitaire) || prxUnitaire <= 0) {
        throw new Error("Unit price must be greater than 0.");
      }
      if (isNaN(quantite) || quantite <= 0) {
        throw new Error("Quantity must be greater than 0.");
      }
  
      const imageEntries = Array.from(updatedData.entries()).filter(([key]) => key.startsWith("images["));
      for (const [key, value] of imageEntries) {
        const file = value as File;
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`Invalid file type for ${file.name}. Only JPEG, PNG, and GIF are allowed.`);
        }
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`);
        }
        const isValidImage = await new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = URL.createObjectURL(file);
        });
  
        if (!isValidImage) {
          throw new Error(`File ${file.name} is not a valid image or is corrupted.`);
        }
      }
  
      const response = await API.put(`/pieces/${pieceId}/`, updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("PUT response data:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating stock piece:", error);
    if (error.response) {
      console.error("Response data:", JSON.stringify(error.response.data, null, 2));
      console.error("Response status:", error.response.status);
      if (error.response.status === 400) {
        // Handle image-specific errors
        if (error.response.data.images) {
          const imageErrors = Object.entries(error.response.data.images)
            .map(([index, messages]) => `Image ${parseInt(index) + 1}: ${(messages as string[]).join(", ")}`)
            .join("; ");
          throw new Error(imageErrors);
        }
        const errors = Object.entries(error.response.data)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
          .join("; ");
        throw new Error(errors || "Invalid data provided. Please check the form inputs.");
      }
      if (error.response.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }
    }
    throw new Error(error.message || "An error occurred while updating the stock piece.");
  }
  },
  // Delete a piece (deletes both PieceDeRechange and StockPiece associations)
  deleteStockPiece: async (pieceId: string) => {
    const response = await API.delete(`/pieces/${pieceId}/`);
    return response.data;
  },
};


export default stockPieceService;