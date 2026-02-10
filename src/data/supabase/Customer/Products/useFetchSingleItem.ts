import { useEffect, useState } from "react";

import { supabase } from "@/config/supabaseclient";
import { Item } from "@/model/Item";
import { Variant } from "@/model/variant";
import { StockMovement } from "@/model/stockMovement";
export const useFetchItemById = (itemId: string | null) => {
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!itemId) return;

        const fetchItem = async () => {
            setLoading(true);
            setError(null);
            setItem(null);

            // Fetch item with variants
            const { data, error } = await supabase
                .from("Item")
                .select(`*, Item_Image(item_image_url), Variant(*)`)
                .eq("item_id", itemId)
                .eq("is_soft_deleted", false)
                .single();

            if (error) {
                setError(error.message);
                setLoading(false);

                return;
            }

            if (!data) {
                setItem(null);

                return;
            }
            const variantsRaw = data.Variant || [];

            // For each variant, get the latest stock from StockMovement
            const variants = await Promise.all(
                variantsRaw.map(async (v: Variant) => {
                    const { data: stockData } = await supabase
                        .from("StockMovement")
                        .select("effective_stocks")
                        .eq("variant_id", v.variant_id)
                        .eq("is_soft_deleted", false)
                        .order("created_at", { ascending: false })
                        .limit(1)
                        .single();

                    return {
                        variant_id: v.variant_id,
                        variant_name: v.variant_name,
                        variant_price_retail: Number(v.variant_price_retail),
                        variant_price_wholesale:
                            v.variant_price_wholesale === null
                                ? null
                                : Number(v.variant_price_wholesale),
                        variant_wholesale_item:
                            v.variant_wholesale_item === null
                                ? null
                                : Number(v.variant_wholesale_item),
                        variant_stock_latest_movement:
                            stockData as StockMovement,
                        variant_last_updated_stock:
                            v.variant_last_updated_stock,
                        variant_last_updated_price_retail:
                            v.variant_last_updated_price_retail ?? null,
                        variant_last_price_retail:
                            v.variant_last_price_retail === null
                                ? undefined
                                : Number(v.variant_last_price_retail),
                        variant_last_updated_price_wholesale:
                            v.variant_last_updated_price_wholesale ?? null,
                        variant_last_price_wholesale:
                            v.variant_last_price_wholesale === null
                                ? null
                                : Number(v.variant_last_price_wholesale),
                        last_updated: v.last_updated,
                        is_soft_deleted: v.is_soft_deleted,
                        created_at: v.created_at,
                    } satisfies Variant;
                }),
            );
            // Filter variants with zero stock
            const variantsInStock = variants.filter(
                (v) =>
                    v.variant_stock_latest_movement?.effective_stocks ?? 0 > 0,
            );

            if (variantsInStock.length === 0) {
                setItem(null);
                setLoading(false);

                return;
            }

            setItem({
                item_id: data.item_id,
                item_category: data.item_category,
                item_title: data.item_title,
                item_img:
                    data.Item_Image?.map((img: any) => img.item_image_url) ||
                    [],
                item_sold_by: data.item_sold_by,
                item_description: data.item_description,
                item_tag: data.item_tag ?? null,
                item_has_variant: data.item_has_variant,
                is_soft_deleted: data.is_soft_deleted,
                last_updated: data.last_updated,
                created_at: data.created_at,
                item_variants: variantsInStock,
            });
            setLoading(false);
        };
        fetchItem();
    }, [itemId]);

    return { item, loading, error };
};
