import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";
import { ItemTableRow } from "@/model/ui/Admin/item_table_row";

export const useFetchProductsUI = () => {
    const [items, setItems] = useState<ItemTableRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from("Item")
                .select(
                    `
          item_id,
          item_sold_by,
          item_title,
          Category ( category_name ),
          Tag ( tag_name ),
          Variant (
            variant_id,
            variant_price_retail,
            variant_price_wholesale,
            StockMovement ( effective_stocks )
          ),
          Item_Image ( item_image_url )
        `,
                )
                .eq("is_soft_deleted", false);

            if (error) throw error;

            const formatted: ItemTableRow[] = (data ?? []).map((item: any) => {
                const variants = item.Variant ?? [];

                // Compute current stock per variant by summing effective_stocks
                const variantStocks = variants.map((v: any) => {
                    const movements = v.StockMovement ?? [];
                    const stock = movements.reduce(
                        (sum: number, m: any) =>
                            sum + (m.effective_stocks ?? 0),
                        0,
                    );
                    return { ...v, currentStock: stock };
                });

                // Get all prices
                const prices = variantStocks.flatMap((v: any) =>
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
                    variant_stock: variantStocks.reduce(
                        (sum: number, v: any) => sum + (v.currentStock ?? 0),
                        0,
                    ),
                    item_img_url: item.Item_Image?.[0]?.item_image_url ?? "",
                    item_category:
                        item.Category?.category_name ?? "Uncategorized",
                    item_tag: item.Tag?.tag_name ?? undefined,
                };
            });

            setItems(formatted);
        } catch (err: any) {
            setError(err.message || JSON.stringify(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return {
        items,
        loading,
        error,
        refetch: fetchItems,
    };
};
