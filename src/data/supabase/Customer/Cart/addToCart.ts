import { supabase } from "@/config/supabaseclient";
import { Variant } from "@/model/variant";

export async function addToCart(
  userId: string,
  item_id: string,
  item_sold_by: string,
  variant: Variant,
  quantityToAdd: number,
) {
  try {
    /* =========================================================
     * 1. FIND OR CREATE CART
     * ======================================================= */

    const { data: existingCart, error: cartFetchError } = await supabase
      .from("Cart")
      .select("*")
      .eq("user_id", userId)
      .eq("is_soft_deleted", false)
      .maybeSingle();

    if (cartFetchError)
      return { success: false, error: cartFetchError.message };

    let cartId = existingCart?.cart_id;

    if (!cartId) {
      const { data: newCart, error: cartInsertError } = await supabase
        .from("Cart")
        .insert({ user_id: userId })
        .select()
        .single();

      if (cartInsertError || !newCart) {
        return {
          success: false,
          error: cartInsertError?.message ?? "CART_CREATE_FAILED",
        };
      }

      cartId = newCart.cart_id;
    }

    /* =========================================================
     * 2. CREATE VARIANT SNAPSHOT (PRICE HISTORY)
     * ======================================================= */

    const { data: snapshot, error: snapshotError } = await supabase
      .from("VariantSnapshot")
      .insert({
        variant_copy_snapshot_id: variant.variant_id,
        variant_snapshot_name: variant.variant_name,
        variant_snapshot_price_retail: variant.variant_price_retail,
        variant_snapshot_price_wholesale: variant.variant_price_wholesale,
        variant_snapshot_wholesale_item: variant.variant_wholesale_item,
      })
      .select()
      .single();

    if (snapshotError || !snapshot) {
      return {
        success: false,
        error: snapshotError?.message ?? "SNAPSHOT_CREATE_FAILED",
      };
    }

    /* =========================================================
     * 3. GET EXISTING CART ITEMS FOR THIS VARIANT
     *    IMPORTANT:
     *    We compare using `variant_copy_snapshot_id`
     *    NOT `variant_snapshot_id`
     * ======================================================= */

    const { data: cartItems, error: cartItemsError } = await supabase
      .from("CartItemUser")
      .select(
        `
                *,
                VariantSnapshot (
                    variant_copy_snapshot_id
                )
            `,
      )
      .eq("cart_id", cartId)
      .eq("item_id", item_id)
      .eq("is_soft_deleted", false);

    if (cartItemsError)
      return { success: false, error: cartItemsError.message };

    // Filter rows that belong to THIS variant (regardless of snapshot)
    const existingItemsForVariant =
      cartItems?.filter(
        (c) =>
          c.VariantSnapshot?.variant_copy_snapshot_id === variant.variant_id,
      ) ?? [];

    /* =========================================================
     * 4. COMPUTE TOTAL QUANTITY
     * ======================================================= */

    const existingQuantity = existingItemsForVariant.reduce(
      (sum, c) => sum + Number(c.quantity),
      0,
    );

    const totalQuantity = existingQuantity + quantityToAdd;

    /* =========================================================
     * 5. STOCK VALIDATION
     * ======================================================= */

    if (
      totalQuantity >
      (variant.variant_stock_latest_movement?.effective_stocks ?? 0)
    ) {
      return {
        success: false,
        error: "OUT_OF_STOCK_EXCEEDED",
        message: `You already have ${existingQuantity} ${item_sold_by}${
          existingQuantity > 1 ? "s" : ""
        } in your cart. Adding ${quantityToAdd} exceeds available stock.`,
      };
    }

    /* =========================================================
     * 6. DETERMINE PRICE TIER (AUTO)
     * ======================================================= */

    const isWholesale =
      variant.variant_wholesale_item &&
      totalQuantity >= variant.variant_wholesale_item;

    const effectivePriceType = isWholesale ? "Wholesale" : "Retail";

    const unitPrice = isWholesale
      ? (variant.variant_price_wholesale ?? 0)
      : variant.variant_price_retail;

    const computedSubtotal = (unitPrice ?? 0) * totalQuantity;

    /* =========================================================
     * 7. UPDATE OR INSERT CART ITEM
     *    RULE:
     *    ONE ROW PER VARIANT PER CART
     * ======================================================= */

    if (existingItemsForVariant.length > 0) {
      // Update the first existing row
      const mainItem = existingItemsForVariant[0];

      const { error: updateError } = await supabase
        .from("CartItemUser")
        .update({
          quantity: totalQuantity,
          subtotal: computedSubtotal,
          price_variant: effectivePriceType,
        })
        .eq("cart_item_user_id", mainItem.cart_item_user_id);

      if (updateError) return { success: false, error: updateError.message };

      // Soft-delete duplicates if they exist (safety net)
      const duplicateIds = existingItemsForVariant
        .slice(1)
        .map((c) => c.cart_item_user_id);

      if (duplicateIds.length > 0) {
        await supabase
          .from("CartItemUser")
          .update({ is_soft_deleted: true })
          .in("cart_item_user_id", duplicateIds);
      }
    } else {
      // No existing row → insert new
      const { error: insertError } = await supabase
        .from("CartItemUser")
        .insert({
          cart_id: cartId,
          item_id,
          variant_snapshot_id: snapshot.variant_snapshot_id,
          price_variant: effectivePriceType,
          quantity: totalQuantity,
          subtotal: computedSubtotal,
        });

      if (insertError) return { success: false, error: insertError.message };
    }

    /* =========================================================
     * 8. NOTIFY UI
     * ======================================================= */

    window.dispatchEvent(new CustomEvent("baybayani:cart-updated"));

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
