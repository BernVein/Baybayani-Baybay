import { supabase } from "@/config/supabaseclient";

export async function changeOrderStatus(
	orderId: string,
	orderStatus: "Pending" | "Ready" | "Completed" | "Cancelled",
) {
	try {
		if (!orderId) throw new Error("Order ID is required");

		// Update order status
		const { error } = await supabase
			.from("OrderItemUser")
			.update({ status: orderStatus })
			.eq("order_item_user_id", orderId);

		if (error) throw error;

		const { data: userData, error: userError } = await supabase
			.from("OrderItemUser")
			.select("User(user_role)")
			.eq("order_item_user_id", orderId)
			.single();

		if (userError) throw userError;

		window.dispatchEvent(new Event("baybayani:update-order-table"));
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const userRole = (userData?.User as any)?.user_role;
		// Send notification if status is "Ready"
		if (orderStatus === "Ready" && userRole !== "Admin") {
			try {
				// Get user ID associated with the order
				const { data: orderData, error: orderError } = await supabase
					.from("OrderItemUser")
					.select(
						"user_id, subtotal, User(user_name), VariantSnapshot(variant_snapshot_name)",
					)
					.eq("order_item_user_id", orderId)
					.single();

				if (orderError || !orderData)
					throw new Error("User not found for order");

				const userId = orderData.user_id;
				const subtotal = orderData.subtotal;
				const userRelation = Array.isArray(orderData.User)
					? orderData.User[0]
					: orderData.User;
				const snapshotRelation = Array.isArray(
					orderData.VariantSnapshot,
				)
					? orderData.VariantSnapshot[0]
					: orderData.VariantSnapshot;
				const user_name = userRelation?.user_name;
				const variant_name = snapshotRelation?.variant_snapshot_name;
				await fetch(
					"https://mnitpbgrbldkrhlzmnpy.supabase.co/functions/v1/send-push-notification",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
							Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
						},
						body: JSON.stringify({
							userId,
							title: "Order Ready",
							body: `Mr/Ms ${user_name}, your order ${variant_name} is now ready! Please prepare payment of ₱${subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Thank you.`,
							data: { orderId },
						}),
					},
				);
			} catch (notifError) {
				console.error("Failed to send notification:", notifError);
			}
		}

		return { success: true };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : JSON.stringify(error);
		return { success: false, error: message };
	}
}
