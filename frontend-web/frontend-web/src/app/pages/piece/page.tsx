// page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import AddStockPieceModal from "../../components/AddStockPieceModal";
import EditStockPieceModal from "../../components/EditStockPieceModal";
import DeleteStockPieceModal from "../../components/DeleteStockPieceModal";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import stockPieceService from "../../services/stockPieceService";
import styles from "../../styles/StockPiecePage.module.css";
import Header from "../../components/header";
import SearchBar from "../../components/searchbar";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { useSearchParams } from "next/navigation";

// مكون الفلاتر
const FilterBar: React.FC<{
  onFilter: (category: string, quantity: string) => void;
  onSort: (sortBy: string) => void;
}> = ({ onFilter, onSort }) => {
  const { t } = useTranslation("common");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sortBy, setSortBy] = useState("");

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    console.log("Category filter updated:", newCategory); // سجل لتتبع التغييرات
    onFilter(newCategory, quantity);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
    console.log("Quantity filter updated:", newQuantity); // سجل لتتبع التغييرات
    onFilter(category, newQuantity);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    console.log("Sort by updated:", newSortBy); // سجل لتتبع التغييرات
    onSort(newSortBy);
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <label>{t("stock_piece_page.filter_category")}</label>
        <input
          type="text"
          value={category}
          onChange={handleCategoryChange}
          placeholder={t("stock_piece_page.enter_category")}
        />
      </div>
      <div className={styles.filterGroup}>
        <label>{t("stock_piece_page.filter_quantity")}</label>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder={t("stock_piece_page.enter_quantity")}
          min="0"
        />
      </div>
      <div className={styles.filterGroup}>
        <label>{t("stock_piece_page.sort_by")}</label>
        <select value={sortBy} onChange={handleSortChange}>
          <option className={styles.option1} value="">{t("stock_piece_page.sort_default")}</option>
          <option className={styles.option1} value="price_asc">{t("stock_piece_page.sort_price_asc")}</option>
          <option className={styles.option1} value="price_desc">{t("stock_piece_page.sort_price_desc")}</option>
          <option className={styles.option1} value="quantity_asc">{t("stock_piece_page.sort_quantity_asc")}</option>
          <option className={styles.option1} value="quantity_desc">{t("stock_piece_page.sort_quantity_desc")}</option>
        </select>
      </div>
    </div>
  );
};

export interface StockPiece {
  id: string;
  piece: {
    id: string;
    name?: string;
    reference?: string;
    categorie?: string;
    prxUnitaire?: number;
    quantite: number;
    image_list?: { id: number; image: string }[];
    condition?: string;
  };
  quantite: number;
}

