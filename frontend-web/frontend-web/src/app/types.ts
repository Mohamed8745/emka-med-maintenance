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
  