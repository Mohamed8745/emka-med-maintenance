'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/AddStockModal.module.css';

const MapEmplacement = dynamic(() => import('./MapEmplacement'), { ssr: false });

interface AddStockModalProps {
  onClose: () => void;
  onSubmit: (data: { name: string; capacity: number; location: { lat: number; lng: number } }) => void;
}

export default function AddStockModal({ onClose, onSubmit }: AddStockModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && location) {
      onSubmit({ name, capacity, location });
      onClose();
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.content}>
        {step === 1 && (
          <>
            <h2>إضافة مخزن جديد</h2>
            <input type="text" placeholder="اسم المخزن" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="number" placeholder="السعة" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
            <button onClick={handleNext} className={styles.button}>التالي</button>
          </>
        )}
        {step === 2 && (
          <>
            <h2>اختر موقع المخزن</h2>
            <MapEmplacement onSelectLocation={(loc) => setLocation(loc)} />
            <button onClick={handleNext} disabled={!location}>حفظ</button>
          </>
        )}
        <button onClick={onClose}>إلغاء</button>
      </div>
    </div>
  );
}
