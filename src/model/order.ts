import { OrderItem } from "./orderItem";
export interface Order {
	order_id: string;
	status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
	created_at: string;
	total_price: number;
	items: OrderItem[];
}
