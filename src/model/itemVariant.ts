export interface ItemVariant {
	item_variant_id: string;
	item_id: string;
	item_variant_name: string;
	price_retail: number;
	price_wholesale?: number | null;
	wholesale_item?: number | null;
	stocks: number;
	last_updated_stock?: string | null;
	last_updated_price_retail?: string | null;
	last_price_retail?: number;
	last_updated_price_wholesale?: string | null;
	last_price_wholesale?: number;
	last_updated: string;
	is_soft_deleted: boolean;
	created_at: string;
}
