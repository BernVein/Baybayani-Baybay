import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";
import { ItemCard } from "@/model/ui/item_card";

export const useFetchItemCardItems = (
    activeCategories: string[],
    searchTerm: string | null,
    itemsPerPage = 8,
) => {
    const [items, setItems] = useState<ItemCard[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchItems = useCallback(
        async (pageNum = 0, reset = false) => {
            setLoading(true);
            setError(null);

            const from = pageNum * itemsPerPage;
            const to = from + itemsPerPage - 1;

            let query = supabase
                .from("Item")
                .select(
                    `
                    item_id,
					Tag(tag_name),
                    Category(category_name),
					item_title,
					item_sold_by,
					Item_Image(item_image_url),
					Variant(variant_price_retail)
				`,
                )
                .eq("is_soft_deleted", false)
                .order("item_title", { ascending: false })
                .range(from, to);

            if (activeCategories.length > 0) {
                query = query.in("item_category", activeCategories);
            }

            if (searchTerm?.trim()) {
                query = query.ilike("item_title", `%${searchTerm}%`);
            }

            const { data, error } = await query;
            setLoading(false);

            if (error) {
                console.error(error);
                setError(error.message);
                return;
            }

            const mapped: ItemCard[] = (data ?? [])
                .map((row: any) => {
                    const firstVariant = row.Variant?.[0];
                    if (!firstVariant?.variant_price_retail) return null;

                    return {
                        item_id: row.item_id,
                        item_category: row.Category?.category_name ?? "",
                        item_tag: row.Tag?.tag_name ?? null,
                        item_title: row.item_title,
                        item_sold_by: row.item_sold_by,
                        item_first_img:
                            row.Item_Image?.[0]?.item_image_url ?? "",
                        item_first_variant_retail_price: Number(
                            firstVariant.variant_price_retail,
                        ),
                    };
                })
                .filter(Boolean) as ItemCard[];

            setHasMore((data ?? []).length === itemsPerPage);

            if (reset) {
                setItems(mapped);
            } else {
                setItems((prev) => [...prev, ...mapped]);
            }
        },
        [activeCategories, searchTerm, itemsPerPage],
    );

    useEffect(() => {
        setPage(0);
        setItems([]);
        setHasMore(true);
        fetchItems(0, true);
    }, [activeCategories, searchTerm, fetchItems]);

    const loadMore = async () => {
        if (loading || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchItems(nextPage);
    };

    return {
        items,
        loading,
        error,
        loadMore,
        hasMore,
    };
};
