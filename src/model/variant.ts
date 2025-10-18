export interface Variant {
	variant_id: string;
	variant_name: string;
	variant_price_retail: number;
	variant_price_wholesale?: number | null;
	variant_wholesale_item?: number | null;
	variant_stocks: number;
	variant_last_updated_stock?: string | null;
	variant_last_updated_price_retail?: string | null;
	variant_last_price_retail?: number;
	variant_last_updated_price_wholesale?: string | null;
	variant_last_price_wholesale?: number | null;
	last_updated: string;
	is_soft_deleted: boolean;
	created_at: string;
}
