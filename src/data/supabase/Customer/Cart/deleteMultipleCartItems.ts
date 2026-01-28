import { supabase } from "@/config/supabaseclient";

export async function deleteMultipleCartItems(cartItemUserIds: string[]) {
    if (cartItemUserIds.length === 0) return true;

    const { error } = await supabase
        .from("CartItemUser")
        .delete()
        .in("cart_item_user_id", cartItemUserIds);

    if (error) {
        console.error("Delete multiple cart items error:", error);
        throw error;
    }
    window.dispatchEvent(new CustomEvent("baybayani:cart-updated"));
    return true;
}
