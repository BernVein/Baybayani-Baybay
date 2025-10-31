import { Item } from "@/model/Item.js";
import { Variant } from "@/model/variant.js";

export interface CartItemUser {
	cart_item_id: string;
	cart_id: string;
	item: Item;
	variant_snapshot: Variant; // snapshot of variant at time added
	price_variant: string;
	quantity: number;
	subtotal: number;
	is_soft_deleted: boolean;
	created_at: string;
	updated_at: string;
}
