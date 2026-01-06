import OrderItem from "./OrderItem";
import { Button, Link } from "@heroui/react";
import { BaybayaniLogo, CartIcon } from "@/components/icons";
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
					<div className="col-span-full flex flex-col items-center justify-center w-full md:w-3/4 md:mx-auto py-16 px-5 text-center">
						<CartIcon className="size-40" />

						<h3 className="text-xl font-semibold mb-2">
							You have no orders yet
						</h3>
						<p className="text-default-500 mb-6">
							Visit the shop to place your first order!
						</p>

						<Link href="/">
							<Button
								color="default"
								startContent={
									<BaybayaniLogo className="size-5" />
								}
							>
								Go to Shop
							</Button>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
