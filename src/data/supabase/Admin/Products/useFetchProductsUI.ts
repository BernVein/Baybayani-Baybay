import { useEffect, useState, useCallback, useMemo } from "react";

import { supabase } from "@/config/supabaseclient";
import { ItemTableRow } from "@/model/ui/Admin/item_table_row";

export const useFetchProductsUI = (
  search: string = "",
  selectedCategories: string[] = [],
) => {
  const [allItems, setAllItems] = useState<ItemTableRow[]>([]);
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
                    item_has_variant,
                    Category ( category_id, category_name ),
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

        const variantStocks = variants.map((v: any) => {
          const movements = v.StockMovement ?? [];
          const stock = movements.reduce(
            (sum: number, m: any) => sum + (m.effective_stocks ?? 0),
            0,
          );

          return { ...v, currentStock: stock };
        });

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
          item_has_variant: item.item_has_variant,
          variant_stock: variantStocks.reduce(
            (sum: number, v: any) => sum + (v.currentStock ?? 0),
            0,
          ),
          item_img_url: item.Item_Image?.[0]?.item_image_url ?? "",
          item_category: item.Category?.category_name ?? "Uncategorized",
          item_category_id: item.Category?.category_id ?? null,
          item_tag: item.Tag?.tag_name ?? undefined,
        };
      });

      setAllItems(formatted);
    } catch (err: any) {
      setError(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // --- CLIENT-SIDE FILTERING ---
  const items = useMemo(() => {
    return allItems.filter((item) => {
      const q = search.trim().toLowerCase();

      const matchesSearch =
        !q ||
        item.item_name.toLowerCase().includes(q) ||
        item.item_category.toLowerCase().includes(q) ||
        item.item_sold_by.toLowerCase().includes(q);

      // Filter by selected categories (only category IDs)
      const categoryKeys = selectedCategories.filter(
        (k) => k !== "with-variant" && k !== "no-variant",
      );
      const matchesCategory =
        categoryKeys.length === 0 ||
        categoryKeys.includes(
          item.item_category_id ? String(item.item_category_id) : "null",
        );

      // Filter by selected variant type
      const variantKeys = selectedCategories.filter(
        (k) => k === "with-variant" || k === "no-variant",
      );
      const matchesVariant =
        variantKeys.length === 0 ||
        variantKeys.includes(
          item.item_has_variant ? "with-variant" : "no-variant",
        );

      // Pass only if both match
      return matchesSearch && matchesCategory && matchesVariant;
    });
  }, [allItems, search, selectedCategories]);

  return {
    items,
    allItems,
    loading,
    error,
    refetch: fetchItems,
  };
};
