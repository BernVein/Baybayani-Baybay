import { supabase } from "@/config/supabaseclient";

export async function changeOrderStatus(
	orderId: string,
	orderStatus: "Pending" | "Ready" | "Completed" | "Cancelled",
	cancelReason?: string,
) {
	try {
		if (!orderId) throw new Error("Order ID is required");

		// Update order status
		const { error } = await supabase
			.from("OrderItemUser")
			.update({
				status: orderStatus,
				...(orderStatus === "Cancelled" && {
					cancel_reason: cancelReason,
				}),
			})
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
		// Send notification if status is "Ready" or "Cancelled"
		if (
			(orderStatus === "Ready" || orderStatus === "Cancelled") &&
			userRole !== "Admin"
		) {
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

				let title = "";
				let body = "";

				if (orderStatus === "Ready") {
					title = "Order Ready";
					body = `Mr/Ms ${user_name}, your order ${variant_name} is now ready! Please prepare payment of ₱${subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Thank you.`;
				} else if (orderStatus === "Cancelled") {
					title = "Order Cancelled";
					body = `Mr/Ms ${user_name}, your order ${variant_name} has been cancelled. Reason: ${cancelReason || "No reason provided"}.`;
				}

				await supabase.functions
					.invoke("send-push-notification", {
						body: {
							userId,
							title,
							body,
							data: { orderId },
						},
					})
					.then(({ data, error }) => {
						if (error) {
							console.error(
								"Failed to send push notification:",
								error,
							);
						} else {
							console.log(
								"Push notification sent successfully:",
								data,
							);
						}
					});

				// Also insert into Notification table for in-app notifications
				const { error: insertError } = await supabase
					.from("Notification")
					.insert({
						user_id: userId,
						title,
						body,
						type:
							orderStatus === "Ready"
								? "order_ready"
								: "order_cancelled",
						data: { orderId },
					});

				if (insertError) {
					console.error("Error inserting notification:", insertError);
				}
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
