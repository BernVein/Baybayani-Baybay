import { Item } from "./Item";
import { VariantSnapshot } from "./variantSnapshot";

export interface OrderItemUser {
	order_item_user_id: string;
	item: Item;
	status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
	variant_snapshot: VariantSnapshot; // snapshot of variant at time added
	price_variant: string;
	quantity: number;
	subtotal: number;
	is_soft_deleted: boolean;
	created_at: string;
	updated_at: string;
}
