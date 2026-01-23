import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";
import { Item } from "@/model/Item";

export const useFetchItemUI = (
    activeCategories: string[],
    searchTerm: string | null,
    itemsPerPage = 8,
) => {
    const [itemList, setItemList] = useState<Item[]>([]); // all items fetched so far (pages appended)
    const [page, setPage] = useState(0); // current page index (0-based)
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true); // whether DB returned less than page size

    // fetchItems: fetch pageNum from DB, if reset === true replace list, else append
    const fetchItems = useCallback(
        async (pageNum = 0, reset = false) => {
            setLoading(true);
            setFetchError(null);
            const from = pageNum * itemsPerPage;
            const to = from + itemsPerPage - 1;

            // start building the query
            let query = supabase
                .from("Item")
                .select(`*, Item_Image(item_image_url), Variant(*)`) // nested selects (join-like)
                .eq("is_soft_deleted", false)
                .order("item_title", { ascending: false })
                .range(from, to); // pagination: range(offset, offset+limit-1)

            // apply category filter if provided
            if (activeCategories && activeCategories.length > 0) {
                query = query.in("item_category", activeCategories);
            }

            // apply search filter if provided: use ilike for case-insensitive partial match
            if (searchTerm && searchTerm.trim() !== "") {
                // .or lets you OR multiple conditions; ilike supports %wildcard%
                query = query.ilike("item_title", `%${searchTerm}%`);
            }

            const { data, error } = await query;
            setLoading(false);

            if (error) {
                console.error("Supabase error fetching items:", error);
                setFetchError(error.message || "Failed to fetch items.");
                return;
            }

            // Map DB rows into your frontend Item shape
            const mapped: Item[] = (data || [])
                .map((row: any) => {
                    // Filter variants with stock > 0
                    const variants = (row.Variant || [])
                        .map((v: any) => ({
                            variant_id: v.variant_id,
                            variant_name: v.variant_name,
                            variant_price_retail: Number(
                                v.variant_price_retail,
                            ),
                            variant_price_wholesale:
                                v.variant_price_wholesale === null
                                    ? null
                                    : Number(v.variant_price_wholesale),
                            variant_wholesale_item:
                                v.variant_wholesale_item === null
                                    ? null
                                    : Number(v.variant_wholesale_item),
                            variant_stocks: Number(
                                v.variant_stock ?? v.variant_stocks ?? 0,
                            ),
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
                        }))
                        .filter((v: any) => v.variant_stocks > 0); // filter out zero stock variants

                    // If no variants left after filtering, skip this item
                    if (variants.length === 0) return null;

                    return {
                        item_id: row.item_id,
                        item_category: row.item_category,
                        item_title: row.item_title,
                        item_img:
                            row.Item_Image?.map(
                                (img: any) => img.item_image_url,
                            ) || [],
                        item_sold_by: row.item_sold_by,
                        item_description: row.item_description,
                        item_tag: row.item_tag ?? null,
                        is_soft_deleted: row.is_soft_deleted,
                        last_updated: row.last_updated,
                        created_at: row.created_at,
                        item_variants: variants,
                    };
                })
                .filter(Boolean) as Item[]; // remove nulls (items with 0 stock variants)

            const originalCount = (data ?? []).length;
            setHasMore(originalCount === itemsPerPage);

            if (reset) {
                setItemList(mapped);
            } else {
                setItemList((prev) => [...prev, ...mapped]);
            }
        },
        [activeCategories, searchTerm, itemsPerPage],
    );

    // When activeCategory or searchTerm changes: reset page and fetch page 0
    useEffect(() => {
        setPage(0);
        setItemList([]);
        setHasMore(true);
        fetchItems(0, true);
        // note: fetchItems is stable via useCallback dependencies above
    }, [activeCategories, searchTerm, fetchItems]);

    // Function to load next page
    const loadMore = async () => {
        // if already loading or no more pages, skip
        if (loading || !hasMore) return;
        const next = page + 1;
        setPage(next);
        await fetchItems(next, false);
    };

    return {
        itemList,
        loading,
        fetchError,
        loadMore,
        hasMore,
    };
};
