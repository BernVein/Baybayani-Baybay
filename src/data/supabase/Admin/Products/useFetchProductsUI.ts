import { useEffect, useState, useCallback, useMemo } from "react";

import { supabase } from "@/config/supabaseclient";
import { ItemTableRow } from "@/model/ui/Admin/item_table_row";

export const useFetchProductsUI = (
	search: string = "",
	selectedCategories: string[] = [],
	sortConfig: { column: string; direction: "asc" | "desc" } | null = null,
	page: number = 1,
	pageSize: number = 20,
) => {
	const [allItems, setAllItems] = useState<ItemTableRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [totalCount, setTotalCount] = useState<number>(0);

	const fetchItems = useCallback(async () => {
		setLoading(true);
		setError(null);

		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		try {
			let query = supabase
				.from("Item")
				.select(
					`
                    item_id,
                    item_sold_by,
                    item_title,
                    item_has_variant,
					created_at,
                    Category ( category_id, category_name ),
                    Tag ( tag_name ),
                    Variant (
                        variant_id,
                        variant_price_retail,
                        variant_price_wholesale,
                        variant_low_stock_threshold,
                        is_soft_deleted,
                        StockMovement ( 
                          effective_stocks,
                          created_at
                        )
                    ),
                    Item_Image ( item_image_url )
                `,
					{ count: "exact" },
				)
				.eq("is_soft_deleted", false);

			// Server-side filtering
			if (search.trim() !== "") {
				query = query.or(
					`item_title.ilike.%${search}%,item_sold_by.ilike.%${search}%`,
				);
			}

			const categoryKeys = selectedCategories.filter(
				(k) => k !== "with-variant" && k !== "no-variant",
			);
			if (categoryKeys.length > 0) {
				const hasNull = categoryKeys.includes("null");
				const numericKeys = categoryKeys
					.filter((k) => k !== "null")
					.map(Number);

				if (numericKeys.length > 0 && hasNull) {
					query = query.or(
						`category_id.in.(${numericKeys.join(
							",",
						)}),category_id.is.null`,
					);
				} else if (numericKeys.length > 0) {
					query = query.in("category_id", numericKeys);
				} else if (hasNull) {
					query = query.is("category_id", null);
				}
			}

			const variantKeys = selectedCategories.filter(
				(k) => k === "with-variant" || k === "no-variant",
			);
			if (variantKeys.length === 1) {
				// Only if either one is selected, not both
				query = query.eq(
					"item_has_variant",
					variantKeys[0] === "with-variant",
				);
			}

			if (sortConfig) {
				// Only alphabetical and date can be easily sorted in DB for now
				if (
					sortConfig.column === "item_title" ||
					sortConfig.column === "created_at"
				) {
					query = query.order(sortConfig.column, {
						ascending: sortConfig.direction === "asc",
					});
				}
			} else {
				query = query.order("created_at", {
					ascending: false,
				});
			}

			const { data, error, count } = await query.range(from, to);

			if (error) throw error;

			setTotalCount(count ?? 0);

			const formatted: ItemTableRow[] = (data ?? []).map((item: any) => {
				// Only include variants that are not soft-deleted
				const variants = (item.Variant ?? []).filter(
					(v: any) => !v.is_soft_deleted,
				);

				const variantStocks = variants.map((v: any) => {
					// Ordered StockMovement by created_at desc, the first one is the latest
					const latestMovement = v.StockMovement?.[0] ?? null;
					const stock = latestMovement?.effective_stocks ?? 0;

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
					item_category:
						item.Category?.category_name ?? "Uncategorized",
					item_category_id: item.Category?.category_id ?? null,
					item_tag: item.Tag?.tag_name ?? undefined,
					low_stock_variants: variantStocks.filter(
						(v: any) =>
							v.currentStock <=
								(v.variant_low_stock_threshold ?? 0) &&
							v.currentStock > 0,
					).length,
					no_stock_variants: variantStocks.filter(
						(v: any) => v.currentStock <= 0,
					).length,
				};
			});

			setAllItems(formatted);
		} finally {
			setLoading(false);
		}
	}, [search, selectedCategories, sortConfig, page, pageSize]);

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);

	useEffect(() => {
		const handler = () => {
			fetchItems();
		};

		window.addEventListener("baybayani:update-table", handler);

		return () => {
			window.removeEventListener("baybayani:update-table", handler);
		};
	}, [fetchItems]);

	// --- CLIENT-SIDE FILTERING ---
	const items = useMemo(() => {
		return allItems
			.filter((item) => {
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
						item.item_category_id
							? String(item.item_category_id)
							: "null",
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
			})
			.sort((a, b) => {
				if (!sortConfig) return 0;

				const { column, direction } = sortConfig;
				const isAsc = direction === "asc";

				if (column === "item_min_price") {
					return isAsc
						? a.item_min_price - b.item_min_price
						: b.item_min_price - a.item_min_price;
				}

				if (column === "variant_stock") {
					return isAsc
						? a.variant_stock - b.variant_stock
						: b.variant_stock - a.variant_stock;
				}

				return 0;
			});
	}, [allItems, search, selectedCategories, sortConfig]);

	return {
		items,
		allItems,
		setAllItems,
		loading,
		error,
		totalCount,
		pageSize,
		refetch: fetchItems,
	};
};
