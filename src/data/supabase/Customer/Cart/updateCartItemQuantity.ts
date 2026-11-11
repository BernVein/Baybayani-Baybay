import { supabase } from "@/config/supabaseclient";
import { Item } from "@/model/Item";
import { Variant } from "@/model/variant";

export async function updateCartItemQuantity({
  cartItemUserId,
  item,
  variant,
  currentVariantId,
  rawQuantity,
}: {
  cartItemUserId: string;
  item: Item;
  variant: Variant;
  /** The variant the cart row points to now, so a variant switch can be saved. */
  currentVariantId: string;
  rawQuantity: number;
}) {
  try {
    const realQuantity = rawQuantity;

    if (!Number.isFinite(realQuantity) || realQuantity <= 0) {
      return {
        success: false,
        error: "INVALID_QUANTITY",
        message: "Quantity must be greater than 0.",
        realQuantity,
      };
    }

    const wholesaleThreshold = variant.variant_wholesale_item ?? Infinity;

    const effectivePriceType: "Retail" | "Wholesale" =
      realQuantity >= wholesaleThreshold ? "Wholesale" : "Retail";

    // Select the unit price based on the computed price type
    const unitPrice =
      effectivePriceType === "Wholesale"
        ? (variant.variant_price_wholesale ?? 0)
        : (variant.variant_price_retail ?? 0);

    const computedSubtotal = unitPrice * realQuantity;

    const availableStocks =
      variant.variant_stock_latest_movement.effective_stocks ?? 0;

    if (realQuantity > availableStocks) {
      return {
        success: false,
        error: "OUT_OF_STOCK_EXCEEDED",
        message: `Requested ${realQuantity.toLocaleString()} ${
          realQuantity > 1 ? `${item.item_sold_by}s` : item.item_sold_by
        } exceeds available stocks (${availableStocks.toLocaleString()}).`,
        realQuantity,
      };
    }

    // If the customer picked a different variant, point the cart row at a
    // fresh snapshot of it; otherwise the row keeps the old variant while the
    // subtotal is priced from the new one.
    let newSnapshotId: string | null = null;

    if (variant.variant_id !== currentVariantId) {
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
          realQuantity,
        };
      }

      newSnapshotId = snapshot.variant_snapshot_id;
    }

    const { error: updateError } = await supabase
      .from("CartItemUser")
      .update({
        quantity: realQuantity,
        subtotal: computedSubtotal,
        price_variant: effectivePriceType,
        ...(newSnapshotId && { variant_snapshot_id: newSnapshotId }),
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
