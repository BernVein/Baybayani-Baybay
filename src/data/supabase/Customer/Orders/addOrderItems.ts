import { supabase } from "@/config/supabaseclient";
import { CartItemUser } from "@/model/cartItemUser";

export async function addOrderItems(
    user_id: string,
    cart_items: CartItemUser[],
) {
    if (!cart_items.length) return;

    const orderItems = cart_items.map((cartItemUser: CartItemUser) => ({
        status: "Processing",
        item_id: cartItemUser.item.item_id,
        user_id: user_id,
        variant_snapshot_id: cartItemUser.variant_snapshot.variant_snapshot_id,
        price_variant: cartItemUser.price_variant,
        quantity: cartItemUser.quantity,
        subtotal: cartItemUser.subtotal,
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
