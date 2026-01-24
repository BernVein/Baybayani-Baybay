import { useEffect, useState } from "react";
import { supabase } from "@/config/supabaseclient";
import { OrderCard } from "@/model/ui/order_card";

const PAGE_SIZE = 6;

export const useFetchOrderCards = (userId?: string, page = 1) => {
    const [data, setData] = useState<OrderCard[]>([]);
    const [error, setError] = useState<any>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const from = (page - 1) * PAGE_SIZE;
                const to = from + PAGE_SIZE - 1;

                const {
                    data: rawData,
                    error: fetchError,
                    count,
                } = await supabase
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
                        { count: "exact" },
                    )
                    .eq("user_id", userId)
                    .eq("is_soft_deleted", false)
                    .order("created_at", { ascending: false })
                    .range(from, to);

                if (fetchError) {
                    setError(fetchError);
                    return;
                }
                setTotalPages(Math.ceil((count ?? 0) / PAGE_SIZE));
                const mapped: OrderCard[] = (rawData ?? []).map(
                    (order: any) => ({
                        order_item_user_id: order.order_item_user_id,
                        variant_name:
                            order.VariantSnapshot?.variant_snapshot_name ?? "",
                        variant_snapshot_id:
                            order.VariantSnapshot?.variant_copy_snapshot_id ??
                            "",
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
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, page]);

    return { data, error, totalPages, loading };
};
