import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";
import { format } from "date-fns";

export interface DashboardStats {
	totalRevenue: number;
	totalOrders: {
		completed: number;
		cancelled: number;
		pending: number;
	};
	totalCustomers: {
		individual: number;
		cooperative: number;
	};
	revenueTrend: { date: string; amount: number }[];
	orderTrend: { date: string; completed: number; cancelled: number }[];
	lowStockItems: {
		id: string;
		name: string;
		stock: number;
		unit: string;
		image: string;
	}[];
	newCustomersCount: number;
	topOrderedItems: {
		id: string;
		name: string;
		count: number;
		image: string;
	}[];
}

export function useDashboardStats(
	dateRange: { start: string; end: string } | null,
) {
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<any>(null);

	const fetchStats = useCallback(async () => {
		if (!dateRange) return;
		setLoading(true);
		setError(null);

		try {
			const { start, end } = dateRange;

			// 1. Total Revenue & Orders Summary (from OrderItemUser)
			const { data: orderData, error: orderError } = await supabase
				.from("OrderItemUser")
				.select("subtotal, status, created_at, Item(item_title)")
				.gte("created_at", start)
				.lte("created_at", end)
				.eq("is_soft_deleted", false);

			if (orderError) throw orderError;

			let totalRev = 0;
			let completedCount = 0;
			let cancelledCount = 0;
			let pendingCount = 0;
			const dailyRevenue: Record<string, number> = {};
			const dailyOrders: Record<
				string,
				{ completed: number; cancelled: number; pending: number }
			> = {};

			orderData?.forEach((order: any) => {
				const date = format(new Date(order.created_at), "yyyy-MM-dd");

				if (!dailyRevenue[date]) dailyRevenue[date] = 0;
				if (!dailyOrders[date])
					dailyOrders[date] = {
						completed: 0,
						cancelled: 0,
						pending: 0,
					};

				if (order.status === "Completed") {
					totalRev += order.subtotal || 0;
					completedCount++;
					dailyRevenue[date] += order.subtotal || 0;
					dailyOrders[date].completed++;
				} else if (order.status === "Cancelled") {
					cancelledCount++;
					dailyOrders[date].cancelled++;
				} else {
					// Count Pending, Processing, Shipped as pending actions
					pendingCount++;
					dailyOrders[date].pending++;
				}
			});

			// 2. Customer Counts (Approved users)
			const { data: userData, error: userError } = await supabase
				.from("User")
				.select("user_role, created_at")
				.eq("user_status", "Approved")
				.eq("is_soft_deleted", false);

			if (userError) throw userError;

			let individualCount = 0;
			let cooperativeCount = 0;
			let newCustomersCount = 0;

			userData?.forEach((u) => {
				if (u.user_role === "Individual") individualCount++;
				else if (u.user_role === "Cooperative") cooperativeCount++;

				const userCreatedAt = new Date(u.created_at);
				if (
					userCreatedAt >= new Date(start) &&
					userCreatedAt <= new Date(end) &&
					u.user_role !== "Admin"
				) {
					newCustomersCount++;
				}
			});

			// 3. Low Stock Items (from Variant & StockMovement)
			const { data: variants, error: variantError } = await supabase
				.from("Variant")
				.select(
					`
					variant_id,
					variant_name,
					variant_low_stock_threshold,
					Item(
						item_title, 
						item_sold_by,
						Item_Image(item_image_url)
					),
					StockMovement(effective_stocks, created_at)
				`,
				)
				.eq("is_soft_deleted", false)
				.order("created_at", {
					foreignTable: "StockMovement",
					ascending: false,
				})
				.limit(1, { foreignTable: "StockMovement" });

			if (variantError) throw variantError;

			const lowStockItems: DashboardStats["lowStockItems"] = [];
			variants?.forEach((v: any) => {
				const latest = v.StockMovement?.[0];
				if (!latest) return;

				if (
					latest.effective_stocks <=
					(v.variant_low_stock_threshold ?? 0)
				) {
					lowStockItems.push({
						id: v.variant_id,
						name: v.variant_name,
						stock: latest.effective_stocks,
						unit: v.Item?.item_sold_by || "",
						image: v.Item?.Item_Image?.[0]?.item_image_url || "",
					});
				}
			});

			// 4. Top Ordered Variants (using orderData from step 1)
			const topOrderedRaw: Record<
				string,
				{ name: string; count: number; image: string }
			> = {};
			const { data: topItemsDetails, error: topItemsError } =
				await supabase
					.from("OrderItemUser")
					.select(
						"Item(item_title, Item_Image(item_image_url)), VariantSnapshot(variant_snapshot_name, variant_copy_snapshot_id)",
					)
					.eq("status", "Completed")
					.eq("is_soft_deleted", false)
					.gte("created_at", start)
					.lte("created_at", end);

			if (topItemsError) throw topItemsError;

			topItemsDetails?.forEach((oi: any) => {
				const variantId = oi.VariantSnapshot?.variant_copy_snapshot_id;
				if (!variantId) return;
				if (!topOrderedRaw[variantId]) {
					topOrderedRaw[variantId] = {
						name: oi.VariantSnapshot.variant_snapshot_name || "",
						count: 0,
						image: oi.Item?.Item_Image?.[0]?.item_image_url || "",
					};
				}
				topOrderedRaw[variantId].count++;
			});

			const topOrderedItems = Object.entries(topOrderedRaw)
				.map(([id, val]) => ({ id, ...val }))
				.sort((a, b) => b.count - a.count)
				.slice(0, 10);

			// Trends formatting
			const revenueTrend = Object.entries(dailyRevenue)
				.map(([date, amount]) => ({ date, amount }))
				.sort((a, b) => a.date.localeCompare(b.date));
			const orderTrend = Object.entries(dailyOrders)
				.map(([date, counts]) => ({ date, ...counts }))
				.sort((a, b) => a.date.localeCompare(b.date));

			setStats({
				totalRevenue: totalRev,
				totalOrders: {
					completed: completedCount,
					cancelled: cancelledCount,
					pending: pendingCount,
				},
				totalCustomers: {
					individual: individualCount,
					cooperative: cooperativeCount,
				},
				revenueTrend,
				orderTrend,
				lowStockItems,
				newCustomersCount,
				topOrderedItems,
			});
		} catch (err) {
			console.error("Dashboard stats fetch error:", err);
			setError(err);
		} finally {
			setLoading(false);
		}
	}, [dateRange]);

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	return { stats, loading, error, refetch: fetchStats };
}
