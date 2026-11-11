import { supabase } from "@/config/supabaseclient";
import { CartItemUser } from "@/model/cartItemUser";

export async function addOrderItems(
	user_id: string,
	cart_items: CartItemUser[],
) {
	if (!cart_items.length) return;

	// 10 fully random characters (36^10 combinations), same xxx-xxx-xxxx shape.
	// The old version was mostly a timestamp with only 2 random characters,
	// so items ordered in the same millisecond could share an ID.
	const generateRandomId = () => {
		const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
		const id: string[] = [];

		while (id.length < 10) {
			const bytes = new Uint8Array(16);
			window.crypto.getRandomValues(bytes);
			for (const b of bytes) {
				// 252 = 36 * 7: drop bytes above it so every char is equally likely
				if (b < 252 && id.length < 10) id.push(chars[b % 36]);
			}
		}

		const combined = id.join("");
		return `${combined.slice(0, 3)}-${combined.slice(3, 6)}-${combined.slice(6, 10)}`;
	};
	const orderItems = cart_items.map((cartItemUser: CartItemUser) => ({
		status: "Pending",
		item_id: cartItemUser.item.item_id,
		user_id: user_id,
		variant_snapshot_id: cartItemUser.variant_snapshot.variant_snapshot_id,
		price_variant: cartItemUser.price_variant,
		quantity: cartItemUser.quantity,
		subtotal: cartItemUser.subtotal,
		order_identifier: generateRandomId(),
	}));

	const { error: insertError } = await supabase
		.from("OrderItemUser")
		.insert(orderItems);

	if (insertError) {
		throw insertError;
	}

	const cartItemIds = cart_items.map((c) => c.cart_item_user_id);
	const { error: deleteError } = await supabase
		.from("CartItemUser")
		.delete()
		.in("cart_item_user_id", cartItemIds);

	if (deleteError) {
		throw deleteError;
	}

	window.dispatchEvent(new CustomEvent("baybayani:cart-updated"));

	return true;
}
