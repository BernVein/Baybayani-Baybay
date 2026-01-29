import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";
import { CartCard } from "@/model/ui/Customer/cart_card";

export const useFetchCartItemsUI = (userId: string) => {
    const [items, setItems] = useState<CartCard[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const fetchCartCards = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setErrorMsg(null);

        const { data, error } = await supabase
            .from("Cart")
            .select(
                `
                    CartItemUser (
                      cart_item_user_id,
                      price_variant,
                      quantity,
                      subtotal,
                      Item (
                        item_title,
                        item_sold_by,
                        Item_Image (
                          item_image_url
                        )
                      ),
                      VariantSnapshot (
                        variant_snapshot_id,
                        variant_snapshot_name
                      )
                    )
                  `,
            )
            .eq("user_id", userId)
            .eq("is_soft_deleted", false)
            .order("cart_item_user_id", {
                foreignTable: "CartItemUser",
                ascending: true,
            })
            .maybeSingle();

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
            return;
        }

        const mapped: CartCard[] =
            data?.CartItemUser?.map(
                (ciu: any): CartCard => ({
                    cart_item_user_id: ciu.cart_item_user_id,

                    item_name: ciu.Item?.item_title ?? "",
                    item_sold_by: ciu.Item?.item_sold_by ?? "",

                    item_first_img:
                        ciu.Item?.Item_Image?.[0]?.item_image_url ?? "",

                    variant_snapshot_id:
                        ciu.VariantSnapshot?.variant_snapshot_id ?? "",
                    variant_snapshot_name:
                        ciu.VariantSnapshot?.variant_snapshot_name ?? "",

                    price_variant: ciu.price_variant ?? "",
                    quantity: Number(ciu.quantity ?? 0),
                    subtotal: Number(ciu.subtotal ?? 0),
                }),
            ) ?? [];

        setItems(mapped);
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        fetchCartCards();
    }, [fetchCartCards]);

    return {
        items,
        loading,
        errorMsg,
        refetch: fetchCartCards,
    };
};
