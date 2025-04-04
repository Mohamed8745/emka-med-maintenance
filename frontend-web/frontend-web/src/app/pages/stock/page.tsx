'use client'

import { useEffect, useState, useCallback } from "react";
import Header from "../../components/header";
import SearchBar from "../../components/searchbar";
import styles from "../../styles/stock.module.css";

interface Piece {
    id?: number;
    nom: string;
    reference: string;
    categorie: string;
    prxUnitaire: number;
    image?: string | File;
    quantite: number;
}

interface Stock {
    id?: number;
    capacite: number;
    emplacement: string;
    pieces: Piece[];
}

export default function StockPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [fileName, setFileName] = useState("");

    // Fetch stock data from the server
    const fetchStocks = useCallback(async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/stocks/");
            const data = await response.json();
            console.log("Fetched data:", data); // تحقق من البيانات هنا
            setStocks(Array.isArray(data) ? data : []); // تأكد من أن البيانات مصفوفة
            setFilteredStocks(Array.isArray(data) ? data : []); // تأكد من أن البيانات مصفوفة
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
        }
    }, []);

    useEffect(() => {
        fetchStocks();
    }, [fetchStocks]);

    // Handle search for stocks
    const handleSearch = (query: string) => {
        setFilteredStocks(
            stocks.filter(
                (stock) =>
                    stock.id?.toString().includes(query) ||
                    stock.capacite.toString().includes(query) ||
                    stock.emplacement.includes(query) ||
                    stock.pieces.some((piece) =>
                        piece.nom.includes(query) || piece.reference.includes(query)
                    )
            )
        );
    };

    // Handle file upload
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setSelectedStock((prev) =>
                prev ? { ...prev, pieces: [{ ...prev.pieces[0], image: file }] } : null
            );
        }
    };

    // Add new stock
    const handleAdd = () => {
        setSelectedStock({
            capacite: 0,
            emplacement: "",
            pieces: [],
        });
        setIsAdding(true);
        setErrorMessage("");
    };

    const saveAdd = async () => {
        if (!selectedStock) return;

        const formData = new FormData();
        formData.append("capacite", selectedStock.capacite.toString());
        formData.append("emplacement", selectedStock.emplacement);

        try {
            const response = await fetch("http://127.0.0.1:8000/stocks/", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to add stock");

            setIsAdding(false);
            fetchStocks();
        } catch (error: any) {
            setErrorMessage(error.message);
            console.error("Error adding stock:", error);
        }
    };

    // Edit stock
    const saveEdit = async () => {
        if (!selectedStock || !selectedStock.id) return;

        const formData = new FormData();
        formData.append("capacite", selectedStock.capacite.toString());
        formData.append("emplacement", selectedStock.emplacement);

        try {
            const response = await fetch(`http://127.0.0.1:8000/stocks/${selectedStock.id}/`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to update stock");

            setIsEditing(false);
            fetchStocks();
        } catch (error: any) {
            setErrorMessage(error.message);
            console.error("Error updating stock:", error);
        }
    };

    // Delete stock
    const confirmDelete = async () => {
        if (!selectedStock || !selectedStock.id) return;

        try {
            await fetch(`http://127.0.0.1:8000/stocks/${selectedStock.id}/`, {
                method: "DELETE",
            });

            setIsDeleting(false);
            fetchStocks();
        } catch (error) {
            console.error("Error deleting stock:", error);
        }
    };

    return (
        <>
            <Header>
                <SearchBar onSearch={handleSearch} />
            </Header>
            <div className={styles.container}>
                <h1 className={styles.title}>Liste des Stocks</h1>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID du Stock</th>
                            <th>Capacité</th>
                            <th>Emplacement</th>
                            <th>Pièces</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(filteredStocks) && filteredStocks.map((stock) => (
                            <tr key={stock.id}>
                                <td>{stock.id}</td>
                                <td>{stock.capacite}</td>
                                <td>{stock.emplacement}</td>
                                <td>
                                    <ul>
                                        {stock.pieces.map((piece) => (
                                            <li key={piece.reference}>
                                                {piece.nom} (x{piece.quantite})
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <button
                                        className={styles.editBtn}
                                        onClick={() => {
                                            setSelectedStock(stock);
                                            setIsEditing(true);
                                        }}
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => {
                                            setSelectedStock(stock);
                                            setIsDeleting(true);
                                        }}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* زر الإضافة */}
                <div className={styles.addPiece} onClick={handleAdd}>
                    +
                </div>
            </div>

            {/* Add/Edit Modal */}
            {(isAdding || isEditing) && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <h2>{isEditing ? "Modifier le Stock" : "Ajouter un Stock"}</h2>
                        <button
                            onClick={() => {
                                setIsAdding(false);
                                setIsEditing(false);
                            }}
                        >
                            ×
                        </button>
                        <input
                            type="number"
                            placeholder="Capacité"
                            value={selectedStock?.capacite || ""}
                            onChange={(e) =>
                                setSelectedStock((prev) =>
                                    prev ? { ...prev, capacite: Number(e.target.value) } : null
                                )
                            }
                        />
                        <input
                            type="text"
                            placeholder="Emplacement"
                            value={selectedStock?.emplacement || ""}
                            onChange={(e) =>
                                setSelectedStock((prev) =>
                                    prev ? { ...prev, emplacement: e.target.value } : null
                                )
                            }
                        />
                        <button onClick={isEditing ? saveEdit : saveAdd}>
                            {isEditing ? "Enregistrer" : "Ajouter"}
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {isDeleting && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <h2>Êtes-vous sûr ?</h2>
                        <p>Voulez-vous vraiment supprimer ce stock ?</p>
                        <button onClick={confirmDelete}>Supprimer</button>
                        <button onClick={() => setIsDeleting(false)}>Annuler</button>
                    </div>
                </div>
            )}
        </>
    );
}