const StockPiecePage: React.FC = () => {
  const { t } = useTranslation("common");
  const searchParams = useSearchParams();
  const stockId = searchParams.get("stock") || "";

  const [stockPieces, setStockPieces] = useState<StockPiece[]>([]);
  const [filteredStockPieces, setFilteredStockPieces] = useState<StockPiece[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStockPiece, setSelectedStockPiece] = useState<StockPiece | null>(null);
  const [error, setError] = useState<string | null>(null);

  const BASE_MEDIA_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const DEFAULT_IMAGE = "/images/default-spare-part.png";

  useEffect(() => {
    if (!stockId) {
      console.error("Stock ID is missing");
      setError(t("stock_piece_page.errors.stock_id_missing"));
      return;
    }
    fetchStockPieces();
  }, [stockId, t]);

  const fetchStockPieces = async () => {
    try {
      const data = await stockPieceService.getStockPieces(stockId);
      if (Array.isArray(data) && data.every((item) => typeof item === "object" && "id" in item && "piece" in item && "quantite" in item)) {
        console.log("Fetched stock pieces:", JSON.stringify(data, null, 2));
        const enhancedData = data.map((item: StockPiece) => ({
          ...item,
          piece: {
            ...item.piece,
            condition: item.piece.condition || (Math.random() > 0.5 ? "New" : "Used"),
          },
        }));
        setStockPieces(enhancedData as StockPiece[]);
        setFilteredStockPieces(enhancedData as StockPiece[]);
        setError(null);
      } else {
        setError(t("stock_piece_page.error_fetch"));
      }
    } catch (error: any) {
      console.error(t("stock_piece_page.error_fetch"), error);
      setError(error.message || t("stock_piece_page.error_fetch"));
    }
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    console.log("Search term updated:", query);
    applyFiltersAndSort(query, filteredStockPieces);
  };

  const handleFilter = (category: string, quantity: string) => {
    console.log("Applying filters - Category:", category, "Quantity:", quantity);
    const filtered = stockPieces.filter((sp) => {
      const matchesCategory = category
        ? sp.piece.categorie?.toLowerCase().includes(category.toLowerCase())
        : true;
      const matchesQuantity = quantity
        ? sp.quantite >= parseInt(quantity, 10)
        : true;
      return matchesCategory && matchesQuantity;
    });
    setFilteredStockPieces(filtered);
    applyFiltersAndSort(searchTerm, filtered);
  };

  const handleSort = (sortBy: string) => {
    console.log("Sorting by:", sortBy);
    let sorted = [...filteredStockPieces];
    if (sortBy === "price_asc") {
      sorted.sort((a, b) => (a.piece.prxUnitaire || 0) - (b.piece.prxUnitaire || 0));
    } else if (sortBy === "price_desc") {
      sorted.sort((a, b) => (b.piece.prxUnitaire || 0) - (a.piece.prxUnitaire || 0));
    } else if (sortBy === "quantity_asc") {
      sorted.sort((a, b) => a.quantite - b.quantite);
    } else if (sortBy === "quantity_desc") {
      sorted.sort((a, b) => b.quantite - a.quantite);
    }
    setFilteredStockPieces(sorted);
    applyFiltersAndSort(searchTerm, sorted);
  };

  const applyFiltersAndSort = (term: string, pieces: StockPiece[]) => {
    const filtered = pieces.filter((sp) => {
      const name = sp.piece?.name?.toLowerCase() || "";
      const reference = sp.piece?.reference?.toLowerCase() || "";
      const search = term?.toLowerCase() || "";
      return name.includes(search) || reference.includes(search);
    });
    console.log("Filtered stock pieces after search:", filtered);
    setFilteredStockPieces(filtered);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setError(null);
  };

  const handleEdit = (stockPiece: StockPiece) => {
    setSelectedStockPiece(stockPiece);
    setIsEditing(true);
    setError(null);
  };

  const handleDelete = (stockPiece: StockPiece) => {
    setIsEditing(false);
    setSelectedStockPiece(stockPiece);
    setIsDeleting(true);
    setError(null);
  };

  interface StockPieceFormData {
    name: string;
    reference: string;
    categorie: string;
    prxUnitaire: number;
    quantite: number;
    files?: File[];
  }

  const handleAddSubmit = async (newStockPiece: StockPieceFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", newStockPiece.name);
      formData.append("reference", newStockPiece.reference);
      formData.append("categorie", newStockPiece.categorie);
      formData.append("prxUnitaire", newStockPiece.prxUnitaire.toString());
      formData.append("quantite", newStockPiece.quantite.toString());
      formData.append("stock_id", stockId);
      if (newStockPiece.files) {
        newStockPiece.files.forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      }

      await stockPieceService.addStockPiece(formData);
      await fetchStockPieces();
      setIsAdding(false);
      setError(null);
    } catch (error: any) {
      console.error(t("stock_piece_page.error_add"), error);
      setError(error.message || t("stock_piece_page.error_add"));
    }
  };

  const handleEditSubmit = async (updatedData: {
    name: string;
    reference: string;
    categorie: string;
    prxUnitaire: number;
    quantite: number;
    files?: File[];
    images?: string[];
  }) => {
    try {
      if (selectedStockPiece) {
        console.log("Received updated data in handleEditSubmit:", updatedData);
        const formData = new FormData();
        formData.append("name", updatedData.name);
        formData.append("reference", updatedData.reference);
        formData.append("categorie", updatedData.categorie);
        formData.append("prxUnitaire", updatedData.prxUnitaire.toString());
        formData.append("quantite", updatedData.quantite.toString());
        formData.append("stock_id", stockId);

        if (updatedData.files && updatedData.files.length > 0) {
          updatedData.files.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
          });
        } else if (updatedData.images && updatedData.images.length > 0) {
          updatedData.images.forEach((url, index) => {
            formData.append(`images[${index}]`, url);
          });
        }

        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

        const response = await stockPieceService.updateStockPiece(selectedStockPiece.piece.id, formData);
        console.log("Update response:", response);
        await fetchStockPieces();
        setIsEditing(false);
        setSelectedStockPiece(null);
        setError(null);
      }
    } catch (error: any) {
      console.error(t("stock_piece_page.error_update"), error);
      setError(error.message || t("stock_piece_page.error_update"));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedStockPiece) {
        await stockPieceService.deleteStockPiece(selectedStockPiece.piece.id);
        await fetchStockPieces();
        setIsDeleting(false);
        setSelectedStockPiece(null);
        setError(null);
      }
    } catch (error: any) {
      console.error(t("stock_piece_page.error_delete"), error);
      setError(error.message || t("stock_piece_page.error_delete"));
    }
  };

  const getImageUrl = (imagePath: string | null): string => {
    if (!imagePath) return DEFAULT_IMAGE;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${BASE_MEDIA_URL}${normalizedPath}`;
  };

  return (
    <>
      <ProtectedRoute>
        <Header>
          <SearchBar onSearch={handleSearch} />
        </Header>
      </ProtectedRoute>

      <div className={styles.content}>
        <h1 className={styles.title}>{t("stock_piece_page.title")}</h1>
        {error && <div className={styles.error}>{error}</div>}

        <FilterBar onFilter={handleFilter} onSort={handleSort} />

        <div className={styles.stockPiecesGrid}>
          {filteredStockPieces.length > 0 ? (
            filteredStockPieces.map((stockPiece) => (
              <div key={stockPiece.id} className={styles.stockPieceCard}>
                {stockPiece.piece.image_list && stockPiece.piece.image_list.length > 0 ? (
                  <img
                    src={getImageUrl(stockPiece.piece.image_list[0].image)}
                    alt={stockPiece.piece.name || "Spare Part"}
                    className={styles.stockPieceImage}
                    onError={(e) => {
                      console.error(`Failed to load image: ${stockPiece.piece.image_list?.[0]?.image}`);
                      e.currentTarget.src = DEFAULT_IMAGE;
                    }}
                  />
                ) : (
                  <img
                    src={DEFAULT_IMAGE}
                    alt="Default Spare Part"
                    className={styles.stockPieceImage}
                  />
                )}
                <h3 className={styles.stockPieceName}>{stockPiece.piece.name}</h3>
                <p className={styles.stockPieceInfo}>
                  {t("stock_piece_page.reference")}: {stockPiece.piece.reference}
                </p>
                <p className={styles.stockPieceInfo}>
                  {t("stock_piece_page.category")}: {stockPiece.piece.categorie}
                </p>
                <p className={styles.stockPieceInfo}>
                  {t("stock_piece_page.quantity")}: {stockPiece.quantite}
                </p>
                <p className={styles.stockPieceInfo}>
                  {t("stock_piece_page.unit_price")}: {stockPiece.piece.prxUnitaire}
                </p>
                <p className={styles.stockPieceInfo}>
                  {t("stock_piece_page.condition")}: {stockPiece.piece.condition}
                </p>
                <button className={styles.editBtn} onClick={() => handleEdit(stockPiece)}>
                  <Edit />
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(stockPiece)}>
                  <Trash2 />
                </button>
              </div>
            ))
          ) : (
            <p className={styles.noPiecesMessage}>{t("stock_piece_page.no_pieces")}</p>
          )}
        </div>

        <div className={styles.addStockPiece} onClick={handleAdd}>
          <PlusCircle size={40} />
        </div>

        {isAdding && (
          <AddStockPieceModal
            onClose={() => setIsAdding(false)}
            onSubmit={handleAddSubmit}
            stockId={stockId}
          />
        )}
        {isEditing && selectedStockPiece && (
          <EditStockPieceModal
            onClose={() => {
              setIsEditing(false);
              setSelectedStockPiece(null);
            }}
            onSubmit={handleEditSubmit}
            stockPiece={{
              name: selectedStockPiece.piece.name || "",
              reference: selectedStockPiece.piece.reference || "",
              categorie: selectedStockPiece.piece.categorie || "",
              prxUnitaire: selectedStockPiece.piece.prxUnitaire || 0,
              quantite: selectedStockPiece.quantite || 0,
              images: selectedStockPiece.piece.image_list?.map((img) => img.image) || [],
            }}
            stockId={stockId}
          />
        )}
        {isDeleting && selectedStockPiece && (
          <DeleteStockPieceModal
            onClose={() => {
              setIsDeleting(false);
              setSelectedStockPiece(null);
            }}
            onDelete={handleDeleteConfirm}
            pieceName={selectedStockPiece.piece.name || ""}
            stockPieceId={selectedStockPiece.id}
          />
        )}
      </div>
    </>
  );
};

export default StockPiecePage;