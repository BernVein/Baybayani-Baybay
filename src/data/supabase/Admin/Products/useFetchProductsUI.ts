import { useEffect, useState } from "react";
import { supabase } from "@/config/supabaseclient";
import { ItemTableRow } from "@/model/ui/Admin/item_table_row";

export const useFetchProductsUI = () => {
    const [items, setItems] = useState<ItemTableRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from("Item")
                .select(
                    `
                    item_id,
                    item_sold_by,
                    item_title,
                    Category (
                        category_name
                    ),
                    Tag (
                        tag_name
                    ),
                    Variant (
                        variant_id,
                        variant_price_retail,
                        variant_price_wholesale,
                        variant_stocks
                    ),
                    Item_Image (
                        item_image_url
                    )
                `,
                )
                .eq("is_soft_deleted", false)
                .order("created_at", {
                    foreignTable: "Item_Image",
                    ascending: true,
                })
                .limit(1, { foreignTable: "Item_Image" });

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }

            const formatted: ItemTableRow[] = (data ?? []).map((item: any) => {
                const variants = item.Variant ?? [];

                const prices = variants.flatMap((v: any) =>
                    [v.variant_price_retail, v.variant_price_wholesale].filter(
                        (p) => typeof p === "number",
                    ),
                );

                return {
                    item_id: item.item_id,
                    item_variant_count: variants.length,
                    item_min_price: prices.length ? Math.min(...prices) : 0,
                    item_sold_by: item.item_sold_by,
                    item_name: item.item_title,
                    variant_stock: variants.reduce(
                        (sum: number, v: any) => sum + (v.variant_stocks ?? 0),
                        0,
                    ),
                    item_img_url: item.Item_Image?.[0]?.item_image_url ?? "",
                    item_category:
                        item.Category?.category_name ?? "Uncategorized",
                    item_tag: item.Tag?.tag_name ?? undefined,
                };
            });

            setItems(formatted);
            setLoading(false);
        };

        fetchItems();
    }, []);

    return {
        items,
        loading,
        error,
    };
};
