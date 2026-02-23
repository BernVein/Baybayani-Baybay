import { supabase } from "@/config/supabaseclient";
export async function changeOrderStatus(
	orderId: string,
	orderStatus: "Pending" | "Ready" | "Completed" | "Cancel",
) {
	try {
		if (!orderId) throw new Error("Order ID is required");

		const { error } = await supabase
			.from("OrderItemUser")
			.update({
				status: orderStatus,
			})
			.eq("order_id", orderId);

		if (error) throw error;

		window.dispatchEvent(new Event("baybayani:update-order-table"));

		return { success: true };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : JSON.stringify(error);

		return { success: false, error: message };
	}
}
