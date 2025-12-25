export interface OrderItem {
	item_id: string;
	item_name: string;
	variant_name: string;
	quantity: number;
	price: number;
	image_url: string;
}

export interface Order {
	order_id: string;
	status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
	created_at: string;
	total_price: number;
	items: OrderItem[];
}
