// src/types.ts

export interface StockPiece {
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
  // تعريف بيانات الآلة
export interface Machine {
  id: number;
  name: string;
  type: string;
}

// تعريف بيانات الجدول
export interface Schedule {
  id: number;
  machineId: number;
  date: string;
  time: string;
  technician: string;
  status: string;
}

// تعريف بيانات المهام الجديدة
export interface Task {
  id: number;
  machineId: number;
  task: string;
  priority: string;
  addedDate: string;
}
