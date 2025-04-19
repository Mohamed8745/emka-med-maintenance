// src/types.ts

export interface StockPiece {
    id: string;
    stock_id: string;
    designation: string;
    reference: string;
    quantity: number;
    created_at?: string;
    updated_at?: string;
  }
  