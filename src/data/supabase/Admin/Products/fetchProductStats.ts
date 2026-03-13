import { useState, useEffect } from "react";
import { supabase } from "@/config/supabaseclient";

export function fetchProductStats() {
	const [lastItemDate, setLastItemDate] = useState<string | null>(null);
	const [lowStockCount, setLowStockCount] = useState<number | null>(null);
	const [totalItems, setTotalItems] = useState<number>(0);
	const [totalInventory, setTotalInventory] = useState<number>(0);
	const [totalCategories, setTotalCategories] = useState<number>(0);
	const [totalTags, setTotalTags] = useState<number>(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<any>(null);

	useEffect(() => {
		async function fetchStats() {
			setLoading(true);
			try {
				// 1. Get the last item added and total item count
				const {
					data: lastItem,
					count: itemCount,
					error: lastItemError,
				} = await supabase
					.from("Item")
					.select("created_at", { count: "exact" })
					.eq("is_soft_deleted", false)
					.order("created_at", { ascending: false })
					.limit(1)
					.maybeSingle();

				if (lastItemError) throw lastItemError;
				setLastItemDate(lastItem?.created_at ?? null);
				setTotalItems(itemCount ?? 0);

				// 2. Get all variants for inventory and low stock calculation
				const { data: variants, error: variantError } = await supabase
					.from("Variant")
					.select(
						`
                            variant_id,
                            variant_low_stock_threshold,
                            StockMovement(
                                effective_stocks,
                                created_at
                            )
                        `,
					)
					.eq("is_soft_deleted", false);

				if (variantError) throw variantError;

				let totalInv = 0;
				let lowStock = 0;

				variants?.forEach((v) => {
					if (!v.StockMovement || v.StockMovement.length === 0)
						return;

					// Find the latest by created_at
					const latest = v.StockMovement.reduce((a: any, b: any) =>
						new Date(a.created_at) > new Date(b.created_at) ? a : b,
					);

					totalInv += latest.effective_stocks ?? 0;

					if (
						latest.effective_stocks <=
						(v.variant_low_stock_threshold ?? 0)
					) {
						lowStock++;
					}
				});

				setTotalInventory(totalInv);
				setLowStockCount(lowStock);

				// 3. Get category count
				const { count: catCount, error: catError } = await supabase
					.from("Category")
					.select("*", { count: "exact", head: true })
					.eq("is_soft_deleted", false);

				if (catError) throw catError;
				setTotalCategories(catCount ?? 0);

				// 4. Get tag count
				const { count: tagCount, error: tagError } = await supabase
					.from("Tag")
					.select("*", { count: "exact", head: true })
					.eq("is_soft_deleted", false);

				if (tagError) throw tagError;
				setTotalTags(tagCount ?? 0);
			} catch (err) {
				console.error("Failed to fetch product stats:", err);
				setError(err);
			} finally {
				setLoading(false);
			}
		}

		fetchStats();
	}, []);

	return {
		lastItemDate,
		lowStockCount,
		totalItems,
		totalInventory,
		totalCategories,
		totalTags,
		loading,
		error,
	};
}
