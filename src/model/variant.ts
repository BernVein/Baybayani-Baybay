import { StockMovement } from "@/model/stockMovement";

export interface Variant {
  variant_id?: string;
  variant_name: string;
  variant_price_retail?: number;
  variant_price_wholesale?: number | null;
  variant_wholesale_item?: number | null;
  variant_last_updated_stock?: string; // timestamptz
  variant_last_updated_price_retail?: string | null; // timestamptz
  variant_last_price_retail?: number;
  variant_last_updated_price_wholesale?: string | null; // timestamptz
  variant_last_price_wholesale?: number | null;
  variant_low_stock_threshold?: number | null;
  variant_stock_movements?: StockMovement[]; // for history tracking
  variant_stock_latest_movement: StockMovement; // for quick access to latest info
  last_updated?: string; // timestamptz
  is_soft_deleted?: boolean;
  created_at?: string; // timestamptz
}
