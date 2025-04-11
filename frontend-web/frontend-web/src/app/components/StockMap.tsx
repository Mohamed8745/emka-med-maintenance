// components/StockMap.jsx
import React from "react";
import styles from "./../styles/stock.module.css";

interface Stock {
  id: React.Key | null | undefined;
  latitude: number;
  longitude: number;
  nom: string;
}

interface StockMapProps {
  stocks: Stock[];
  onAddClick: () => void;
}

export default function StockMap({ stocks, onAddClick }: StockMapProps) {
  const backgroundImage = "/images/emkaMap.png"; // صورة خريطة الشركة

  const getPositionStyle = (lat: number, lng: number) => {
    // تبسيط: تحويل الإحداثيات إلى نسب مئوية للخريطة (تجريبية)
    const top = 100 - lat;
    const left = lng;
    return {
      top: `${top}%`,
      left: `${left}%`,
    };
  };

  return (
    <div className={styles.mapContainer}>
      <img src={backgroundImage} alt="خريطة الشركة" className={styles.mapImage} />
      {stocks.map((stock: { id: React.Key | null | undefined; latitude: any; longitude: any; nom: any; }) => (
        <div
          key={stock.id}
          className={styles.stockMarker}
          style={getPositionStyle(stock.latitude, stock.longitude)}
          title={`الموقع: ${stock.nom}`}
        >
          <span>📍</span>
        </div>
      ))}

      <button className={styles.addButton} onClick={onAddClick}>
        ➕ إضافة مخزن
      </button>
    </div>
  );
}
