import OrderItem from "./OrderItem";
import { ordersMockData } from "@/data/ordersMockData";
export default function Orders() {
	return (
		<div className="w-full max-w-4xl mx-auto px-4 py-6">
			<h1 className="text-2xl font-bold mb-6 text-default-900">
				My Orders
			</h1>

			<div className="flex flex-col gap-4">
				{ordersMockData.map((order) => (
					<OrderItem
						value={order.order_item_user_id}
						orderItemUser={order}
						isLoading={false}
					/>
				))}

				{ordersMockData.length === 0 && (
					<div className="text-center py-10 text-default-500">
						You have no orders yet.
					</div>
				)}
			</div>
		</div>
	);
}
