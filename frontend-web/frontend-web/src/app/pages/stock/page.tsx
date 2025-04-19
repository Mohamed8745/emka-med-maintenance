"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import stockService from "../../services/stockService";
import styles from "../../styles/stock.module.css";
import Header from "../../components/header";
import SearchBar from "../../components/searchbar";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { getUser } from "../../services/authService";

interface Warehouse {
  id: number;
  name: string;
  content: string;
  capacite: number;
  capacite_utilisee: number;
  capacite_libre: number;
}

export default function WarehouseView() {
  const { t } = useTranslation("common");
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState<Warehouse[]>([]); // حالة للمخازن المفلترة
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user && user.role) {
        setUserRole(user.role);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await stockService.getStocks();
      const warehousesData = (data as any[]).map((item: any) => ({
        ...item,
        id: Number(item.id),
        capacite: Number(item.capacite),
        capacite_utilisee: Number(item.capacite_utilisee),
        capacite_libre: Number(item.capacite_libre),
      }));
      setWarehouses(warehousesData);
      setFilteredWarehouses(warehousesData); // تعيين المخازن المفلترة عند التحميل الأولي
    };
    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    const filtered = warehouses.filter(
      (warehouse) =>
        warehouse.name.toLowerCase().includes(query.toLowerCase()) ||
        warehouse.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredWarehouses(filtered); // تحديث المخازن المفلترة
  };

  const openEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsEditOpen(true);
  };

  const openDelete = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (selectedWarehouse) {
      setWarehouses((prev) => prev.filter((w) => w.id !== selectedWarehouse.id));
      setFilteredWarehouses((prev) => prev.filter((w) => w.id !== selectedWarehouse.id)); // تحديث المخازن المفلترة
      setSelectedWarehouse(null);
    }
  };

  return (
    <>
      <ProtectedRoute>
        <Header>
          <SearchBar onSearch={handleSearch} /> {/* تمرير دالة البحث */}
        </Header>
      </ProtectedRoute>
      <div className={styles.warehouseContainer}>
        <div className={styles.warehouseScroll}>
          {filteredWarehouses.map((w) => ( // عرض المخازن المفلترة
            <div
              className={`${styles.warehouseCard} observe-card`}
              key={w.id}
              onClick={() => router.push(`/pages/piece?stock=${w.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div
                className={styles.warehouseBg}
                style={{ backgroundImage: `url('/images/bgst.png')` }}
              >
                <div className={styles.overlay} />
              </div>

              <div className={styles.warehouseContent}>
                <div className={styles.section} style={{ left: 62 }}>
                  <div className={styles.label}>{t("warehouse.stock")}</div>
                  <div className={styles.value}>{w.name}</div>
                </div>
                <div className={styles.section} style={{ left: 385 }}>
                  <div className={styles.label}>{t("warehouse.quantity_total")}</div>
                  <div className={styles.value}>{Number(w.capacite)}</div>
                </div>
                <div className={styles.section} style={{ left: 758 }}>
                  <div className={styles.label}>{t("warehouse.quantity_used")}</div>
                  <div className={styles.value}>{Number(w.capacite_utilisee)}</div>
                </div>
                <div className={styles.section} style={{ left: 1125 }}>
                  <div className={styles.label}>{t("warehouse.unused_quantity")}</div>
                  <div className={styles.value}>{Number(w.capacite_libre)}</div>
                </div>
                <div className={styles.title}>{w.content}</div>

                {userRole === "Magasinier" && (
                  <div className={styles.icons}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(w);
                      }}
                      title={t("warehouse.edit_title")}
                    >
                      <img src="/images/edit.svg" alt={t("warehouse.edit_title")} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDelete(w);
                      }}
                      title={t("warehouse.delete_title")}
                    >
                      <img src="/images/delete.svg" alt={t("warehouse.delete_title")} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </>
  );
}