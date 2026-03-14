import { useState, useEffect } from "react";
import { supabase } from "@/config/supabaseclient";
import { StockMovement } from "@/model/stockMovement";

export function useFetchStockMovements(
	variantId?: string,
	initialPage = 1,
	pageSize = 20,
) {
	const [movements, setMovements] = useState<StockMovement[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [totalCount, setTotalCount] = useState(0);
	const [page, setPage] = useState(initialPage);

	const fetchMovements = async () => {
		if (!variantId) {
			setMovements([]);
			setTotalCount(0);
			return;
		}

		setIsLoading(true);
		setError(null);
		try {
			const from = (page - 1) * pageSize;
			const to = from + pageSize - 1;

			const {
				data,
				error: fetchError,
				count,
			} = await supabase
				.from("StockMovement")
				.select("*", { count: "exact" })
				.eq("variant_id", variantId)
				.eq("is_soft_deleted", false)
				.order("created_at", { ascending: false })
				.range(from, to);

			if (fetchError) throw fetchError;

			setMovements(data || []);
			setTotalCount(count || 0);
		} catch (err: any) {
			console.error("Error fetching stock movements:", err);
			setError(err.message || "Failed to fetch stock movements");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchMovements();
	}, [variantId, page, pageSize]);

	return {
		movements,
		isLoading,
		error,
		totalCount,
		page,
		setPage,
		refetch: fetchMovements,
		pageSize,
	};
}
