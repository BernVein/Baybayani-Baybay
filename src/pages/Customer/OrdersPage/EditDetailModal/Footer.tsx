import { Variant } from "@/model/variant";
import { Button, addToast } from "@heroui/react";
import { CartIcon } from "@/components/icons";
import { useState } from "react";
import { updateCartItemQuantity } from "@/data/supabase/updateCartItemQuantity";
import { CartItemUser } from "@/model/cartItemUser";
export default function Footer({
	cartItemUser,
	selectedItemVariant,
	selectedPriceVariant,
	rawQuantity,
	actualQuantity,
	onClose,
	onUpdated,
}: {
	cartItemUser: CartItemUser;
	selectedItemVariant: Variant | null;
	selectedPriceVariant: string;
	rawQuantity: number;
	actualQuantity: number;
	onClose: () => void;
	onUpdated?: () => Promise<void> | void;
}) {
	const [isLoading, setIsLoading] = useState(false);
	async function editUpdateCartItem() {
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

		setIsLoading(true);
		const result = await updateCartItemQuantity({
			cartItemUserId: cartItemUser.cart_item_user_id,
			item: cartItemUser.item,
			variant: selectedItemVariant,
			rawQuantity: rawQuantity,
		});

		if (result.error === "OUT_OF_STOCK_EXCEEDED") {
			addToast({
				title: "Failed to update cart item",
				description: result.message,
				severity: "warning",
				color: "warning",
				shouldShowTimeoutProgress: true,
			});
		} else if (!result.success) {
			addToast({
				title: "Failed to update cart item",
				description: `Please try again later`,
				severity: "warning",
				color: "warning",
				shouldShowTimeoutProgress: true,
			});
		} else if (result.success) {
			addToast({
				title: "Successfully updated cart item",
				description: `Quantity updated to ${result.realQuantity.toLocaleString()} ${
					result.realQuantity > 1
						? `${cartItemUser.item.item_sold_by}s`
						: cartItemUser.item.item_sold_by
				}.`,
				severity: "success",
				color: "success",
				shouldShowTimeoutProgress: true,
			});

			if (onUpdated) {
				onUpdated();
			}
			onClose();
			return;
		}
		setIsLoading(false);
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
									0) * actualQuantity
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
					isLoading={isLoading}
					onPress={editUpdateCartItem}
				>
					Update Quantity
				</Button>
			</div>
		</>
	);
}