import { Variant } from "@/model/variant";
import { Button, addToast } from "@heroui/react";
import { CartIcon } from "@/components/icons";
import { addToCart } from "@/data/supabase/addToCart";
import { Item } from "@/model/Item";
import { useState } from "react";

export default function Footer({
	selectedItem,
	selectedItemVariant,
	selectedPriceVariant,
	rawQuantity,
	actualQuantity,
	onClose,
}: {
	selectedItem: Item;
	selectedItemVariant: Variant | null;
	selectedPriceVariant: string;
	rawQuantity: number;
	actualQuantity: number;
	onClose: () => void;
}) {
	const [isLoading, setIsLoading] = useState(false);

	async function addToCartHandler() {
		setIsLoading(true);
		const userId = "cb20faec-72c0-4c22-b9d4-4c50bfb9e66f";

		if (!selectedItemVariant) {
			alert("Please select a variant first!");
			return;
		}
		const result = await addToCart(
			userId,
			selectedItem,
			selectedItemVariant,
			selectedPriceVariant as "Retail" | "Wholesale",
			rawQuantity
		);
		setIsLoading(false);
		if (result.success) {
			addToast({
				title: "Item added to cart",
				description: `${selectedItemVariant.variant_name} has been added to your cart.`,
				severity: "success",
				color: "success",
				shouldShowTimeoutProgress: true,
			});
		} else {
			addToast({
				title: "Error adding item to cart",
				description: `Sorry, ${selectedItemVariant.variant_name} could not be added to your cart, Plase try again later.`,
				severity: "danger",
				color: "danger",
				shouldShowTimeoutProgress: true,
			});
		}
	}

	return (
		<>
			<div className="flex flex-col gap-2 items-start">
				<span className="text-sm text-default-500">
					Subtotal ({selectedPriceVariant}):
				</span>
				<div className="flex flex-row gap-2 items-center">
					<span className="text-base font-semibold">
						{rawQuantity
							? `₱${(selectedPriceVariant === "Wholesale"
									? (selectedItemVariant?.variant_price_wholesale ??
											1) * actualQuantity
									: (selectedItemVariant?.variant_price_retail ??
											0) * rawQuantity
								).toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}`
							: "Enter quantity"}
					</span>
				</div>
			</div>
			<div className="flex gap-2">
				<Button color="danger" variant="light" onPress={onClose}>
					Close
				</Button>
				<Button
					color="success"
					startContent={!isLoading && <CartIcon className="size-5" />}
					onPress={addToCartHandler}
					isLoading={isLoading}
				>
					Add to Cart
				</Button>
			</div>
		</>
	);
}
