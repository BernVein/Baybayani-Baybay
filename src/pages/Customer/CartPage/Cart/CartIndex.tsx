import { useState } from "react";
import {
	Card,
	CardBody,
	CheckboxGroup,
	Button,
	Skeleton,
	Divider,
} from "@heroui/react";
import useIsMobile from "@/lib/isMobile";
import { AddToCart } from "@/components/icons";
import CartItem from "@/pages/Customer/CartPage/Cart/CartItem";
import { useFetchCart } from "@/data/supabase/useFetchCart";

export default function Cart() {
	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
	const isMobile = useIsMobile();
	const { cartList, loading } = useFetchCart();
	const allCartItems = cartList[0]?.items ?? [];

	const totalSubtotal = allCartItems.reduce((sum, i) => sum + i.subtotal, 0);

	return (
		<>
			{/* Header */}
			<div className="flex justify-between items-center w-full md:w-3/4 md:mx-auto px-5">
				<h2 className="text-3xl font-semibold">My Cart</h2>

				{loading && !allCartItems.length ? (
					<>
						<Skeleton className="h-4 w-32 rounded-lg" />
					</>
				) : (
					<>
						<span className="text-default-500 text-sm">
							{allCartItems.length} items in Cart
						</span>
					</>
				)}
			</div>

			{/* Main content layout */}
			<div className="flex flex-col sm:flex-row gap-3 w-full md:w-3/4 md:mx-auto p-5">
				{/* Left side: cart list or skeletons */}
				<CheckboxGroup
					key="cart-group"
					value={selectedProducts}
					onChange={(val) => {
						if (Array.isArray(val)) setSelectedProducts(val);
					}}
					className="sm:w-3/4 mb-3"
				>
					{loading && !allCartItems.length ? (
						<>
							{[...Array(3)].map((_, i) => (
								<CartItem
									key={`skeleton-${i}`}
									isLoading={true}
									cartItemUser={{} as any}
									value={`loading-${i}`}
								/>
							))}
						</>
					) : (
						allCartItems.map((cart_item) => {
							console.log("cart_item:", cart_item);
							return (
								<CartItem
									isLoading={false}
									key={cart_item.cart_item_user_id}
									cartItemUser={cart_item}
									value={cart_item.cart_item_user_id}
								/>
							);
						})
					)}
				</CheckboxGroup>

				{/* Right side: Order summary skeleton */}
				<Card
					className="w-full sm:w-1/4 self-start sticky top-30 bottom-23 z-10"
					isBlurred={isMobile}
				>
					<CardBody className="gap-1">
						{loading && !allCartItems.length ? (
							<>
								<Skeleton className="h-5 w-32 mb-3 rounded-md" />
								<Divider className="my-1" />
								<Skeleton className="h-3 w-full mb-2 rounded-md" />
								<Skeleton className="h-3 w-2/3 mb-4 rounded-md" />
								<Skeleton className="h-10 w-full rounded-lg" />
							</>
						) : (
							<>
								<span className="mb-2">Order Summary</span>
								<div className="w-full flex flex-row mb-2 justify-between items-center">
									<span className="text-xs text-default-500">
										Subtotal
									</span>
									<span className="text-sm text-default-600">
										₱{totalSubtotal.toLocaleString()}
									</span>
								</div>
								<Button
									color="success"
									startContent={
										<AddToCart className="size-6" />
									}
								>
									Proceed to Checkout
								</Button>
							</>
						)}
					</CardBody>
				</Card>
			</div>
		</>
	);
}
