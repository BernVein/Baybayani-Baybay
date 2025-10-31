import { useState } from "react";
import { Card, CardBody, CheckboxGroup, Button } from "@heroui/react";
import useIsMobile from "@/lib/isMobile";
import { AddToCart } from "@/components/icons";
import CartItem from "@/pages/Customer/CartPage/Cart/CartItem";
import { CartContent } from "@/data/cart";
export default function Cart() {
	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
	const isMobile = useIsMobile();

	return (
		<>
			<div className="flex justify-between items-center w-full md:w-3/4 md:mx-auto px-5">
				<h2 className="text-3xl font-semibold">My Cart</h2>
				<span className="text-default-500 text-sm">
					{CartContent.items.length} items in Cart
				</span>
			</div>

			<div className="flex flex-col sm:flex-row gap-3 w-full md:w-3/4 md:mx-auto p-5">
				<CheckboxGroup
					value={selectedProducts}
					onChange={setSelectedProducts}
					className="sm:w-3/4 mb-3"
				>
					{CartContent.items.map((cart_item) => (
						<CartItem
							cartItemUser={cart_item}
							value={cart_item.cart_item_id}
						/>
					))}
				</CheckboxGroup>

				<Card
					className="w-full sm:w-1/4 self-start sticky top-30 bottom-23 z-10"
					isBlurred={isMobile}
				>
					<CardBody className="gap-1">
						<span className="mb-2">Order Summary</span>
						<div className="w-full flex flex-row mb-2 justify-between items-center">
							<span className="text-xs text-default-500">
								Subtotal
							</span>
							<span className="text-sm text-default-600">
								₱
								{CartContent.items
									.reduce((sum, i) => sum + i.subtotal, 0)
									.toLocaleString()}
							</span>
						</div>
						<Button
							color="success"
							startContent={<AddToCart className="size-6" />}
						>
							Proceed to Checkout
						</Button>
					</CardBody>
				</Card>
			</div>
		</>
	);
}
