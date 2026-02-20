import { Button, addToast } from "@heroui/react";
import { useState } from "react";

import { Variant } from "@/model/variant";
import { CartIcon } from "@/components/icons";
import { addToCart } from "@/data/supabase/Customer/Cart/addToCart";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { useLoginModal } from "@/ContextProvider/LoginModalContext/LoginModalContext";

export default function Footer({
	item_id,
	item_sold_by,
	selectedItemVariant,
	quantity,
	priceVariant,
	onClose,
}: {
	item_id: string;
	item_sold_by: string;
	selectedItemVariant: Variant | null;
	quantity: number | null;
	priceVariant: string;
	onClose: () => void;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuth();
	const { openLoginModal } = useLoginModal();

	async function addToCartHandler() {
		if (!user) {
			openLoginModal();
			return;
		}
		setIsLoading(true);

		if (!selectedItemVariant) {
			addToast({
				title: "No variant selected",
				description: `Please select a variant.`,
				severity: "warning",
				color: "warning",
				shouldShowTimeoutProgress: true,
			});

			return;
		}

		if (!quantity || quantity <= 0) {
			addToast({
				title: "Quantity required",
				description: "Please enter the quantity before adding to cart.",
				severity: "warning",
				color: "warning",
				shouldShowTimeoutProgress: true,
			});
			setIsLoading(false);

			return;
		}
		const result = await addToCart(
			user.id,
			item_id,
			item_sold_by,
			selectedItemVariant,
			quantity,
		);

		setIsLoading(false);

		if (!result.success && result.error === "OUT_OF_STOCK_EXCEEDED") {
			addToast({
				title: "Not enough stock",
				description: result.message,
				severity: "warning",
				color: "warning",
				shouldShowTimeoutProgress: true,
			});

			return;
		}

		if (result.success) {
			addToast({
				title: "Item added to cart",
				description: `${selectedItemVariant.variant_name} has been added to your cart.`,
				severity: "success",
				color: "success",
				shouldShowTimeoutProgress: true,
			});
			onClose();
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
					Subtotal ({priceVariant}):
				</span>
				<div className="flex flex-row gap-2 items-center">
					<span className="text-base font-semibold">
						₱
						{(
							(quantity ?? 0) *
							(priceVariant === "Wholesale"
								? (selectedItemVariant?.variant_price_wholesale ??
									0)
								: (selectedItemVariant?.variant_price_retail ??
									0))
						).toLocaleString("en-PH", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</span>
				</div>
			</div>
			<div className="flex gap-2">
				<Button color="danger" variant="light" onPress={onClose}>
					Close
				</Button>
				<Button
					color="success"
					isLoading={isLoading}
					startContent={!isLoading && <CartIcon className="size-5" />}
					onPress={addToCartHandler}
				>
					Add to Cart
				</Button>
			</div>
		</>
	);
}
