import { supabase } from "@/config/supabaseclient";
import { CartItemUser } from "@/model/cartItemUser";
export async function addOrderItems(
	user_id: string,
	cart_items: CartItemUser[]
) {
	const orderItems = cart_items.map((cartItemUser: CartItemUser) => ({
		item_id: cartItemUser.item.item_id,
		user_id: user_id,
		variant_snapshot_id: cartItemUser.variant_snapshot.variant_snapshot_id,
		price_variant: cartItemUser.price_variant,
		quantity: cartItemUser.quantity,
		subtotal: cartItemUser.subtotal,
	}));

	const { error } = await supabase.from("OrderItemUser").insert(orderItems);
	if (error) {
		console.error("Failed to add order items:", error);
		throw error;
	}
}
