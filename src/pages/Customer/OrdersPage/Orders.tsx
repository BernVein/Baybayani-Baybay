import { Order } from "@/model/order";
import OrderCard from "./OrderCard";

export default function Orders() {
	// Mock Data
	const orders: Order[] = [
		{
			order_id: "ORD-001",
			status: "Processing",
			created_at: "2023-10-25T10:00:00Z",
			total_price: 1500,
			items: [
				{
					item_id: "1",
					item_name: "Organic Bananas",
					variant_name: "1kg Bunch",
					quantity: 2,
					price: 250,
					image_url:
						"https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=2787&auto=format&fit=crop",
				},
				{
					item_id: "2",
					item_name: "Mangoes",
					variant_name: "1kg",
					quantity: 1,
					price: 1000,
					image_url:
						"https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=2787&auto=format&fit=crop",
				},
			],
		},
		{
			order_id: "ORD-002",
			status: "Delivered",
			created_at: "2023-10-20T14:30:00Z",
			total_price: 500,
			items: [
				{
					item_id: "3",
					item_name: "Fresh Tomatoes",
					variant_name: "500g Pack",
					quantity: 5,
					price: 100,
					image_url:
						"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=2787&auto=format&fit=crop",
				},
			],
		},
		{
			order_id: "ORD-003",
			status: "Cancelled",
			created_at: "2023-10-15T09:15:00Z",
			total_price: 2500,
			items: [
				{
					item_id: "4",
					item_name: "White Rice",
					variant_name: "25kg Sack",
					quantity: 1,
					price: 2500,
					image_url:
						"https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2938&auto=format&fit=crop",
				},
			],
		},
	];

	return (
		<div className="w-full max-w-4xl mx-auto px-4 py-6">
			<h1 className="text-2xl font-bold mb-6 text-default-900">
				My Orders
			</h1>

			<div className="flex flex-col gap-4">
				{orders.map((order) => (
					<OrderCard key={order.order_id} order={order} />
				))}

				{orders.length === 0 && (
					<div className="text-center py-10 text-default-500">
						You have no orders yet.
					</div>
				)}
			</div>
		</div>
	);
}
