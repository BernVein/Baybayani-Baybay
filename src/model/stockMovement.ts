export interface StockMovement {
  stock_movement_id?: string;
  stock_change_count?: number;
  stock_adjustment_amount?: number;
  stock_adjustment_type?: "Loss" | "Acquisition" | "Sale" | "From Cancel";
  stock_supplier?: string;
  stock_delivery_date?: string;
  effective_stocks?: number;
  last_updated: string; // timestamptz
  is_soft_deleted: boolean;
  created_at: string; // timestamptz
}
