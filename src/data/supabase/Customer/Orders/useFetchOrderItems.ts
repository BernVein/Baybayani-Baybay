import { useEffect, useState } from "react";
import { supabase } from "@/config/supabaseclient";
import { OrderCard } from "@/model/ui/order_card";

export const useFetchOrderCards = (userId?: string) => {
    const [data, setData] = useState<OrderCard[]>([]);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            try {
                const { data: rawData, error: fetchError } = await supabase
                    .from("OrderItemUser")
                    .select(
                        `
                            order_item_user_id,
                            VariantSnapshot(variant_snapshot_name, variant_copy_snapshot_id),
                            Item(item_title, item_sold_by, Item_Image(item_image_url), Variant(variant_id)),
                            subtotal,
                            quantity,
                            price_variant,
                            created_at,
                            status                            
                    `,
                    )
                    .eq("user_id", userId)
                    .eq("is_soft_deleted", false)
                    .order("created_at", { ascending: false });

                if (fetchError) {
                    setError(fetchError);
                    return;
                }

                const mapped: OrderCard[] = (rawData ?? []).map(
                    (order: any) => ({
                        order_item_user_id: order.order_item_user_id,
                        variant_name:
                            order.VariantSnapshot?.variant_snapshot_name ?? "",
                        variant_snapshot_id: order.variant_snapshot_id ?? "",
                        item_name: order.Item?.item_title ?? "",
                        item_sold_by: order.Item?.item_sold_by ?? "",
                        item_first_image:
                            order.Item?.Item_Image?.[0]?.item_image_url ?? "",
                        subtotal: Number(order.subtotal),
                        quantity: Number(order.quantity),
                        price_variant: order.price_variant ?? "",
                        date_ordered: order.created_at,
                        status: order.status,
                    }),
                );

                setData(mapped);
            } catch (err) {
                setError(err);
            }
        };

        fetchData();
    }, [userId]);

    return { data, error };
};
