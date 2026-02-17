import { useState, useEffect } from "react";
import { supabase } from "@/config/supabaseclient";

export function fetchProductStats() {
	const [lastItemDate, setLastItemDate] = useState<string | null>(null);
	const [lowStockCount, setLowStockCount] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<any>(null);

	useEffect(() => {
		async function fetchStats() {
			setLoading(true);
			try {
				// 1. Get the last item added
				const { data: lastItem, error: lastItemError } = await supabase
					.from("Item")
					.select("created_at")
					.order("created_at", { ascending: false })
					.limit(1)
					.single();

				if (lastItemError) throw lastItemError;
				setLastItemDate(lastItem?.created_at ?? null);

				// 2. Get all variants with ONLY the latest StockMovement
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

				// Pick latest stock movement per variant
				const lowStock = variants?.filter((v) => {
					if (!v.StockMovement || v.StockMovement.length === 0)
						return false;

					// Find the latest by created_at
					const latest = v.StockMovement.reduce((a, b) =>
						new Date(a.created_at) > new Date(b.created_at) ? a : b,
					);

					return (
						latest.effective_stocks <= v.variant_low_stock_threshold
					);
				}).length;

				setLowStockCount(lowStock ?? 0);
			} catch (err) {
				console.error("Failed to fetch product stats:", err);
				setError(err);
				setLastItemDate(null);
				setLowStockCount(null);
			} finally {
				setLoading(false);
			}
		}

		fetchStats();
	}, []);

	return { lastItemDate, lowStockCount, loading, error };
}
