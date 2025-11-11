import { supabase } from "@/config/supabaseclient";
import { Item } from "@/model/Item";
import { Variant } from "@/model/variant";

export async function addToCart(
	userId: string,
	item: Item,
	variant: Variant,
	priceType: "Retail" | "Wholesale",
	quantity: number,
	subtotal: number
) {
	try {
		// Find or create a cart for the user
		const { data: existingCart, error: findErr } = await supabase
			.from("Cart")
			.select("*")
			.eq("user_id", userId)
			.eq("is_soft_deleted", false)
			.maybeSingle();

		if (findErr) throw findErr;

		let cartId = existingCart?.cart_id;
		if (!cartId) {
			const { data: newCart, error: newErr } = await supabase
				.from("Cart")
				.insert({ user_id: userId })
				.select()
				.single();
			if (newErr) throw newErr;
			cartId = newCart.cart_id;
		}

		// Make a snapshot of the variant’s current prices
		const { data: snapshot, error: snapErr } = await supabase
			.from("VariantSnapshot")
			.insert({
				variant_snapshot_id: variant.variant_id,
				variant_snapshot_name: variant.variant_name,
				variant_snapshot_price_retail: variant.variant_price_retail,
				variant_snapshot_price_wholesale:
					variant.variant_price_wholesale,
				variant_snapshot_wholesale_item: variant.variant_wholesale_item,
			})
			.select()
			.single();
		if (snapErr) throw snapErr;

		// Check if same item already exists in this cart
		const { data: existingItem } = await supabase
			.from("CartItemUser")
			.select("*")
			.eq("cart_id", cartId)
			.eq("item_id", item.item_id)
			.eq("price_variant", priceType)
			.eq("is_soft_deleted", false)
			.maybeSingle();

		if (existingItem) {
			await supabase
				.from("CartItemUser")
				.update({
					quantity: existingItem.quantity + quantity,
					subtotal: existingItem.subtotal + subtotal,
				})
				.eq("cart_item_user_id", existingItem.cart_item_user_id);
		} else {
			await supabase.from("CartItemUser").insert({
				cart_id: cartId,
				item_id: item.item_id,
				variant_snapshot_id: snapshot.variant_snapshot_id,
				price_variant: priceType,
				quantity,
				subtotal,
			});
		}

		return { success: true };
	} catch (err: any) {
		console.error("Add-to-cart failed:", err.message);
		return { success: false, error: err.message };
	}
}
