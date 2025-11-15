import { supabase } from "@/config/supabaseclient";
import { Item } from "@/model/Item";
import { Variant } from "@/model/variant";

export async function updateCartItemQuantity({
	cartItemUserId,
	item,
	variant,
	rawQuantity,
}: {
	cartItemUserId: string;
	item: Item;
	variant: Variant;
	rawQuantity: number;
}) {
	try {
		// Get existing cart item to know the price_variant
		const { data: existingItem, error: fetchError } = await supabase
			.from("CartItemUser")
			.select("price_variant")
			.eq("cart_item_user_id", cartItemUserId)
			.single();

		if (fetchError || !existingItem) {
			return {
				success: false,
				error: "CART_ITEM_NOT_FOUND",
				realQuantity: 0,
			};
		}

		const priceType: "Retail" | "Wholesale" = existingItem.price_variant;

		// Compute real quantity based on the existing priceType
		const realQuantity =
			priceType === "Wholesale"
				? rawQuantity * (variant.variant_wholesale_item ?? 1)
				: rawQuantity;

		// Compute subtotal
		const unitPrice =
			priceType === "Wholesale"
				? (variant.variant_price_wholesale ?? 0)
				: variant.variant_price_retail;

		const computedSubtotal = unitPrice * realQuantity;

		// STOCK CHECK
		if (realQuantity > variant.variant_stocks) {
			return {
				success: false,
				error: "OUT_OF_STOCK_EXCEEDED",
				message: `Requested ${realQuantity.toLocaleString()} ${
					realQuantity > 1
						? `${item.item_sold_by}s`
						: item.item_sold_by
				} exceeds available stocks (${variant.variant_stocks.toLocaleString()}).`,
				realQuantity,
			};
		}

		// UPDATE Cart Item
		const { error: updateError } = await supabase
			.from("CartItemUser")
			.update({
				quantity: realQuantity,
				subtotal: computedSubtotal,
			})
			.eq("cart_item_user_id", cartItemUserId);

		if (updateError) {
			return { success: false, error: updateError.message, realQuantity };
		}

		return { success: true, realQuantity };
	} catch (err: any) {
		return { success: false, error: err.message, realQuantity: 0 };
	}
}
