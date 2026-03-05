import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";

/**
 * Listens in real-time to the `OrderItemUser` table and returns the count of
 * orders whose `status` is "ready" for the given user.
 *
 * This hook is intentionally kept separate from other order-fetching hooks so
 * that the navbar badge has its own lightweight, always-on subscription.
 */
export const useRealtimeReadyOrders = (userId: string | null) => {
	const [readyCount, setReadyCount] = useState(0);
	const [loading, setLoading] = useState(false);

	const fetchReadyCount = useCallback(async () => {
		if (!userId) {
			setReadyCount(0);
			setLoading(false);
			return;
		}

		setLoading(true);

		const { count, error } = await supabase
			.from("OrderItemUser")
			.select("order_item_user_id", { count: "exact", head: true })
			.eq("user_id", userId)
			.eq("status", "Ready")
			.eq("is_soft_deleted", false);

		if (!error) {
			setReadyCount(count ?? 0);
		} else {
			setReadyCount(0);
		}

		setLoading(false);
	}, [userId]);

	// Initial fetch
	useEffect(() => {
		fetchReadyCount();
	}, [fetchReadyCount]);

	// Realtime subscription
	useEffect(() => {
		if (!userId) return;

		const channel = supabase
			.channel(`ready-orders-${userId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "OrderItemUser",
					filter: `user_id=eq.${userId}`,
				},
				async () => {
					await fetchReadyCount();
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [userId, fetchReadyCount]);

	return { readyCount, loading, refetch: fetchReadyCount };
};
