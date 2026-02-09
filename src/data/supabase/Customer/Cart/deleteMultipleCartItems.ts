import { supabase } from "@/config/supabaseclient";

export async function deleteMultipleCartItems(cartItemUserIds: string[]) {
    const { error } = await supabase
        .from("CartItemUser")
        .delete()
        .in("cart_item_user_id", cartItemUserIds);

    if (error) {
        throw error;
    }
    window.dispatchEvent(new CustomEvent("baybayani:cart-updated"));

    return true;
}
