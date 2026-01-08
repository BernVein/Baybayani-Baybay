import OrderItem from "./OrderItem";
import { Button, Link, useDisclosure } from "@heroui/react";
import { BaybayaniLogo, CartIcon } from "@/components/icons";
import { ordersMockData } from "@/data/ordersMockData";
import { useState, useEffect } from "react";
import { Item } from "@/model/Item";
import ItemInfoModalOrder from "./ItemInfoModalOrder/ItemInfoModalOrderIndex";
export default function OrderIndex() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [selectedItem, setSelectedItem] = useState<Item | null>(null);

	useEffect(() => {
		document.title = "Baybayani | Orders";
	}, []);
	return (
		<>
			<div className="w-full sm:w-3/4 mx-auto px-5">
				<div className="flex items-center gap-2 mb-5">
					<BaybayaniLogo className="size-7" />
					<h2 className="text-xl sm:text-3xl font-semibold">
						Baybayani <span className="text-default-400">|</span>{" "}
						Orders
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{ordersMockData.map((order) => (
						<OrderItem
							key={order.order_item_user_id}
							orderItemUser={order}
							isLoading={false}
							onPress={() => {
								setSelectedItem(order.item);
								onOpen();
							}}
						/>
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
			<ItemInfoModalOrder
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				item={selectedItem as Item}
			/>
		</>
	);
}
