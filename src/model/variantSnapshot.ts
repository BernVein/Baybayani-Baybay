export interface VariantSnapshot {
	variant_id: string;
	variant_name: string;
	cart_item_id: string;
	variant_price_retail: number;
	variant_price_wholesale?: number | null;
	variant_wholesale_item?: number | null;
	last_updated: string; // timestamptz
	is_soft_deleted: boolean;
	created_at: string; // timestamptz
}
