import { supabase } from "@/config/supabaseclient";
import { CartItemUser } from "@/model/cartItemUser";

export async function addOrderItems(
	user_id: string,
	cart_items: CartItemUser[],
) {
	if (!cart_items.length) return;

	const generateRandomId = () => {
		const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
		const array = new Uint8Array(10);

		// Fills the array with cryptographically strong random bytes
		window.crypto.getRandomValues(array);

		// Map the random bytes to our character set
		const result = Array.from(array, (byte) => chars[byte % chars.length]);

		// Insert dashes at the 3rd and 6th indices (xxx-xxx-xxxx)
		return `${result.slice(0, 3).join("")}-${result.slice(3, 6).join("")}-${result.slice(6, 10).join("")}`;
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
