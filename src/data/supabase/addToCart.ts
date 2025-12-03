import { supabase } from "@/config/supabaseclient";
import { Item } from "@/model/Item";
import { Variant } from "@/model/variant";

export async function addToCart(
	userId: string,
	item: Item,
	variant: Variant,
	priceType: "Retail" | "Wholesale",
	rawQuantity: number
) {
	try {
		// Find or create cart
		const { data: existingCart } = await supabase
			.from("Cart")
			.select("*")
			.eq("user_id", userId)
			.eq("is_soft_deleted", false)
			.maybeSingle();

		let cartId = existingCart?.cart_id;
		if (!cartId) {
			const { data: newCart } = await supabase
				.from("Cart")
				.insert({ user_id: userId })
				.select()
				.single();
			cartId = newCart.cart_id;
		}

		// Compute quantity
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

		// Create snapshot
		const { data: snapshot } = await supabase
			.from("VariantSnapshot")
			.insert({
				variant_copy_snapshot_id: variant.variant_id,
				variant_snapshot_name: variant.variant_name,
				variant_snapshot_price_retail: variant.variant_price_retail,
				variant_snapshot_price_wholesale:
					variant.variant_price_wholesale,
				variant_snapshot_wholesale_item: variant.variant_wholesale_item,
			})
			.select()
			.single();

		// Find duplicates via the original variant ID
		const { data: potentialMatches } = await supabase
			.from("CartItemUser")
			.select("*, VariantSnapshot(variant_copy_snapshot_id)")
			.eq("cart_id", cartId)
			.eq("item_id", item.item_id)
			.eq("is_soft_deleted", false);

		const existingItemsForVariant =
			potentialMatches?.filter(
				(c) =>
					c.VariantSnapshot?.variant_copy_snapshot_id ===
					variant.variant_id
				) ?? [];

		const existingQuantitySum = existingItemsForVariant.reduce(
			(sum, c) => sum + Number(c.quantity),
			0
		);

		const newTotalQuantity = existingQuantitySum + realQuantity;

		// CHECK STOCK BEFORE ADDING
		if (newTotalQuantity > variant.variant_stocks) {
			return {
				success: false,
				error: "OUT_OF_STOCK_EXCEEDED",
				message: `Already have ${existingQuantitySum.toLocaleString()} ${
					existingQuantitySum > 1
						? `${item.item_sold_by}s`
						: item.item_sold_by
				} on cart. Adding ${realQuantity.toLocaleString()} ${
					realQuantity > 1
						? `${item.item_sold_by}s`
						: item.item_sold_by
				} exceeds stocks.`,
			};
		}

		const existingItemSamePrice = existingItemsForVariant.find(
			(c) => c.price_variant === priceType
		);

		if (existingItemSamePrice) {
			await supabase
				.from("CartItemUser")
				.update({
					quantity: Number(existingItemSamePrice.quantity) + realQuantity,
					subtotal:
						Number(existingItemSamePrice.subtotal) + computedSubtotal,
				})
				.eq("cart_item_user_id", existingItemSamePrice.cart_item_user_id);
		} else {
			await supabase.from("CartItemUser").insert({
				cart_id: cartId,
				item_id: item.item_id,
				variant_snapshot_id: snapshot.variant_snapshot_id,
				price_variant: priceType,
				quantity: realQuantity,
				subtotal: computedSubtotal,
			});
		}

		return { success: true };
	} catch (err: any) {
		return { success: false, error: err.message };
	}
}
