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

interface StockPiece {
  id: string;
  piece: {
    id: string;
    name: string;
    reference: string;
    categorie: string;
    prxUnitaire: number;
    image?: string;
  };
  quantite: number;
}

const StockPiecePage: React.FC = () => {
  const { t } = useTranslation("common");
  const searchParams = useSearchParams();
  const stockId = searchParams.get('stock') || '';

  const [stockPieces, setStockPieces] = useState<StockPiece[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStockPiece, setSelectedStockPiece] = useState<StockPiece | null>(null);
  
  useEffect(() => {
    if (!stockId) {
      console.error("Stock ID is missing");
      return;
    }
    fetchStockPieces();
  }, [stockId]);

  const fetchStockPieces = async () => {
    try {
      const data = await stockPieceService.getStockPieces(stockId);
      if (Array.isArray(data) && data.every(item => typeof item === "object" && "id" in item && "piece" in item && "quantite" in item)) {
        setStockPieces(data);
      } else {
        console.error(t("stock_piece_page.error_fetch"));
      }
    } catch (error) {
      console.error(t("stock_piece_page.error_fetch"), error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleEdit = (stockPiece: StockPiece) => {
    setSelectedStockPiece(stockPiece);
    setIsEditing(true);
  };

  const handleDelete = (stockPiece: StockPiece) => {
    setSelectedStockPiece(stockPiece);
    setIsDeleting(true);
  };

  const handleAddSubmit = async (newStockPiece: Partial<StockPiece>) => {
    try {
      const formattedStockPiece = {
        piece: {
          id: "", // Generate or fetch the piece ID based on the newStockPiece
          name: newStockPiece.piece?.name || "",
          reference: newStockPiece.piece?.reference || "",
          categorie: newStockPiece.piece?.categorie || "",
          prxUnitaire: newStockPiece.piece?.prxUnitaire || 0,
          image: newStockPiece.piece?.image,
        },
        quantite: newStockPiece.quantite || 0,
        stock: stockId,
      };
      const added = await stockPieceService.addStockPiece(formattedStockPiece);
      if (added) {
        fetchStockPieces();
        setIsAdding(false);
      } else {
        console.error(t("stock_piece_page.error_add"));
      }
    } catch (error) {
      console.error(t("stock_piece_page.error_add"), error);
    }
  };

  const handleEditSubmit = async (updatedStockPiece: Partial<StockPiece>) => {
    try {
      if (selectedStockPiece) {
        const updated = await stockPieceService.updateStockPiece(selectedStockPiece.id, updatedStockPiece);
        if (updated) {
          fetchStockPieces();
          setIsEditing(false);
          setSelectedStockPiece(null);
        } else {
          console.error(t("stock_piece_page.error_edit"));
        }
      }
    } catch (error) {
      console.error(t("stock_piece_page.error_edit"), error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedStockPiece) {
        const deleted = await stockPieceService.deleteStockPiece(selectedStockPiece.id);
        if (deleted) {
          fetchStockPieces();
          setIsDeleting(false);
          setSelectedStockPiece(null);
        } else {
          console.error(t("stock_piece_page.error_delete"));
        }
      }
    } catch (error) {
      console.error(t("stock_piece_page.error_delete"), error);
    }
  };

  const filteredStockPieces = stockPieces.filter((sp) => {
    const name = sp.piece?.name?.toLowerCase() || "";
    const reference = sp.piece?.reference?.toLowerCase() || "";
    const term = searchTerm?.toLowerCase() || "";
    return name.includes(term) || reference.includes(term);
  });
  

  return (
    <>
      <ProtectedRoute>
        <Header>
          <SearchBar onSearch={handleSearch} />
        </Header>
      </ProtectedRoute>
      
      <div className={styles.content}>
        <h1>{t("stock_piece_page.title")}</h1>

        <div className={styles.stockPiecesGrid}>
          {filteredStockPieces.length > 0 ? (
            filteredStockPieces.map((stockPiece) => (
              <div key={stockPiece.id} className={styles.stockPieceCard}>
                {stockPiece.piece.image && (
                  <img
                    src={stockPiece.piece.image}
                    alt={stockPiece.piece.name}
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
                <button
                  className={styles.editBtn}
                  onClick={() => handleEdit(stockPiece)}
                >
                  <Edit />
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(stockPiece)}
                >
                  <Trash2 />
                </button>
              </div>
            ))
          ) : (
            <p>{t("stock_piece_page.no_pieces")}</p>
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
            onClose={() => {setSelectedStockPiece(null);}}
            onSubmit={handleEditSubmit}
            stockPiece={selectedStockPiece} // Pass stockPiece to AddStockPieceModal
          />
        )}
        {isDeleting && selectedStockPiece && (
          <DeleteStockPieceModal
            onClose={() => {
              setIsDeleting(false);
              setSelectedStockPiece(null);
            }}
            onDelete={handleDeleteConfirm}
            pieceName={selectedStockPiece.piece.name}
            stockPieceId={selectedStockPiece.id}
          />
        )}
      </div>
    </>
  );
};

export default StockPiecePage;