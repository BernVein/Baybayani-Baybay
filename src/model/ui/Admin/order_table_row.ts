export interface OrderTableRow {
	order_id: string;
	user_name: string;
	user_role: string;
	date_ordered: string;
	item_name: string;
	item_variant_name: string;
	item_variant_id: string;
	item_quantity: number;
	subtotal: number;
	price_variant: string;
	// Pending = defayult, Ready = Order is ready for pickup, Completed = Order has been picked up, Cancelled = Order has been cancelled
	status: "Pending" | "Ready" | "Completed" | "Cancelled";
	item_first_img_url: string;
	user_profile_img_url: string;
	item_sold_by: string;
	order_identifier: string;
	item_img_url: string;
	cancel_reason?: string | undefined;
	last_updated?: string;
}
