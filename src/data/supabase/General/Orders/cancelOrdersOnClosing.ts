import { supabase } from "@/config/supabaseclient";
import { changeOrderStatus } from "@/data/supabase/Admin/Orders/changeOrderStatus";

/**
 * Automatically cancels pending/ready orders for the current day when the store closes.
 * Notifies the users about the cancellation.
 */
export async function cancelOrdersOnClosing() {
	try {
		// 1. Get today's range (start of current day in local time)
		const now = new Date();
		const startOfDay = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
		).toISOString();

		// 2. Fetch Pending/Ready orders created today that haven't been cancelled/completed
		const { data: orders, error: fetchError } = await supabase
			.from("OrderItemUser")
			.select("order_item_user_id")
			.in("status", ["Pending", "Ready"])
			.gte("created_at", startOfDay)
			.eq("is_soft_deleted", false);

		if (fetchError) throw fetchError;
		if (!orders || orders.length === 0) {
			return { success: true, count: 0 };
		}

		console.log(`Found ${orders.length} orders to cancel upon closing.`);

		const cancelReason = "Store closed, sorry for the inconvenience";
		const notifType = "order_cancelled_closing";

		// 3. Process each order using the centralized changeOrderStatus function
		// We use Promise.all to run them in parallel
		const results = await Promise.all(
			orders.map((order) =>
				changeOrderStatus(
					order.order_item_user_id,
					"Cancelled",
					cancelReason,
					notifType,
				),
			),
		);

		const failed = results.filter((r) => !r.success);
		if (failed.length > 0) {
			console.error(`${failed.length} orders failed to cancel.`);
		}

		return { success: true, count: orders.length - failed.length };
	} catch (error) {
		console.error("Error in cancelOrdersOnClosing:", error);
		return { success: false, error };
	}
}
