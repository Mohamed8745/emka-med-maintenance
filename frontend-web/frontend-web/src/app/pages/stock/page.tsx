'use client';

import { useState } from 'react';
import AddStockModal from '../../components/AddStockModal';
import authService from '../../services/authService';

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  const handleAddStock = async (data: { name: string; capacity: number; location: { lat: number; lng: number } }) => {
    const payload = {
      capacite: data.capacity,
      emplacement: `${data.location.lat},${data.location.lng}`,
    };
    await authService.addStock(payload);
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>إضافة مخزن</button>
      {showModal && (
        <AddStockModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddStock}
        />
      )}
    </div>
  );
}
