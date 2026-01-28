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
        const realQuantity = rawQuantity;

        const wholesaleThreshold = variant.variant_wholesale_item ?? Infinity;

        const effectivePriceType: "Retail" | "Wholesale" =
            realQuantity >= wholesaleThreshold ? "Wholesale" : "Retail";

        // Select the unit price based on the computed price type
        const unitPrice =
            effectivePriceType === "Wholesale"
                ? (variant.variant_price_wholesale ?? 0)
                : (variant.variant_price_retail ?? 0);

        const computedSubtotal = unitPrice * realQuantity;

        const availableStocks = variant.variant_stocks ?? 0;
        if (realQuantity > availableStocks) {
            return {
                success: false,
                error: "OUT_OF_STOCK_EXCEEDED",
                message: `Requested ${realQuantity.toLocaleString()} ${
                    realQuantity > 1
                        ? `${item.item_sold_by}s`
                        : item.item_sold_by
                } exceeds available stocks (${availableStocks.toLocaleString()}).`,
                realQuantity,
            };
        }

        const { error: updateError } = await supabase
            .from("CartItemUser")
            .update({
                quantity: realQuantity,
                subtotal: computedSubtotal,
                price_variant: effectivePriceType,
            })
            .eq("cart_item_user_id", cartItemUserId);

        if (updateError) {
            return {
                success: false,
                error: updateError.message,
                realQuantity,
            };
        }

        window.dispatchEvent(new CustomEvent("baybayani:cart-updated"));

        return {
            success: true,
            realQuantity,
            priceVariant: effectivePriceType,
        };
    } catch (err: any) {
        return {
            success: false,
            error: err.message,
            realQuantity: 0,
        };
    }
}
