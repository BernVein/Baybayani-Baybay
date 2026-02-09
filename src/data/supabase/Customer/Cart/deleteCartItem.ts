import { supabase } from "@/config/supabaseclient";

export async function deleteCartItem(cartItemUserId: string) {
    const { error } = await supabase
        .from("CartItemUser")
        .delete()
        .eq("cart_item_user_id", cartItemUserId);

    if (error) {
        throw error;
    }
    window.dispatchEvent(new CustomEvent("baybayani:cart-updated"));

    return true;
}
