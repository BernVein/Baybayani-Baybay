import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";

export function useOrdersSummary() {
	const [summary, setSummary] = useState({
		completed: 0,
		pending: 0,
		cancelled: 0,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<any>(null);

	const fetchSummary = useCallback(async () => {
		setLoading(true);
		try {
			const { data, error } = await supabase
				.from("OrderItemUser")
				.select("status")
				.eq("is_soft_deleted", false);

			if (error) throw error;

			const counts = {
				completed: 0,
				pending: 0,
				cancelled: 0,
			};

			data?.forEach((order) => {
				if (order.status === "Completed") counts.completed++;
				else if (order.status === "Pending") counts.pending++;
				else if (order.status === "Cancelled") counts.cancelled++;
			});

			setSummary(counts);
		} catch (err) {
			console.error("Failed to fetch orders summary:", err);
			setError(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchSummary();
	}, [fetchSummary]);

	return { ...summary, loading, error, refetch: fetchSummary };
}
