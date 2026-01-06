import OrderItem from "./OrderItem";
import { ordersMockData } from "@/data/ordersMockData";
export default function Orders() {
	return (
		<div className="w-full sm:w-3/4 mx-auto px-5">
			<h1 className="text-3xl font-semibold mb-6 text-default-900">
				My Orders
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{ordersMockData.map((order) => (
					<OrderItem orderItemUser={order} isLoading={false} />
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
