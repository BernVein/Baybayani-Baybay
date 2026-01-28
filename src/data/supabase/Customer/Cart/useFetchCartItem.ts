import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/config/supabaseclient";
import { CartItemUser } from "@/model/cartItemUser";
import { Item } from "@/model/Item";
import { Variant } from "@/model/variant";
import { VariantSnapshot } from "@/model/variantSnapshot";

export const useFetchCartItems = (
    cartItemUserIds: string | string[] | null,
) => {
    const [cartItems, setCartItems] = useState<CartItemUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const normalizedIds = useMemo(() => {
        return Array.isArray(cartItemUserIds)
            ? cartItemUserIds
            : cartItemUserIds
              ? [cartItemUserIds]
              : [];
    }, [cartItemUserIds]);

    const fetchCartItems = useCallback(async () => {
        if (normalizedIds.length === 0) {
            setCartItems([]);
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        const { data, error } = await supabase
            .from("CartItemUser")
            .select(
                `
        *,
        Item (
          *,
          Item_Image ( item_image_url ),
          Variant ( * )
        ),
        VariantSnapshot ( * )
      `,
            )
            .in("cart_item_user_id", normalizedIds)
            .eq("is_soft_deleted", false);

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
            return;
        }

        const mapped: CartItemUser[] =
            data?.map((row: any) => ({
                cart_item_user_id: row.cart_item_user_id,

                item: (row.Item
                    ? {
                          item_id: row.Item.item_id,
                          item_category: String(row.Item.item_category || ""),
                          item_title: row.Item.item_title,
                          item_img:
                              row.Item.Item_Image?.map(
                                  (img: any) => img.item_image_url,
                              ) ?? [],
                          item_sold_by: row.Item.item_sold_by,
                          item_description: row.Item.item_description,
                          item_tag: row.Item.item_tag ?? null,
                          is_soft_deleted: row.Item.is_soft_deleted,
                          last_updated: row.Item.last_updated,
                          created_at: String(row.Item.created_at || ""),
                          item_variants:
                              row.Item.Variant?.map((v: Variant) => ({
                                  variant_id: v.variant_id,
                                  variant_name: v.variant_name,
                                  variant_price_retail: Number(
                                      v.variant_price_retail,
                                  ),
                                  variant_price_wholesale:
                                      v.variant_price_wholesale ?? null,
                                  variant_wholesale_item:
                                      v.variant_wholesale_item ?? null,
                                  variant_stocks: Number(v.variant_stocks ?? 0),
                                  variant_last_updated_stock:
                                      v.variant_last_updated_stock ?? "",
                                  variant_last_updated_price_retail:
                                      v.variant_last_updated_price_retail ??
                                      null,
                                  variant_last_price_retail:
                                      v.variant_last_price_retail ?? undefined,
                                  variant_last_updated_price_wholesale:
                                      v.variant_last_updated_price_wholesale ??
                                      null,
                                  variant_last_price_wholesale:
                                      v.variant_last_price_wholesale ?? null,
                                  last_updated: v.last_updated ?? "",
                                  is_soft_deleted: v.is_soft_deleted ?? false,
                                  created_at: v.created_at ?? "",
                              })) ?? [],
                      }
                    : {
                          item_id: "",
                          item_category: "",
                          item_title: "",
                          item_img: [],
                          item_sold_by: "",
                          item_description: "",
                          item_tag: null,
                          is_soft_deleted: false,
                          last_updated: "",
                          created_at: "",
                          item_variants: [],
                      }) as Item,

                variant_snapshot: (row.VariantSnapshot
                    ? {
                          variant_snapshot_id:
                              row.VariantSnapshot.variant_snapshot_id,
                          variant_copy_snapshot_id:
                              row.VariantSnapshot.variant_copy_snapshot_id,
                          variant_snapshot_name:
                              row.VariantSnapshot.variant_snapshot_name,
                          variant_snapshot_price_retail: Number(
                              row.VariantSnapshot.variant_snapshot_price_retail,
                          ),
                          variant_snapshot_price_wholesale:
                              row.VariantSnapshot
                                  .variant_snapshot_price_wholesale !== null
                                  ? Number(
                                        row.VariantSnapshot
                                            .variant_snapshot_price_wholesale,
                                    )
                                  : null,
                          variant_snapshot_wholesale_item:
                              row.VariantSnapshot
                                  .variant_snapshot_wholesale_item !== null
                                  ? Number(
                                        row.VariantSnapshot
                                            .variant_snapshot_wholesale_item,
                                    )
                                  : null,
                          last_updated: row.VariantSnapshot.last_updated ?? "",
                          is_soft_deleted:
                              row.VariantSnapshot.is_soft_deleted ?? false,
                          created_at: row.VariantSnapshot.created_at ?? "",
                      }
                    : {
                          variant_snapshot_id: "",
                          variant_copy_snapshot_id: "",
                          variant_snapshot_name: "",
                          variant_snapshot_price_retail: 0,
                          variant_snapshot_price_wholesale: null,
                          variant_snapshot_wholesale_item: null,
                          last_updated: "",
                          is_soft_deleted: false,
                          created_at: "",
                      }) as VariantSnapshot,

                price_variant: String(row.price_variant ?? ""),
                quantity: Number(row.quantity ?? 0),
                subtotal: Number(row.subtotal ?? 0),
                is_soft_deleted: row.is_soft_deleted,
                created_at: row.created_at ?? "",
                updated_at: row.updated_at ?? "",
            })) ?? [];

        setCartItems(mapped);
        setLoading(false);
    }, [normalizedIds]);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    useEffect(() => {
        const handleCartUpdate = () => fetchCartItems();
        window.addEventListener("baybayani:cart-updated", handleCartUpdate);
        return () => {
            window.removeEventListener(
                "baybayani:cart-updated",
                handleCartUpdate,
            );
        };
    }, [fetchCartItems]);

    return {
        cartItems,
        loading,
        errorMsg,
        refetch: fetchCartItems,
    };
};
