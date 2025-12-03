import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";
import { Cart } from "@/model/cart";
import { Item } from "@/model/Item";
import { VariantSnapshot } from "@/model/variantSnapshot";
import { Variant } from "@/model/variant";
export const useFetchCart = (userId: string) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    // Fetch Cart + all related items, variants, snapshots
    const { data, error } = await supabase
      .from("Cart")
      .select(
        `*, CartItemUser(*, Item(*, Item_Image ( item_image_url ), Variant(*)), VariantSnapshot(variant_copy_snapshot_id, *))`
      )
      .eq("user_id", userId)
      .eq("is_soft_deleted", false)
      .maybeSingle();

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (!data) {
      setCart(null);
      setLoading(false);
      return;
    }

    const cart = data;

    const mapped: Cart = {
      cart_id: cart.cart_id,
      user_id: cart.user_id ?? "",
      is_soft_deleted: cart.is_soft_deleted,
      created_at: cart.created_at ?? "",
      updated_at: cart.updated_at ?? "",

      items: (cart.CartItemUser || [])
        .map((ciu: any) => ({
          cart_item_user_id: ciu.cart_item_user_id,
        item: (ciu.Item
          ? {
              item_id: ciu.Item.item_id,
              item_category: String(ciu.Item.item_category || ""),
              item_title: ciu.Item.item_title,
              item_img:
                ciu.Item.Item_Image?.map((img: any) => img.item_image_url) ??
                [],
              item_sold_by: ciu.Item.item_sold_by,
              item_description: ciu.Item.item_description,
              item_tag: ciu.Item.item_tag ?? null,
              is_soft_deleted: ciu.Item.is_soft_deleted,
              last_updated: ciu.Item.last_updated,
              created_at: String(ciu.Item.created_at || ""),
              item_variants:
                ciu.Item?.Variant?.map((v: Variant) => ({
                  variant_id: v.variant_id,
                  variant_name: v.variant_name,
                  variant_price_retail: Number(v.variant_price_retail),
                  variant_price_wholesale: v.variant_price_wholesale ?? null,
                  variant_wholesale_item: v.variant_wholesale_item ?? null,
                  variant_stocks: Number(v.variant_stocks ?? 0),
                  variant_last_updated_stock:
                    v.variant_last_updated_stock ?? "",
                  variant_last_updated_price_retail:
                    v.variant_last_updated_price_retail ?? null,
                  variant_last_price_retail:
                    v.variant_last_price_retail ?? undefined,
                  variant_last_updated_price_wholesale:
                    v.variant_last_updated_price_wholesale ?? null,
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

        variant_snapshot: (ciu.VariantSnapshot
          ? {
              variant_snapshot_id: ciu.VariantSnapshot.variant_snapshot_id,
              variant_copy_snapshot_id:
                ciu.VariantSnapshot.variant_copy_snapshot_id,
              variant_snapshot_name: ciu.VariantSnapshot.variant_snapshot_name,
              variant_snapshot_price_retail: Number(
                ciu.VariantSnapshot.variant_snapshot_price_retail
              ),
              variant_snapshot_price_wholesale:
                ciu.VariantSnapshot.variant_snapshot_price_wholesale !== null &&
                ciu.VariantSnapshot.variant_snapshot_price_wholesale !==
                  undefined
                  ? Number(ciu.VariantSnapshot.variant_snapshot_price_wholesale)
                  : null,
              variant_snapshot_wholesale_item:
                ciu.VariantSnapshot.variant_snapshot_wholesale_item !== null &&
                ciu.VariantSnapshot.variant_snapshot_wholesale_item !==
                  undefined
                  ? Number(ciu.VariantSnapshot.variant_snapshot_wholesale_item)
                  : null,
              last_updated: ciu.VariantSnapshot.last_updated ?? "",
              is_soft_deleted: ciu.VariantSnapshot.is_soft_deleted ?? false,
              created_at: ciu.VariantSnapshot.created_at ?? "",
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
        price_variant: String(ciu.price_variant ?? ""),
        quantity: Number(ciu.quantity ?? 0),
        subtotal: Number(ciu.subtotal ?? 0),
        is_soft_deleted: ciu.is_soft_deleted,
        created_at: ciu.created_at ?? "",
        updated_at: ciu.updated_at ?? "",
      }))
        .sort((a: any, b: any) => {
          const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
          if (aTime !== bTime) return aTime - bTime;
          return a.cart_item_user_id.localeCompare(b.cart_item_user_id);
        }),
    };
    // Save mapped carts to state
    setCart(mapped);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const subs: any[] = [];
    const cartChannel = supabase
      .channel(`cart-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Cart', filter: `user_id=eq.${userId}` },
        () => {
          fetchCart();
        }
      )
      .subscribe();
    subs.push(cartChannel);

    const cid = cart?.cart_id;
    if (cid) {
      const itemsChannel = supabase
        .channel(`cart-items-${cid}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'CartItemUser', filter: `cart_id=eq.${cid}` },
          () => {
            fetchCart();
          }
        )
        .subscribe();
      subs.push(itemsChannel);
    }

    return () => {
      subs.forEach((ch) => {
        supabase.removeChannel(ch);
      });
    };
  }, [userId, cart?.cart_id, fetchCart]);

  useEffect(() => {
    const handler = () => {
      fetchCart();
    };
    window.addEventListener('baybayani:cart-updated', handler);
    return () => {
      window.removeEventListener('baybayani:cart-updated', handler);
    };
  }, [fetchCart]);

  return { cart, loading, errorMsg, refetch: fetchCart };
};
