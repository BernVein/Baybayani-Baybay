import { supabase } from "@/config/supabaseclient";

export async function changeOrderQuantity(
	orderId: string,
	orderQuantity: number,
) {
	try {
		if (!orderId) throw new Error("Order ID is required");

		const { error } = await supabase
			.from("OrderItemUser")
			.update({ quantity: orderQuantity })
			.eq("order_item_user_id", orderId);

		if (error) throw error;
	} catch (error) {
		const message =
			error instanceof Error ? error.message : JSON.stringify(error);
		return { success: false, error: message };
	}
}
