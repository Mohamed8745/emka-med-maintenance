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

export interface Machine {
  id: number;
  name: string;
  type: string;
}

export interface Schedule {
  id: number;
  machineId: number;
  date: string;
  time: string;
  technician: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Task {
  id: number;
  machineId: number;
  task: string;
  priority: 'low' | 'medium' | 'high';
  addedDate: string;
  completed: boolean;
}