export interface StockMovement {
	stock_movement_id?: string;
	stock_change_count?: number;
	stock_adjustment_amount?: number;
	stock_adjustment_type?: "Loss" | "Acquisition" | "Sale" | "From Cancelled";
	stock_supplier?: string;
	stock_delivery_date?: string;
	effective_stocks?: number;
	stock_change_date?: string;
	stock_loss_reason?: string;
	sale_amount?: number;
	last_updated?: string; // timestamptz
	is_soft_deleted?: boolean;
	created_at?: string; // timestamptz
}
